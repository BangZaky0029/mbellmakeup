// C:\codingVibes\myPortfolio\mbell\mbell\src\constants.ts

import type { Category, NavLink, Testimonial } from './types';

// Kategori “logika” = sesuai JSON/folder
export const CATEGORIES: Category[] = [
  'All',
  'akadTanpaSiger',
  'akad',
  'BeautyShoot',
  'pesta',
  'wisuda',
  'preWedding',
  'siraman',
  'Lamaran',
  'Bridesmaid',
  'kelas_makeup',
  'MakeupTari'
];

// Label kategori untuk tampil di UI (user-friendly)
export const CATEGORY_LABELS: Record<Category, string> = {
  All: 'All',
  akadTanpaSiger: 'Akad Tanpa Siger',
  akad: 'Akad',
  BeautyShoot: 'Beauty Shoot',
  pesta: 'Pesta',
  wisuda: 'Wisuda',
  preWedding: 'Pre Wedding',
  siraman: 'Siraman',
  Lamaran: 'Lamaran',
  Bridesmaid: 'Bridesmaid',
  kelas_makeup: 'Kelas Makeup',
  MakeupTari: 'Makeup Tari'
};

export const NAV_LINKS: NavLink[] = [
  { name: 'Home', href: '#home' },
  { name: 'About', href: '#about' },
  { name: 'Portfolio', href: '#portfolio' },
  { name: 'Testimonials', href: '#testimonials' },
  { name: 'Contact', href: '#contact' },
];
export const TESTIMONIALS: Testimonial[] = [
  {
    id: 1,
    name: 'Sarah Amalia',
    role: 'Bride',
    content: 'Kak Bella bener-bener magician! Makeup akad aku tahan seharian padahal nangis haru. Super flawless dan ringan banget di muka.',
    image: 'https://randomuser.me/api/portraits/women/1.jpg'
  },
  {
    id: 2,
    name: 'Putri Indah',
    role: 'Graduation',
    content: 'Suka banget sama look wisuda aku. Natural tapi tetep kelihatan pangling. Temen-temen banyak yang nanyain makeup dimana!',
    image: 'https://randomuser.me/api/portraits/women/2.jpg'
  },
  {
    id: 3,
    name: 'Dinda Kirana',
    role: 'Pre-Wedding',
    content: 'The best MUA! Ramah banget dan detail banget ngerjainnya. Hasil fotonya jadi bagus banget karena makeupnya on point.',
    image: 'https://randomuser.me/api/portraits/women/3.jpg'
  },
  {
    id: 4,
    name: 'Rina Nose',
    role: 'Photoshoot',
    content: 'Professional banget. Datang on time, alat-alatnya bersih, dan hasilnya sesuai banget sama request aku. Highly recommended!',
    image: 'https://randomuser.me/api/portraits/women/4.jpg'
  },
  {
    id: 5,
    name: 'Tiara Andini',
    role: 'Engagement',
    content: 'Makeup lamaran yang super soft dan dreamy. Kak Bella ngerti banget tone warna yang cocok buat kulit aku. Makasih banyak kak!',
    image: 'https://randomuser.me/api/portraits/women/5.jpg'
  },
];