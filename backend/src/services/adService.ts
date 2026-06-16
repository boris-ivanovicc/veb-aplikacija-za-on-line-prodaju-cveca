import { AdInput, AdUpdateInput, AdImageInput } from "./types.js";
import prisma from '../db.js';

const buildAdImagesPayload = (images?: AdImageInput[]) => {
  if (!images || images.length === 0) {
    return [{
      original_url: "images/default-flower-image.jpg",
      thumbnail_url: "images/default-flower-thumbnail.jpg",
      file_type: 'image_jpeg' as const,
      is_cover: true
    }];
  }

  return images.map((img, index) => {
    const isCover = index === 0;
    
    return {
      original_url: img.original_url,
      thumbnail_url: isCover ? (img.thumbnail_url || "") : "",
      file_type: img.file_type?.toLowerCase().includes('png') ? ('image_png' as const) : ('image_jpeg' as const),
      is_cover: isCover
    };
  });
};

const getActiveAds = async (pageNumber: number, itemsPerPage: number) => {
  const skipAmount = (pageNumber - 1) * itemsPerPage;

  const [ads, totalCount] = await prisma.$transaction([
    prisma.ads.findMany({
      where: { ad_status: 'active' },
      skip: skipAmount,
      take: itemsPerPage,
      include: {
        flower_details: true,
        ad_images: {
          orderBy: { is_cover: 'desc' }
        },
        users: {
          select: {
            id: true,
            display_name: true,
            avatar_url: true
          }
        }
      },
      orderBy: { created_at: 'desc' }
    }),
    prisma.ads.count({
      where: { ad_status: 'active' }
    })
  ]);

  return {
    ads,
    totalCount
  };
};

const getAdById = async (adId: number) => {
  const ad = await prisma.ads.findUnique({
    where: { id: adId },
    include: {
      flower_details: true,
      ad_images: {
        orderBy: { is_cover: 'desc' }
      },
      users: {
        select: {
          id: true,
          display_name: true,
          avatar_url: true,
          created_at: true
        }
      }
    }
  });

  return ad;
};

const createAd = async (input: AdInput) => {
  if (!input.title || !input.price || !input.user_id || !input.details?.flower_name) {
    throw new Error("Missing required fields to create an ad.");
  }

  const newAd = await prisma.ads.create({
    data: {
      title: input.title,
      ad_description: input.ad_description,
      price: input.price,
      user_id: input.user_id,
      ad_status: 'active',

      flower_details: {
        create: {
          flower_name: input.details.flower_name,
          occasion: input.details.occasion,
          size_cm: input.details.size_cm,
          origin: input.details.origin,
          lifespan_days: input.details.lifespan_days,
          is_potted: input.details.is_potted
        }
      },

      ad_images: {
        create: buildAdImagesPayload(input.images)
      }
    },
    include: {
      flower_details: true,
      ad_images: true
    }
  });

  return newAd;
};

const updateAd = async (adId: number, input: AdUpdateInput) => {
  const existingAd = await prisma.ads.findUnique({
    where: { id: adId }
  });

  if (!existingAd) {
    throw new Error(`Ad with ID ${adId} not found.`);
  }

  const updatedAd = await prisma.ads.update({
    where: { id: adId },
    data: {
      title: input.title,
      ad_description: input.ad_description,
      price: input.price,
      
      ...(input.details && {
        flower_details: {
          update: {
            flower_name: input.details.flower_name,
            occasion: input.details.occasion,
            size_cm: input.details.size_cm,
            origin: input.details.origin,
            lifespan_days: input.details.lifespan_days,
            is_potted: input.details.is_potted,
          }
        }
      })
    },
    include: {
      flower_details: true,
      ad_images: {
        orderBy: { is_cover: 'desc' }
      }
    }
  });

  return updatedAd;
};

const deleteAd = async (adId: number) => {
  const existingAd = await prisma.ads.findUnique({
    where: { id: adId }
  });

  if (!existingAd) {
    throw new Error(`Ad with ID ${adId} not found.`);
  }

  const deletedAd = await prisma.ads.update({
    where: { id: adId },
    data: {
      ad_status: 'deleted'
    },
    include: {
      flower_details: true,
      ad_images: true
    }
  });

  return deletedAd;
};

export {
  getActiveAds,
  getAdById,
  createAd,
  updateAd,
  deleteAd
};