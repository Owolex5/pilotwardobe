// src/types/product.ts

export interface Product {
  id: number;
  title: string;

  /** Full product description (used on PDP, SEO, previews) */
  description?: string;

  /** Customer review count */
  reviews: number;

  /** Base price */
  price: number;

  /** Optional discounted price */
  discountedPrice?: number;

  /** Product images */
  imgs: {
    thumbnails: string[];
    previews: string[];
  };

  // ────────────────────────────────────────────────
  // PRODUCT METADATA
  // ────────────────────────────────────────────────

  /** Official / verified product */
  isOfficial?: boolean;

  /** Seller name (for marketplace mode later) */
  seller?: string;

  /** Store / brand name */
  store?: string;

  /** Product category (Headsets, Epaulettes, Watches, etc.) */
  category?: string;

  /** Search / filter tags */
  tags?: string[];

  // ────────────────────────────────────────────────
  // VARIANTS & OPTIONS
  // ────────────────────────────────────────────────

  /** Available sizes or variants */
  sizes?: string[];

  // ────────────────────────────────────────────────
  // FUTURE EXTENSIONS (READY BUT OPTIONAL)
  // ────────────────────────────────────────────────

  // colors?: string[];
  // stockPerSize?: Record<string, number>;
  // sizeChartUrl?: string;
  // rating?: number; // avg rating (e.g. 4.6)
}
