const { Request, Response } = require('express');
const adService = require('../services/adService');

const getActiveAds = async (req: typeof Request, res: typeof Response) => {
  try {
    const page = parseInt(req.query.page as string) || 1;
    const limit = parseInt(req.query.limit as string) || 12;

    const { ads, totalCount } = await adService.fetchActiveAds(page, limit);
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

const getAdById = async (req: typeof Request, res: typeof Response) => {
  try{
    const {id} = req.params;

    const ad = await adService.getAdById(id);

    if(!ad) {
      return res.status(404).json({
        success: false,
        error: 'Advertisement not found'
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

module.exports = {
  getActiveAds,
  getAdById
}