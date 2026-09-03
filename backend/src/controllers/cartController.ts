import * as cartService from "../services/cartService";

export const getCart = async (req: any, res: any) => {
  try {
    const userId = req.user?.id || req.user?.userId;
    const items = await cartService.getCart(userId);
    return res.status(200).json({ success: true, data: { items } });
  } catch (error: any) {
    return res.status(500).json({ error: error.message });
  }
};

export const getPurchases = async (req: any, res: any) => {
  try {
    const userId = req.user?.id || req.user?.userId;
    const purchases = await cartService.getPurchases(userId);
    return res.status(200).json({ success: true, data: purchases });
  } catch (error: any) {
    return res.status(500).json({ error: error.message });
  }
};

export const addToCart = async (req: any, res: any) => {
  try {
    const userId = req.user?.id || req.user?.userId;
    const { ad_id } = req.body;

    if (!ad_id) {
      return res.status(400).json({ error: "ad_id is required" });
    }

    await cartService.addToCart(userId, Number(ad_id));
    return res.status(200).json({ success: true, message: "Item added to cart." });
  } catch (error: any) {
    return res.status(400).json({ error: error.message });
  }
};

export const handleCheckout = async (req: any, res: any) => {
  try {
    const userId = req.user?.id || req.user?.userId;

    if (!userId) {
      return res.status(401).json({ error: "User authentication failed." });
    }

    await cartService.checkout(userId);
    return res.status(200).json({ success: true, message: "Checkout complete!" });
  } catch (error: any) {
    console.error("Checkout Error:", error);
    return res.status(400).json({ error: error.message || "Checkout failed." });
  }
};

export const removeItem = async (req: any, res: any) => {
  try {
    const userId = req.user?.id || req.user?.userId;
    const { itemId } = req.params;

    await cartService.removeItem(userId, Number(itemId));
    return res.status(200).json({ success: true, message: "Item removed." });
  } catch (error: any) {
    return res.status(500).json({ error: error.message });
  }
};