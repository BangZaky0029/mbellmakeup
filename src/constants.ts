import type { Category, NavLink, PortfolioItem, Testimonial } from './types';

export const CATEGORIES: Category[] = [
  'All',
  'Akad Tanpa Siger',
  'Akad',
  'Beauty Shoot',
  'Pesta',
  'Wisuda',
  'Pre Wedding',
  'Siraman',
  'Lamaran',
  'Bridesmaid',
  'Kelas Makeup',
  'Makeup Tari'
];

export const NAV_LINKS: NavLink[] = [
  { name: 'Home', href: '#home' },
  { name: 'About', href: '#about' },
  { name: 'Portfolio', href: '#portfolio' },
  { name: 'Testimonials', href: '#testimonials' },
  { name: 'Contact', href: '#contact' },
];

// Using placeholder images that fit the aesthetic
export const PORTFOLIO_ITEMS: PortfolioItem[] = [
  {
    id: '1',
    title: 'Radiant Glow',
    category: 'Akad',
    imageUrl: 'https://picsum.photos/id/1027/600/800',
    description: 'Flawless complexion for the big day.',
    details: 'This look focuses on a dewy, hydrated base using high-end skincare prep. The eyes are defined with soft brown hues and individual lashes for a natural flutter. Lips are kept neutral with a touch of gloss to enhance the youthful radiance.'
  },
  {
    id: '2',
    title: 'Modern Heritage',
    category: 'Akad Tanpa Siger',
    imageUrl: 'https://picsum.photos/id/338/600/800',
    description: 'Traditional elegance met with modern techniques.',
    details: 'Balancing tradition with contemporary aesthetics, this style features a matte, long-lasting base perfect for long ceremonies. The eyebrows are structured but natural, and the lip color is a custom mix of mauve and brick red to complement the traditional attire.'
  },
  {
    id: '3',
    title: 'Evening Glam',
    category: 'Pesta',
    imageUrl: 'https://picsum.photos/id/331/600/800',
    description: 'Bold eyes and soft lips for evening events.',
    details: 'Designed for low-light environments, this look utilizes light-reflecting pigments on the high points of the face. A smokey eye technique adds drama, paired with a nude lip to keep the focus on the eyes.'
  },
  {
    id: '4',
    title: 'Editorial Look',
    category: 'Beauty Shoot',
    imageUrl: 'https://picsum.photos/id/64/600/800',
    description: 'High contrast, glossy finish for magazine style.',
    details: 'An artistic approach suitable for high-definition photography. We play with textures here—mixing matte skin with glossy lids or lips. The contouring is slightly more pronounced to catch the studio lighting perfectly.'
  },
  {
    id: '5',
    title: 'Soft Romantic',
    category: 'Pre Wedding',
    imageUrl: 'https://picsum.photos/id/823/600/800',
    description: 'Dreamy and ethereal looks for outdoor shoots.',
    details: 'Perfect for natural light photography. We use airbrush techniques for a weightless feel that withstands outdoor elements. Soft pinks and peaches dominate the color palette to create a romantic, approachable vibe.'
  },
  {
    id: '6',
    title: 'Cultural Grace',
    category: 'Makeup Tari',
    imageUrl: 'https://picsum.photos/id/158/600/800',
    description: 'Stage-ready durability with traditional aesthetics.',
    details: 'Stage makeup requires sweat-proof formulas and bolder application. This look respects cultural guidelines regarding shapes and colors while ensuring the makeup reads well from a distance under stage lights.'
  },
  {
    id: '7',
    title: 'Graduation Day',
    category: 'Wisuda',
    imageUrl: 'https://picsum.photos/id/342/600/800',
    description: 'Fresh, long-lasting look for the celebration.',
    details: 'A celebration that lasts all day needs makeup that stays put. We use setting sprays and primers strategically. The look is fresh, youthful, and polished, ensuring you look your best in every graduation photo.'
  },
  {
    id: '8',
    title: 'Intimate Ceremony',
    category: 'Lamaran',
    imageUrl: 'https://picsum.photos/id/435/600/800',
    description: 'Soft pastel tones for intimate gatherings.',
    details: 'For closer interactions, the makeup texture is kept very skin-like. Soft pastel tones in blush and eyeshadow create a gentle, inviting appearance suitable for meeting family and close friends.'
  },
  {
    id: '9',
    title: 'Floral Bath',
    category: 'Siraman',
    imageUrl: 'https://picsum.photos/id/360/600/800',
    description: 'Water-resistant, natural dewy finish.',
    details: 'Since this ceremony involves water, we use exclusively waterproof products. The goal is "no-makeup" makeup—enhancing features subtly so you look naturally beautiful even when wet.'
  },
   {
    id: '10',
    title: 'Masterclass',
    category: 'Kelas Makeup',
    imageUrl: 'https://picsum.photos/id/453/600/800',
    description: 'Teaching the next generation of artists.',
    details: 'In our masterclasses, we break down complex techniques into learnable steps. This image showcases a demo look created during a session, highlighting clean application and color theory education.'
  },
];

export const TESTIMONIALS: Testimonial[] = [
  {
    id: '1',
    name: 'Sarah Amalia',
    role: 'Bride',
    content: 'Kak Bella bener-bener magician! Makeup akad aku tahan seharian padahal nangis haru. Super flawless dan ringan banget di muka.',
    image: 'https://randomuser.me/api/portraits/women/1.jpg'
  },
  {
    id: '2',
    name: 'Putri Indah',
    role: 'Graduation',
    content: 'Suka banget sama look wisuda aku. Natural tapi tetep kelihatan pangling. Temen-temen banyak yang nanyain makeup dimana!',
    image: 'https://randomuser.me/api/portraits/women/2.jpg'
  },
  {
    id: '3',
    name: 'Dinda Kirana',
    role: 'Pre-Wedding',
    content: 'The best MUA! Ramah banget dan detail banget ngerjainnya. Hasil fotonya jadi bagus banget karena makeupnya on point.',
    image: 'https://randomuser.me/api/portraits/women/3.jpg'
  },
  {
    id: '4',
    name: 'Rina Nose',
    role: 'Photoshoot',
    content: 'Professional banget. Datang on time, alat-alatnya bersih, dan hasilnya sesuai banget sama request aku. Highly recommended!',
    image: 'https://randomuser.me/api/portraits/women/4.jpg'
  },
  {
    id: '5',
    name: 'Tiara Andini',
    role: 'Engagement',
    content: 'Makeup lamaran yang super soft dan dreamy. Kak Bella ngerti banget tone warna yang cocok buat kulit aku. Makasih banyak kak!',
    image: 'https://randomuser.me/api/portraits/women/5.jpg'
  },
];