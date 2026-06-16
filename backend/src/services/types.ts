export interface AdInput {
  title: string;
  ad_description?: string;
  price: number;
  user_id: number;
  details: {
    flower_name: string;
    occasion?: string;
    size_cm?: number;
    origin?: string;
    lifespan_days?: number;
    is_potted?: boolean;
  };
  images?: {
    original_url: string;
    thumbnail_url: string;
    file_type: 'image/jpeg' | 'image/png';
  }[];
}

export interface AdUpdateInput {
  title?: string;
  ad_description?: string;
  price?: number;
  ad_status?: 'active' | 'inactive' | 'sold';
  details?: {
    flower_name?: string;
    occasion?: string;
    size_cm?: number;
    origin?: string;
    lifespan_days?: number;
    is_potted?: boolean;
  };
  images?: {
    original_url: string;
    thumbnail_url: string;
    file_type: 'image/jpeg' | 'image/png';
  }[];
}

export interface AdImageInput {
  original_url: string;
  thumbnail_url?: string;
  file_type?: string;
}