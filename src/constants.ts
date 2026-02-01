// C:\codingVibes\myPortfolio\mbell\mbell\src\constants.ts

import type { Category, NavLink } from './types';

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
