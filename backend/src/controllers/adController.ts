import { Response } from "express";
import * as adService from "../services/adService";
import { AuthRequest } from "../middleware/authMiddleware";

export const getActiveAds = async (req: AuthRequest, res: Response) => {
  try {
    const page = parseInt(req.query.page as string) || 1;
    const limit = parseInt(req.query.limit as string) || 12;

    const { ads, totalCount } = await adService.getActiveAds(page, limit);
    const totalPages = Math.ceil(totalCount / limit);

    return res.status(200).json({
      success: true,
      data: ads,
      pagination: {
        total_items: totalCount,
        current_page: page,
        per_page: limit,
        total_pages: totalPages,
        has_more: page < totalPages
      }
    });
  } catch (error) {
    console.error("Ad Controller Error: ", error);
    return res.status(500).json({
      success: false,
      error: "Internal server error."
    });
  }
};

export const getAdById = async (req: AuthRequest, res: Response) => {
  try {
    const adId = Number(req.params.id);

    if (isNaN(adId)) {
      return res.status(400).json({
        success: false,
        error: "Advertisement ID must be a valid number."
      });
    }

    const ad = await adService.getAdById(adId);

    if (!ad) {
      return res.status(404).json({
        success: false,
        error: "Advertisement not found."
      });
    }

    return res.status(200).json({
      success: true,
      data: ad
    });
  } catch (error) {
    console.error("Get Ad By Id Controller Error: ", error);
    return res.status(500).json({
      success: false,
      error: "Internal server error."
    });
  }
};

export const createAd = async (req: AuthRequest, res: Response) => {
  try {
    const newAd = await adService.createAd({
      ...req.body,
      user_id: req.user!.id
    });

    return res.status(201).json({
      success: true,
      data: newAd
    });
  } catch (error) {
    console.error("Create Ad Controller Error: ", error);
    return res.status(500).json({
      success: false,
      error: "Internal server error while creating advertisement."
    });
  }
};

export const updateAd = async (req: AuthRequest, res: Response) => {
  try {
    const adId = Number(req.params.id);
    const userId = req.user!.id;

    if (isNaN(adId)) {
      return res.status(400).json({
        success: false,
        error: "Advertisement ID must be a valid number."
      });
    }

    const existingAd = await adService.getAdById(adId);
    if (!existingAd) {
      return res.status(404).json({
        success: false,
        error: "Ad not found."
      });
    }

    if (existingAd.users.id !== userId) {
      return res.status(403).json({
        success: false,
        error: "Unauthorized access."
      });
    }

    const updatedAd = await adService.updateAd(adId, req.body);
    return res.status(200).json({
      success: true,
      data: updatedAd
    });
  } catch (error: any) {
    console.error("Update Ad Error:", error);

    if (error.message?.includes("not found")) {
      return res.status(404).json({
        success: false,
        error: error.message
      });
    }

    return res.status(500).json({
      success: false,
      error: "Internal server error while updating advertisement."
    });
  }
};

export const deleteAd = async (req: AuthRequest, res: Response) => {
  try {
    const adId = Number(req.params.id);
    const userId = req.user!.id;

    if (isNaN(adId)) {
      return res.status(400).json({
        success: false,
        error: "Advertisement ID must be a valid number."
      });
    }

    const existingAd = await adService.getAdById(adId);
    if (!existingAd) {
      return res.status(404).json({
        success: false,
        error: "Ad not found"
      });
    }

    if (existingAd.users.id !== userId) {
      return res.status(403).json({
        success: false,
        error: "Unauthorized access"
      });
    }

    const deletedAd = await adService.deleteAd(adId);
    return res.status(200).json({
      success: true,
      data: deletedAd
    });
  } catch (error: any) {
    console.error("Delete Ad Error:", error);

    if (error.message?.includes("not found")) {
      return res.status(404).json({
        success: false,
        error: error.message
      });
    }

    return res.status(500).json({
      success: false,
      error: "Internal server error while deleting advertisement."
    });
  }
};
