
  import type { Category, NavLink } from './types';

  // Toggle Tampilan Foto Portfolio di UI Frontend (true = tampilkan, false = sembunyikan/disable)
  export const SHOW_PORTFOLIO_PHOTOS = false;

  // Kategori “logika” = sesuai JSON/folder
  export const CATEGORIES: Category[] = [
    'akad',
    'akadTanpaSiger',
    'BeautyShoot',
    'pesta',
    'wisuda',
    'preWedding',
    'siraman',
    'Lamaran',
    'Bridesmaid',
    'kelas_makeup',
    'MakeupTari',
  ];

  // Label kategori untuk tampil di UI (user-friendly)
  export const CATEGORY_LABELS: Record<Category, string> = {
    'akad': 'Akad',
    'akadTanpaSiger': 'Akad Tanpa Siger',
    'BeautyShoot': 'Beauty Shoot',
    'pesta': 'Pesta',
    'wisuda': 'Wisuda',
    'preWedding': 'Pre Wedding',
    'siraman': 'Siraman',
    'Lamaran': 'Lamaran',
    'Bridesmaid': 'Bridesmaid',
    'kelas_makeup': 'Kelas Makeup',
    'MakeupTari': 'Makeup Tari',
  };

  export const NAV_LINKS: NavLink[] = [
    { name: 'Home', href: '#home' },
    { name: 'About', href: '#about' },
    { name: 'Portfolio', href: '#portfolio' },
    { name: 'Price List', href: '#pricelist' },
    { name: 'Testimonials', href: '#testimonials' },
    { name: 'Contact', href: '#contact' },
  ];