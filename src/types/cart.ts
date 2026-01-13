// src/types/cart.ts
export interface CartItem {
  id: number;
  title: string;
  price: number;
  discountedPrice?: number; // Optional to match Product type
  quantity: number;
  size?: string;
  imgs: {
    thumbnails: string[];
    previews: string[];
  };
  isOfficial?: boolean;
  seller?: string;
  store?: string;
  category?: string;
  sizes?: string[];
  reviews?: number; // Added to match Product type
}