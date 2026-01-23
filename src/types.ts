// C:\codingVibes\myPortfolio\mbell\mbell\src\types.ts

export interface PortfolioItem {
  id: number;
  title: string;
  category: string;
  imageUrl: string;
  description: string;
  details?: string;
}

// Semua kategori sesuai button dan folder
// src/types.ts
export type Category = 
  | 'All'
  | 'akadTanpaSiger'
  | 'akad'
  | 'BeautyShoot'
  | 'pesta'
  | 'wisuda'
  | 'preWedding'
  | 'siraman'
  | 'Lamaran'
  | 'Bridesmaid'
  | 'kelas_makeup'
  | 'MakeupTari';



export interface NavLink {
  name: string;
  href: string;
}

export interface Testimonial {
  id: number;
  name: string;
  role: string;
  content: string;
  image?: string;
}
