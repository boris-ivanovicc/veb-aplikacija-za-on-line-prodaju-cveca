import { Request, Response } from "express";
import * as adService from '../services/adService';

export const getActiveAds = async (req: Request, res: Response) => {
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
    console.error('Ad Controller Error: ', error);
    return res.status(500).json({
      success: false,
      error: 'Internal server error.'
    });
  }
};

export const getAdById = async (req: Request, res: Response) => {
  try{
    const adId = Number(req.params.id);

    if (isNaN(adId)) {
      return res.status(400).json({
        success: false,
        error: 'Advertisement ID must be a valid number.'
      });
    }

    const ad = await adService.getAdById(adId);

    if(!ad) {
      return res.status(404).json({
        success: false,
        error: 'Advertisement not found.'
      });
    }

    return res.status(200).json({
      success: true,
      data: ad
    });
  } catch (error) {
    console.error('Get Ad By Id Controller Error: ', error);
    return res.status(500).json({
      success: false,
      error: 'Internal server error.'
    });
  }
};

export const createAd = async (req: Request, res: Response) => {
  try{
    const newAd = await adService.createAd(req.body);

    return res.status(201).json({
      success: true,
      data: newAd
    });
  } catch (error) {
    console.error('Create Ad Controller Error: ', error);
    return res.status(500).json({
      success: false,
      error: 'Internal server error while creating advertisement.'
    });
  }
};

export const updateAd = async (req: Request, res: Response) => {
  try {
    const adId = Number(req.params.id);

    if (isNaN(adId)) {
      return res.status(400).json({
        success: false,
        error: 'Advertisement ID must be a valid number.'
      });
    }

    const updatedAd = await adService.updateAd(adId, req.body);

    return res.status(200).json({
      success: true,
      data: updatedAd
    });
  } catch (error: any) {
    console.error('Update Ad Controller Error: ', error);

    if (error.message?.includes('not found')) {
      return res.status(404).json({
        success: false,
        error: error.message
      });
    }

    return res.status(500).json({
      success: false,
      error: 'Internal server error while updating advertisement.'
    });
  }
};

export const deleteAd = async (req: Request, res: Response) => {
  try {
    const adId = Number(req.params.id);

    if (isNaN(adId)) {
      return res.status(400).json({
        success: false,
        error: 'Advertisement ID must be a valid number.'
      });
    }

    const deletedAd = await adService.deleteAd(adId);

    return res.status(200).json({
      success: true,
      data: deletedAd
    });
  } catch (error: any) {
    console.error('Delete Ad Controller Error: ', error);

    if (error.message?.includes('not found')) {
      return res.status(404).json({
        success: false,
        error: error.message
      });
    }

    return res.status(500).json({
      success: false,
      error: 'Internal server error while deleting advertisement.'
    });
  }
};