export interface PortfolioItem {
  id: string;
  title: string;
  category: string;
  imageUrl: string;
  description: string;
  details?: string;
}

// Semua kategori sesuai button dan folder
export type Category = 
  | 'All'
  | 'Akad Tanpa Siger'
  | 'Akad'
  | 'Beauty Shoot'
  | 'Pesta'
  | 'Wisuda'
  | 'Pre Wedding'
  | 'Siraman'
  | 'Lamaran'
  | 'Bridesmaid'
  | 'Kelas Makeup'
  | 'Makeup Tari';

export interface NavLink {
  name: string;
  href: string;
}

export interface Testimonial {
  id: string;
  name: string;
  role: string;
  content: string;
  image?: string;
}
