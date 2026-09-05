import pool from '../config/db';
import { AdInput, AdUpdateInput, AdImageInput } from "./types";
import { releaseExpiredReservations } from './cartService';

const buildAdImagesPayload = (images?: AdImageInput[]) => {
  if (!images || images.length === 0) {
    return [{
      original_url: "images/default-flower-image.jpg",
      thumbnail_url: "images/default-flower-thumbnail.jpg",
      file_type: "jpeg",
      is_cover: true
    }];
  }

  const hasCoverSet = images.some(img => Number(img.is_cover) === 1);

  return images.map((img, index) => {
    let cleanType = "jpeg";

    if (typeof img.file_type === "string" && img.file_type.length < 20) {
      cleanType = img.file_type.toLowerCase().includes("png") ? "png" : "jpeg";
    } else if (typeof img.original_url === "string" && img.original_url.startsWith("data:image/")) {
      cleanType = img.original_url.includes("png") ? "png" : "jpeg";
    }

    return {
      original_url: img.original_url,
      thumbnail_url: img.thumbnail_url || "",
      file_type: cleanType,
      is_cover: hasCoverSet ? (Number(img.is_cover) === 1) : (index === 0)
    };
  });
};

export const getActiveAds = async (pageNumber: number, itemsPerPage: number) => {
  await releaseExpiredReservations();

  const skipAmount = (pageNumber - 1) * itemsPerPage;

  const [countResult] = await pool.query(
    `SELECT COUNT(*) as total 
     FROM ads 
     WHERE (status = 'available' OR status IS NULL) 
       AND (ad_status = 'active' OR ad_status IS NULL)`
  );
  const totalCount = (countResult as any[])[0].total;

  const [ads] = await pool.query(`
    SELECT 
      a.*,
      f.flower_name,
      f.occasion,
      f.size_cm,
      f.origin,
      f.lifespan_days,
      f.is_potted,
      u.id as user_id,
      u.display_name,
      u.avatar_url
    FROM ads a
    LEFT JOIN flower_details f ON a.id = f.ad_id
    LEFT JOIN users u ON a.user_id = u.id
    WHERE (a.status = 'available' OR a.status IS NULL)
      AND (a.ad_status = 'active' OR a.ad_status IS NULL)
    ORDER BY a.created_at DESC
    LIMIT ? OFFSET ?
  `, [itemsPerPage, skipAmount]);

  const adList = ads as any[];
  if (adList.length === 0) {
    return { ads: [], totalCount };
  }

  const adIds = adList.map(ad => ad.id);

  const [imagesRows] = await pool.query(`
    SELECT id, ad_id, original_url, thumbnail_url, file_type, is_cover
    FROM ad_images
    WHERE ad_id IN (?)
    ORDER BY is_cover DESC
  `, [adIds]);

  const imagesList = imagesRows as any[];

  const parsedAds = adList.map(ad => {
    const adImages = imagesList
      .filter(img => img.ad_id === ad.id)
      .map(img => ({
        id: img.id,
        original_url: img.original_url,
        thumbnail_url: img.thumbnail_url,
        file_type: img.file_type,
        is_cover: Boolean(img.is_cover)
      }));

    return {
      ...ad,
      ad_images: adImages.length > 0 ? adImages : [{
        original_url: "images/default-flower-image.jpg",
        thumbnail_url: "images/default-flower-thumbnail.jpg",
        file_type: "jpeg",
        is_cover: true
      }]
    };
  });

  return {
    ads: parsedAds,
    totalCount
  };
};

export const getAdById = async (adId: number) => {
  const [rows] = await pool.query(`
    SELECT 
      a.*,
      f.flower_name,
      f.occasion,
      f.size_cm,
      f.origin,
      f.lifespan_days,
      f.is_potted,
      u.id as user_id,
      u.display_name,
      u.avatar_url,
      u.created_at as user_created_at
    FROM ads a
    LEFT JOIN flower_details f ON a.id = f.ad_id
    LEFT JOIN users u ON a.user_id = u.id
    WHERE a.id = ?
  `, [adId]);

  const ads = rows as any[];
  if (ads.length === 0) {
    return null;
  }

  const ad = ads[0];

  const [imageRows] = await pool.query(`
    SELECT id, original_url, thumbnail_url, file_type, is_cover
    FROM ad_images
    WHERE ad_id = ?
    ORDER BY is_cover DESC
  `, [adId]);

  ad.ad_images = (imageRows as any[]).map(img => ({
    ...img,
    is_cover: Boolean(img.is_cover)
  }));

  if (ad.user_id) {
    ad.users = {
      id: ad.user_id,
      display_name: ad.display_name,
      avatar_url: ad.avatar_url,
      created_at: ad.user_created_at
    };
    delete ad.user_id;
    delete ad.display_name;
    delete ad.avatar_url;
    delete ad.user_created_at;
  }

  if (ad.flower_name) {
    ad.flower_details = {
      flower_name: ad.flower_name,
      occasion: ad.occasion,
      size_cm: ad.size_cm,
      origin: ad.origin,
      lifespan_days: ad.lifespan_days,
      is_potted: ad.is_potted
    };
    delete ad.flower_name;
    delete ad.occasion;
    delete ad.size_cm;
    delete ad.origin;
    delete ad.lifespan_days;
    delete ad.is_potted;
  }

  return ad;
};

export const createAd = async (input: AdInput) => {
  if (!input.title || input.price === undefined || !input.user_id || !input.details?.flower_name) {
    throw new Error("Missing required fields to create an ad.");
  }

  const connection = await pool.getConnection();
  await connection.beginTransaction();

  try {
    const endsAtValue = input.ends_at || input.ends_at || null;

    const [adResult] = await connection.query(
      `INSERT INTO ads (title, ad_description, price, location, ends_at, user_id, ad_status) 
       VALUES (?, ?, ?, ?, ?, ?, ?)`,
      [
        input.title,
        input.ad_description || '',
        input.price,
        input.location || null,
        endsAtValue,
        input.user_id,
        'active'
      ]
    );
    const adId = (adResult as any).insertId;

    await connection.query(
      `INSERT INTO flower_details (ad_id, flower_name, occasion, size_cm, origin, lifespan_days, is_potted)
       VALUES (?, ?, ?, ?, ?, ?, ?)`,
      [
        adId,
        input.details.flower_name,
        input.details.occasion || null,
        input.details.size_cm || null,
        input.details.origin || null,
        input.details.lifespan_days || null,
        input.details.is_potted || false
      ]
    );

    const imagePayload = buildAdImagesPayload(input.images);

    for (const img of imagePayload) {
      const safeFileType = img.file_type === 'png' ? 'png' : 'jpeg';

      await connection.query(
        `INSERT INTO ad_images 
         (ad_id, original_url, thumbnail_url, file_type, is_cover)
         VALUES (?, ?, ?, ?, ?)`,
        [
          adId,
          img.original_url,
          img.thumbnail_url ?? null,
          safeFileType,
          img.is_cover ? 1 : 0
        ]
      );
    }

    await connection.commit();
    connection.release();

    return await getAdById(adId);
  } catch (error) {
    await connection.rollback();
    connection.release();
    throw error;
  }
};

export const updateAd = async (adId: number, input: AdUpdateInput) => {
  const existingAd = await getAdById(adId);
  if (!existingAd) {
    throw new Error(`Ad with ID ${adId} not found.`);
  }

  const connection = await pool.getConnection();
  await connection.beginTransaction();

  try {
    const updates: string[] = [];
    const values: any[] = [];

    if (input.title !== undefined) {
      updates.push('title = ?');
      values.push(input.title);
    }
    if (input.ad_description !== undefined) {
      updates.push('ad_description = ?');
      values.push(input.ad_description);
    }
    if (input.price !== undefined) {
      updates.push('price = ?');
      values.push(input.price);
    }
    if (input.location !== undefined) {
      updates.push('location = ?');
      values.push(input.location);
    }

    const endsAtInput = input.ends_at !== undefined ? input.ends_at : input.ends_at;
    if (endsAtInput !== undefined) {
      updates.push('ends_at = ?');
      values.push(endsAtInput);
    }

    if (updates.length > 0) {
      values.push(adId);
      await connection.query(
        `UPDATE ads SET ${updates.join(', ')} WHERE id = ?`,
        values
      );
    }

    if (input.details) {
      const flowerUpdates: string[] = [];
      const flowerValues: any[] = [];

      if (input.details.flower_name !== undefined) {
        flowerUpdates.push('flower_name = ?');
        flowerValues.push(input.details.flower_name);
      }
      if (input.details.occasion !== undefined) {
        flowerUpdates.push('occasion = ?');
        flowerValues.push(input.details.occasion);
      }
      if (input.details.size_cm !== undefined) {
        flowerUpdates.push('size_cm = ?');
        flowerValues.push(input.details.size_cm);
      }
      if (input.details.origin !== undefined) {
        flowerUpdates.push('origin = ?');
        flowerValues.push(input.details.origin);
      }
      if (input.details.lifespan_days !== undefined) {
        flowerUpdates.push('lifespan_days = ?');
        flowerValues.push(input.details.lifespan_days);
      }
      if (input.details.is_potted !== undefined) {
        flowerUpdates.push('is_potted = ?');
        flowerValues.push(input.details.is_potted);
      }

      if (flowerUpdates.length > 0) {
        flowerValues.push(adId);
        await connection.query(
          `UPDATE flower_details SET ${flowerUpdates.join(', ')} WHERE ad_id = ?`,
          flowerValues
        );
      }
    }

    await connection.commit();
    connection.release();

    return await getAdById(adId);
  } catch (error) {
    await connection.rollback();
    connection.release();
    throw error;
  }
};

export const deleteAd = async (adId: number) => {
  const existingAd = await getAdById(adId);
  if (!existingAd) {
    throw new Error(`Ad with ID ${adId} not found.`);
  }

  await pool.query(
    `UPDATE ads SET ad_status = ? WHERE id = ?`,
    ['deleted', adId]
  );

  return { success: true, id: adId };
};