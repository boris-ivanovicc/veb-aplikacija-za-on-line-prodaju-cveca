const prisma = require('../db');

const fetchActiveAds = async (pageNumber: number, itemsPerPage: number) => {
  const skipAmount = (pageNumber - 1) * itemsPerPage;

  const [ads, totalCount] = await prisma.$transaction([
    prisma.ad.findMany({
      where: { status: 'active' },
      skip: skipAmount,
      take: itemsPerPage,
      include: {
        flower_details: true,
        images: {
          orderBy: { is_cover: 'desc' }
        },
        user: {
          select: {
            id: true,
            display_name: true,
            avatar_url: true
          }
        }
      },
      orderBy: { created_at: 'desc' }
    }),
    prisma.ad.count({
      where: { status: 'active' }
    })
  ]);

  return {
    ads,
    totalCount
  };
};

const getAdById = async(adId: string) => {
  const ad = await prisma.ad.findUnique({
    where: {
      id: adId
    },
    include: {
      flower_details: true,
      images:{
        orderBy: {is_cover: 'desc'}
      },
      user: {
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

interface CreateAdInput {
  title: string;
  description: string;
  price: number;
  user_id: string;
  details: {
    occasion: string;
    size_cm: number;
    origin: string;
    lifespan_days: number;
    is_potted: boolean;
  }
}

const createAd = async ({title, description, price, user_id, details}: CreateAdInput) => {
  const newAd = await prisma.$transaction(async (transaction: any) => {
    const ad = await transaction.ad.create({
      data: {title, description, price, user_id, status: 'active'}
    });

    await transaction.flower_details.create({
      data: {
        ad_id: ad.id,
        occasion: details.occasion,
        size_cm: details.size_cm,
        origin: details.origin,
        lifespan_days: details.lifespan_days,
        is_potted: details.is_potted
      }
    });

    return await transaction.ad.findUnique({
      where: {id: ad.id},
      include: {flower_details: true}
    });
  });

  return newAd;
}

module.exports = {
  fetchActiveAds,
  getAdById,
  createAd
};
