// src/types/testimonial.ts

export interface Testimonial {
  review: string;
  authorName: string;
  authorImg: string;
  authorRole: string;
  rating: number;  // ← ADD THIS LINE
}