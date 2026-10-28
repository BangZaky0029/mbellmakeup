# Rencana Arsitektur & Desain: Animasi Smooth Scroller & Efek Bunga Elegan (Ultra-Lightweight)

> **Proyek:** MBell MakeUp | Professional Bridal & Beauty Portfolio  
> **Target:** Peningkatan *User Experience (UX)* dengan sensasi *luxury editorial scrolling* dan aksen kelopak bunga yang anggun, puitis, namun **100% ringan (performa 60 FPS tanpa lag)**.

---

## 1. Filosofi Desain & Pendekatan Estetika

Website MBell MakeUp memiliki identitas visual **Warm Editorial Luxury** dengan palet khas:
- **Latar Canvas:** Alabaster Silk (`#FCF9F6`) & Soft Blush (`#F4EBE6`)
- **Aksen Utama:** Dusty Rose (`#C88A82`) & Deep Rosewood (`#9E5A54`)
- **Tipografi:** Cormorant Garamond (Serif) & Plus Jakarta Sans

Penambahan efek animasi scroll dan elemen bunga harus mematuhi prinsip utama:
1. **Tidak Norak / Tidak Mengganggu:** Bunga bukan animasi kartun yang bergerak agresif, melainkan siluet kelopak bunga melati (Jasmine) dan mawar (Rose) yang melayang turun sangat perlahan (*ethereal drift*), seperti hembusan angin sepoi-sepoi di pelaminan pernikahan.
2. **Kontras & Keterbacaan Tetap Terjaga:** Opacity kelopak dijaga sangat lembut (5% – 12%), berada di layer `pointer-events-none` di belakang konten utama, sehingga teks dan foto portofolio pengantin tetap menjadi pusat perhatian (*hero*).
3. **Bebas Beban (Zero-Weight Performance):** 
   - Tidak menggunakan gambar bitmap besar (PNG/JPG). Semua kelopak adalah **Vektor SVG murni**.
   - Animasi mengambang digerakkan oleh **CSS 3D Transforms** (`transform: translate3d(...) rotate(...)`), berjalan di GPU (Hardware Accelerated), membebaskan CPU dan thread utama JavaScript (0% JS loop overhead).

---

## 2. Bagian A: Sistem Animasi Scroller Smooth & Elegant

### 2.1. Smooth Momentum Glide (Inertia Scrolling)
- **Kondisi Saat Ini:** Scroll web masih mengandalkan scroll bawaan browser (`scroll-behavior: smooth`) yang terkadang terasa kaku atau putus-putus saat roda mouse diputar.
- **Solusi Rekomendasi:** 
  - Mengintegrasikan **Lenis Smooth Scroll** (`@studio-freight/lenis` atau *custom lightweight RAF lerp* < 2.5KB).
  - Memberikan sensasi meluncur sutra (*silk glide*) yang natural di desktop mouse wheel / trackpad.
  - Di perangkat mobile (layar sentuh), *native touch scrolling* tetap dipertahankan 100% tanpa distorsi agar tetap responsif bagi jempol pengguna.

### 2.2. Hairline Scroll Progress Bar (Penanda Bacaan Halus)
- Garis penanda posisi scroll setebal 2px di bawah navbar fixed.
- Menggunakan gradasi Rosewood ke Dusty Rose (`bg-gradient-to-r from-mbell-primary via-mbell-rose to-mbell-blush`).
- Terhubung dengan `scrollYProgress` Framer Motion yang dihitung secara proporsional.

### 2.3. Section Reveal Micro-Interactions (`<ScrollReveal />`)
- Komponen pembungkus ringan untuk seksi-seksi halaman (`About`, `Portfolio`, `PriceList`, `Invitations`, `Testimonials`, `Contact`).
- Setiap bagian akan muncul dengan transisi:
  - Opacity: `0 -> 1`
  - Translate Y: `18px -> 0px`
  - Durasi: `0.7s` dengan kurva bezier mewah `[0.16, 1, 0.3, 1]`
  - `viewport: { once: true, margin: "-8% 0px" }` (hanya terpicu sekali saat masuk pandangan layar, tidak berulang kali merender ulang).

### 2.4. Floating "Back to Top" Glassmorphism Control
- Tombol kapsul melayang minimalis di pojok kanan bawah.
- Hanya muncul (*fade-in*) saat pengunjung telah melewati seksi `Hero` (> 400px scroll).
- Didesain serasi dengan modul `MusicPlayer`: lingkaran glassmorphism, border hairline, dan hover effect lembut.

---

## 3. Bagian B: Efek Bunga Senada (Simple, Elegan & Ringan)

### 3.1. Konsep Flora: Melati Riasan & Kelopak Mawar Pengantin
Dua jenis bunga dipilih khusus karena selaras dengan dunia tata rias pengantin (*Bridal MUA*):
1. **Siluet Bunga Melati (Jasmine Star Flower):** Ciri khas ronce akad nikah nusantara yang melambangkan kesucian dan keanggunan.
2. **Kelopak Mawar Lembut (Falling Rose Petals):** Siluet kelopak organik melengkung yang memberikan kesan romantis dan mewah.

### 3.2. Struktur 2-Layer Komponen Bunga ([`FlowerBackground.tsx`](file:///c:/codingVibes/myPortfolio/mbell/mbell-1/src/components/ui/FlowerBackground.tsx))

```
+-------------------------------------------------------------+
| LAYER 1: Ambient Parallax Corner Flowers (Statis-Parallax)   |
| - 3 SVG Bunga berukuran sedang di sudut viewport            |
| - Opacity 6% - 9%                                           |
| - Bergeser perlahan mengikuti arah scroll (Depth of Field)  |
+-------------------------------------------------------------+
| LAYER 2: Ethereal Drifting Petals (Kelopak Melayang Halus)  |
| - 5 hingga 6 kelopak kecil yang melayang turun perlahan     |
| - Digerakkan 100% oleh CSS @keyframes (GPU transform)       |
| - Durasi siklus lambat (14 detik - 22 detik)                 |
| - Menghadirkan suasana hidup tanpa mengalihkan fokus        |
+-------------------------------------------------------------+
```

### 3.3. Arsitektur Performa (Kenapa Tetap Sangat Ringan?)
1. **Zero HTTP Request:** Semua path SVG di-embed langsung sebagai inline React component (ukuran kode < 1.8 KB). Tidak ada gambar yang perlu didownload lewat network.
2. **GPU Layer Isolation:**
   - Menggunakan properti `will-change: transform` dan `transform: translate3d(x, y, 0)`.
   - Mengabaikan event mouse dengan `pointer-events-none`.
3. **Battery & Device Friendly:**
   - Mematuhi `@media (prefers-reduced-motion: reduce)`: jika user menyalakan mode hemat baterai atau mengurangi animasi di OS mereka, animasi melayang otomatis dimatikan dan digantikan tampilan statis yang tenang.
   - Di layar mobile yang sempit, jumlah kelopak otomatis dikurangi (hanya 3 kelopak) agar menghemat daya ponsel.

---

## 4. Langkah Implementasi (Action Plan)

| Tahap | Komponen / File | Tindakan Teknis |
|---|---|---|
| **Langkah 1** | [`src/index.css`](file:///c:/codingVibes/myPortfolio/mbell/mbell-1/src/index.css) | Tambahkan keyframes CSS murni untuk `@keyframes petal-drift` dan `@keyframes petal-sway` yang dioptimasi GPU. |
| **Langkah 2** | [`src/components/ui/FlowerBackground.tsx`](file:///c:/codingVibes/myPortfolio/mbell/mbell-1/src/components/ui/FlowerBackground.tsx) | Desain ulang dengan siluet SVG Melati & Mawar, tambahkan 5 kelopak melayang dengan random delay & duration. |
| **Langkah 3** | [`src/components/ui/ScrollProgress.tsx`](file:///c:/codingVibes/myPortfolio/mbell/mbell-1/src/components/ui/ScrollProgress.tsx) | Buat komponen hairline progress bar di bawah fixed navbar. |
| **Langkah 4** | [`src/components/ui/ScrollToTop.tsx`](file:///c:/codingVibes/myPortfolio/mbell/mbell-1/src/components/ui/ScrollToTop.tsx) | Buat floating quick-scroll button dengan transisi fade-in. |
| **Langkah 5** | [`src/App.tsx`](file:///c:/codingVibes/myPortfolio/mbell/mbell-1/src/App.tsx) | Hubungkan `ScrollProgress` dan `ScrollToTop` ke dalam tata letak utama. |

---

## 5. Preview Estetika & Keamanan Kode
- Tidak ada dependency berat tambahan yang dapat menyebabkan `npm run build` gagal di Vercel.
- Semua animasi menggunakan TypeScript murni + Tailwind CSS + Framer Motion yang sudah terpasang.
