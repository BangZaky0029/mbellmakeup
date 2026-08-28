export interface PortfolioItem {
  id: string | number;
  title: string;
  category: string;
  imageUrl: string;
  description: string;
  details?: string;
}

export type Category = 
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
  | 'MakeupTari'

export interface NavLink {
  name: string;
  href: string;
}

export interface Testimonial {
  id: string;
  name: string;
  role?: string;
  content: string;
  image_url?: string;
  rating: number;
  created_at?: string;
  is_approved?: boolean;
}

export interface Booking {
  id: string;
  client_name: string;
  service: string;
  booking_date: string; // format: 'YYYY-MM-DD'
  address?: string;
  message?: string;
  status: 'confirmed' | 'cancelled';
  created_at: string;
}

export interface BookedDay {
  date: string;   // format: 'YYYY-MM-DD'
  service: string;
}