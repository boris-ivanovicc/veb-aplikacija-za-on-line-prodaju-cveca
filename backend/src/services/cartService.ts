import pool from '../config/db';


export const releaseExpiredReservations = async () => {
  await pool.query(`
    UPDATE ads a
    JOIN cart_items ci ON a.id = ci.ad_id
    SET a.status = 'available'
    WHERE ci.status = 'reserved' AND ci.reserved_until < NOW()
  `);

  await pool.query(`
    DELETE FROM cart_items 
    WHERE status = 'reserved' AND reserved_until < NOW()
  `);
};


export const addToCart = async (userId: number, adId: number) => {
  await releaseExpiredReservations();

  const connection = await pool.getConnection();
  try {
    await connection.beginTransaction();

    const [ads]: any = await connection.query(
      'SELECT status, ad_status FROM ads WHERE id = ? FOR UPDATE', 
      [adId]
    );

    if (ads.length === 0) {
      throw new Error("Flower ad not found.");
    }

    const currentStatus = ads[0].status;
    
    if (currentStatus === 'reserved' || currentStatus === 'sold') {
      throw new Error("This flower is currently reserved or sold.");
    }

    let [carts]: any = await connection.query(
      'SELECT id FROM carts WHERE user_id = ?', 
      [userId]
    );
    let cartId = carts[0]?.id;

    if (!cartId) {
      const [newCart]: any = await connection.query(
        'INSERT INTO carts (user_id) VALUES (?)', 
        [userId]
      );
      cartId = newCart.insertId;
    }

    await connection.query(`
      INSERT INTO cart_items (cart_id, ad_id, status, reserved_until)
      VALUES (?, ?, 'reserved', TIMESTAMPADD(HOUR, 1, NOW()))
    `, [cartId, adId]);

    await connection.query("UPDATE ads SET status = 'reserved' WHERE id = ?", [adId]);

    await connection.commit();
    return { success: true };
  } catch (error) {
    await connection.rollback();
    throw error;
  } finally {
    connection.release();
  }
};

export const removeItem = async (userId: number, itemId: number) => {
  const connection = await pool.getConnection();
  try {
    await connection.beginTransaction();

    const [items]: any = await connection.query(`
      SELECT ci.ad_id 
      FROM cart_items ci
      JOIN carts c ON ci.cart_id = c.id
      WHERE ci.id = ? AND c.user_id = ?
    `, [itemId, userId]);

    if (items.length > 0) {
      const adId = items[0].ad_id;
      await connection.query('DELETE FROM cart_items WHERE id = ?', [itemId]);
      await connection.query("UPDATE ads SET status = 'available' WHERE id = ?", [adId]);
    }

    await connection.commit();
    return { success: true };
  } catch (error) {
    await connection.rollback();
    throw error;
  } finally {
    connection.release();
  }
};

export const getCart = async (userId: number) => {
  await releaseExpiredReservations();

  const [rows]: any = await pool.query(`
    SELECT 
      ci.id as item_id,
      ci.ad_id,
      ci.reserved_until,
      TIMESTAMPDIFF(MINUTE, NOW(), ci.reserved_until) as minutes_remaining,
      a.title,
      a.price,
      (
        SELECT ai.original_url 
        FROM ad_images ai 
        WHERE ai.ad_id = a.id 
        ORDER BY ai.is_cover DESC LIMIT 1
      ) as cover_image
    FROM cart_items ci
    JOIN carts c ON ci.cart_id = c.id
    JOIN ads a ON ci.ad_id = a.id
    WHERE c.user_id = ? AND ci.status = 'reserved' AND ci.reserved_until > NOW()
  `, [userId]);

  return rows;
};

export const checkout = async (userId: number) => {
  await releaseExpiredReservations();
  const connection = await pool.getConnection();

  try {
    await connection.beginTransaction();

    const [cartItems]: any = await connection.query(`
      SELECT ci.ad_id 
      FROM cart_items ci
      JOIN carts c ON ci.cart_id = c.id
      WHERE c.user_id = ? AND ci.status = 'reserved' AND ci.reserved_until > NOW()
    `, [userId]);

    if (cartItems.length === 0) {
      throw new Error("Your cart is empty or your reservation expired.");
    }

    const adIds = cartItems.map((item: any) => item.ad_id);

    await connection.query(`
      UPDATE cart_items ci
      JOIN carts c ON ci.cart_id = c.id
      SET ci.status = 'purchased', ci.purchased_at = NOW()
      WHERE c.user_id = ? AND ci.status = 'reserved'
    `, [userId]);

    await connection.query(
      "UPDATE ads SET status = 'sold' WHERE id IN (?)",
      [adIds]
    );

    await connection.commit();
    return { success: true };
  } catch (error) {
    await connection.rollback();
    throw error;
  } finally {
    connection.release();
  }
};

export const getPurchases = async (userId: number) => {
  const [rows]: any = await pool.query(`
    SELECT 
      ci.id as purchase_id,
      ci.purchased_at,
      a.title,
      a.price,
      (
        SELECT ai.original_url 
        FROM ad_images ai 
        WHERE ai.ad_id = a.id 
        ORDER BY ai.is_cover DESC LIMIT 1
      ) as cover_image
    FROM cart_items ci
    JOIN carts c ON ci.cart_id = c.id
    JOIN ads a ON ci.ad_id = a.id
    WHERE c.user_id = ? AND ci.status = 'purchased'
    ORDER BY ci.purchased_at DESC
  `, [userId]);

  return rows;
};