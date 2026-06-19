export type ad_images_file_type =
  | 'jpg'
  | 'jpeg'
  | 'png'

export interface AdImageInput {
  original_url: string;
  thumbnail_url?: string;
  file_type?: ad_images_file_type;
}

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
  images?: AdImageInput[];
}

export interface AdUpdateInput {
  title?: string;
  ad_description?: string;
  price?: number;
  details?: {
    flower_name?: string;
    occasion?: string;
    size_cm?: number;
    origin?: string;
    lifespan_days?: number;
    is_potted?: boolean;
  };
}