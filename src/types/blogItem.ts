// src/types/blogItem.ts

export interface BlogItem {
  date: string;
  views: number;
  title: string;
  slug: string;
  img: string;
  content: string;  // ← Remove the ? to make it required
}