Rancangan *refactoring* desain dan *master prompt* untuk **MBell MakeUp | Professional Makeup Artist** ini disusun dengan menggabungkan metodologi **Frontend Design** (pendekatan *bespoke*, bebas dari kesan *template* AI generik) dan struktur **Senior Prompt Engineering** (spesifikasi sistem yang presisi untuk dieksekusi oleh AI *coding assistant* seperti Cursor, Windsurf, atau v0).

Berdasarkan struktur repositori yang dilampirkan, proyek ini berjalan di atas **React, TypeScript, Tailwind CSS, dan Supabase**, serta memiliki komponen inti seperti `Navbar`, `Hero`, `About`, `Portfolio` (dengan `FullGalleryOverlay`), `PriceList`, `Testimonials` (dengan `FullTestimonialOverlay` & `TestimonialForm`), `BookingCalendar`, `MusicPlayer`, `FlowerBackground`, dan `Contact`.

---

## Tahap 1: Rencana Desain & Kritik Mandiri (*Design Plan & Self-Critique*)

Sebelum membuat *prompt* dan kode, berikut adalah fondasi sistem desain untuk memastikan tampilannya berkelas, *friendly*, dan tetap mempertahankan nuansa warna asli:

### 1. Sistem Token Desain (*Design Tokens*)

* **Palet Warna (Mempertahankan Nuansa Asli yang Lembut & Mewah):**
* `#FCF9F6` (**Alabaster Silk**): Warna latar utama yang hangat dan bersih di mata.
* `#F4EBE6` (**Soft Blush / Champagne Mist**): Warna latar sekunder untuk memisahkan seksi dan permukaan kartu tanpa garis batas yang kaku.
* `#C88A82` (**Dusty Rose**): Aksen utama untuk elemen interaktif, status aktif pada kalender, dan penanda lembut.
* `#9E5A54` (**Deep Rosewood**): Warna tombol aksi utama (*Primary CTA*) yang kontras dan ramah aksesibilitas.
* `#2A2121` (**Espresso Ink**): Warna teks utama (menggantikan hitam pekat `#000000` agar nuansa tetap lembut dan *editorial*).
* `#786866` (**Muted Taupe**): Warna teks sekunder dan keterangan.


* **Tipografi (2 Keluarga Font yang Kontras & Jelas):**
* **Display / Tajuk:** *Cormorant Garamond* (Serif). Memberikan kesan anggun, profesional, dan *bridal/editorial* tanpa terlihat kaku.
* **Body / UI / Angka:** *Plus Jakarta Sans* (Sans-serif). Sangat ramah dibaca (*friendly*) di layar *mobile* maupun desktop, dengan angka proporsional (`tabular-nums`) untuk daftar harga dan kalender.


* **Konsep Tata Letak & Wireframe ASCII:**
* Menggunakan tata letak asimetris bergaya *editorial lookbook* di desktop yang bertransformasi menjadi alur vertikal yang nyaman dijangkau ibu jari (*thumb-friendly*) pada *mobile*. Perataan teks menggunakan rata kiri (*left-aligned*) untuk keterbacaan maksimal (panjang baris di bawah 75 karakter).



```text
[DESKTOP VIEW - ASYMMETRIC LOOKBOOK]                 [MOBILE VIEW - THUMB-FRIENDLY]
+--------------------------------------------------+  +--------------------------+
| Logo          Tentang  Karya  Harga  [Cek Jadwal]|  | Logo             [Jadwal]|
+--------------------------------------------------+  +--------------------------+
|                       | +----------------------+ |  | +----------------------+ |
| Sentuhan Riasan       | |                      | |  | |     Foto Portrait    | |
| Personal untuk        | |    Foto Portrait     | |  | |      Bella / Akad    | |
| Momen Spesialmu.      | |     Bella / Akad     | |  | +----------------------+ |
|                       | |   (Lengkungan Halus) | |  | Sentuhan Riasan Personal |
| [Lihat Jadwal & Harga]| |                      | |  | [Lihat Jadwal & Harga]   |
+-----------------------+ +----------------------+ |  +--------------------------+
| KARYA PILIHAN (Filter: Semua | Akad | Wisuda)    |  | [Semua] [Akad] [Wisuda]  |
| +-------------+ +-------------+ +--------------+ |  | +----------------------+ |
| | Foto 1      | | Foto 2      | | Foto 3       | |  | | Slide Foto 1   1/6 > | |
| +-------------+ +-------------+ +--------------+ |  | +----------------------+ |
+--------------------------------------------------+  +--------------------------+
|                                             (♫)  |  | [♫] [Chat WhatsApp Book] |
+--------------------------------------------------+  +--------------------------+

```

### 2. Evaluasi & Kritik Mandiri (*Self-Critique*)

* **Apa yang dihindari & diubah dari gaya generik:** Desain *default* sering kali menggunakan *card* seragam dengan bayangan abu-abu (`shadow-md`), label huruf kapital semua (*ALL-CAPS*) di atas setiap judul, atau menyorot satu kata dengan warna berbeda di tengah kalimat judul.
* **Keputusan Spesifik untuk MBell MakeUp:**
1. **Fokus Keberanian Visual (*Spend Boldness in One Place*):** Keberanian visual dipusatkan pada **kualitas fotografi hasil riasan** (`bella_1.png`, `akad-makeup.jpeg`, dll.) dengan bingkai lengkung organik di bagian *Hero*, sementara elemen UI di sekitarnya dibuat tenang, bersih, dan menggunakan garis batas *hairline* tipis (`#E6D7D2`).


2. **Transformasi Daftar Harga (`PriceList`):** Karena paket harga saat ini berbasis aset gambar (`price_01.webp`, `price_02.webp`, `price_03.png`), di layar HP teks di dalam gambar sering kali terlalu kecil. Solusinya adalah merombaknya menjadi *Interactive Lookbook Viewer* dengan tab pemilih paket yang jelas, fitur *pinch-to-zoom* / *lightbox*, serta tombol **Tanya Paket Ini via WhatsApp** yang langsung mengisi pesan otomatis sesuai paket yang sedang dilihat.


3. **Pengendalian Dekorasi (`FlowerBackground` & `MusicPlayer`):** Animasi bunga latar belakang dikurangi opasitasnya menjadi sangat samar (maksimal 8%) agar tidak mengganggu fokus mata saat melihat detail riasan wajah. Tombol musik (`sound_01.mp3`) dipadukan secara rapi di sudut layar tanpa menutupi tombol aksi utama di *mobile*.





---

## Tahap 2: Master Prompt untuk Refactoring Website

Salin dan gunakan *prompt* terstruktur di bawah ini ke dalam AI *coding assistant* Anda (seperti Cursor Composer, Windsurf, atau Claude) di dalam *workspace* proyek `mbellmakeup` Anda:

```markdown
# Role & Objective
Bertindaklah sebagai Lead Frontend Engineer dan Senior UI/UX Designer. Tugas Anda adalah melakukan refactoring menyeluruh pada antarmuka website "MBell MakeUp | Professional Makeup Artist" (React, TypeScript, Tailwind CSS, Supabase) agar tampil sangat ramah pengguna (friendly), berkelas (editorial beauty aesthetic), dan 100% responsif di perangkat Web maupun Mobile, sambil tetap mempertahankan nuansa warna asli brand (Soft Blush, Dusty Rose, Champagne, dan Warm Alabaster).

# Context & Existing Architecture
Proyek ini memiliki komponen berikut di dalam `src/components/`:
- `Navbar.tsx` & `Footer.tsx`
- `Hero.tsx` & `About.tsx` (menggunakan aset seperti `bella_1.png`, `bella_2.webp`, `akad-makeup.jpeg`)
- `Portfolio.tsx` & `FullGalleryOverlay.tsx`
- `PriceList.tsx` (menampilkan `price_01.webp`, `price_02.webp`, `price_03.png`, dan `term-condition.jpeg`)
- `Testimonials.tsx`, `TestimonialCard.tsx`, `FullTestimonialOverlay.tsx`, `TestimonialForm.tsx` (terhubung ke Supabase)
- `Contact.tsx` & `ui/BookingCalendar.tsx`
- `ui/FlowerBackground.tsx`, `ui/MusicPlayer.tsx` (`public/music/sound_01.mp3`), `ui/Modal.tsx`, `ui/Button.tsx`
- `SiteGuard.tsx` (JANGAN ubah logika keamanan/proteksi pada komponen ini maupun konfigurasi `src/lib/supabase.ts`).

# Design System & Aesthetic Guardrails
1. **Color Palette (Pertahankan Nuansa Asli di `tailwind.config.js`):**
   - `canvas`: `#FCF9F6` (Latar belakang utama yang hangat)
   - `surface`: `#F4EBE6` (Latar belakang kartu/seksi sekunder)
   - `primary`: `#9E5A54` (Deep Rosewood untuk CTA utama dan teks aksen penting)
   - `accent`: `#C88A82` (Dusty Rose untuk border aktif, badge halus, dan hover state)
   - `ink`: `#2A2121` (Espresso Ink untuk teks utama dan heading)
   - `muted`: `#786866` (Muted Taupe untuk paragraf pendukung)
   - `border-subtle`: `#E6D7D2` (Garis pembatas tipis 1px)

2. **Typography (`index.html` & `tailwind.config.js`):**
   - Gunakan `Cormorant Garamond` (weights: 500, 600, italic) untuk Heading (`font-serif`).
   - Gunakan `Plus Jakarta Sans` (weights: 400, 500, 600) untuk Body, Navigasi, dan Kalender (`font-sans`).
   - ATURAN KETAT TIPOGRAFI:
     - Jangan gunakan huruf kapital semua (ALL-CAPS) dengan letter-spacing lebar untuk label di atas judul. Gunakan sentence case yang ramah.
     - Jangan memberi warna berbeda atau cetak miring hanya pada satu kata di tengah kalimat judul.
     - Batasi lebar paragraf maksimal `65ch` agar nyaman dibaca.

3. **Anti-Bloat & Restraint Rules:**
   - Hindari penggunaan box-shadow abu-abu generik (`shadow-lg` / `shadow-xl`). Gunakan kontras warna antara `canvas` (`#FCF9F6`) dan `surface` (`#F4EBE6`) serta border tipis `1px solid #E6D7D2`.
   - Jangan gunakan penomoran dekoratif (`01 / 02 / 03`) kecuali pada langkah pemesanan yang memang berurutan.
   - Pastikan `FlowerBackground.tsx` bekerja secara halus di latar belakang dengan `opacity-10` dan `pointer-events-none` agar tidak membebani GPU mobile atau mengganggu fokus foto makeup.

# Component-by-Component Refactoring Instructions

## 1. `Navbar.tsx` & Mobile Navigation
- **Desktop:** Floating header dengan latar `bg-[#FCF9F6]/85 backdrop-blur-md`, border bawah tipis `#E6D7D2`, menampilkan `logoBrand.png` di kiri, tautan navigasi dengan *sentence case* di tengah, dan tombol CTA "Cek Jadwal" di kanan.
- **Mobile:** Header ringkas dan bersih. Buat menu navigasi mobile yang membuka panel halus (drawer) dengan target sentuh minimal `48px` per item, dilengkapi tombol aksi cepat di bagian bawah layar mobile untuk mempermudah pemesanan.

## 2. `Hero.tsx` & `About.tsx`
- **Desktop Layout:** Grid asimetris 12 kolom (7 kolom untuk tipografi & aksi di kiri, 5 kolom untuk potret utama `bella_1.png` / `akad-makeup.jpeg` di kanan).
- **Mobile Layout:** Susunan vertikal di mana visual potret tampil anggun di atas atau menyatu secara proporsional tanpa memotong wajah model, diikuti judul utama yang hangat dan tombol aksi penuh (`w-full sm:w-auto`).
- **Copywriting & CTA:** Gunakan kalimat aktif dan ramah, misalnya tombol utama `"Lihat Jadwal & Paket"` dan tombol sekunder `"Galeri Riasan"`.
- Pada `About.tsx`, tampilkan profil Bella (`bella_2.webp`) dengan gaya *editorial* yang menceritakan keahlian riasan (ketahanan makeup, kecocokan warna kulit, kenyamanan produk) secara ringkas dan hangat.

## 3. `Portfolio.tsx` & `FullGalleryOverlay.tsx`
- Buat filter kategori yang nyaman digeser secara horizontal (*horizontal scrollable pills*) di mobile tanpa scrollbar yang terlihat kasar.
- Setiap foto portofolio menggunakan rasio potret (`aspect-[4/5]`), `rounded-2xl`, dengan transisi *zoom* sangat halus hanya saat di-hover.
- Pada `FullGalleryOverlay.tsx`, pastikan modal ramah layar sentuh (mudah ditutup dengan tombol yang jelas di area jangkauan jari dan mendukung navigasi antar foto yang mulus).

## 4. `PriceList.tsx` (Peningkatan UX Krusial)
- Mengingat daftar harga menggunakan gambar (`price_01.webp`, `price_02.webp`, `price_03.png`) dan syarat ketentuan (`term-condition.jpeg`), ubah tampilannya menjadi **Interactive Package Switcher**:
  - Sediakan tab pemilih di bagian atas ("Paket 1", "Paket 2", "Paket 3", "Syarat & Ketentuan") sehingga di layar HP pengguna tidak perlu melakukan scroll panjang melewati banyak gambar besar sekaligus.
  - Tambahkan fitur *Tap to Zoom / Lightbox* agar pengguna di HP bisa memperbesar detail teks pada gambar daftar harga dengan jelas.
  - Di bawah kartu harga, tambahkan tombol langsung: `"Pesan Paket Ini via WhatsApp"` yang otomatis mengarahkan ke bagian jadwal/kontak.

## 5. `BookingCalendar.tsx` & `Contact.tsx`
- Buat antarmuka kalender di `BookingCalendar.tsx` memiliki sel tanggal minimal berukuran `44x44px` di mobile agar mudah disentuh.
- Berikan indikator warna yang jelas namun lembut untuk tanggal yang masih tersedia vs sudah terisi, selaras dengan palet `#C88A82` dan `#9E5A54`.
- Integrasikan pilihan tanggal dari kalender langsung ke formulir `Contact.tsx` / tombol WhatsApp sehingga ketika pengguna menekan tombol kirim, pesan WhatsApp sudah terisi otomatis dengan nama, tanggal pilihan, dan jenis layanan.

## 6. `Testimonials.tsx`, `TestimonialCard.tsx`, & `TestimonialForm.tsx`
- Tampilkan ulasan klien dari Supabase dalam *grid* yang bersih di desktop dan *horizontal snap carousel* (`snap-x snap-mandatory overflow-x-auto`) di mobile agar halaman tidak terlalu panjang ke bawah.
- Rapikan `TestimonialForm.tsx` dengan *input field* yang memiliki tinggi minimal `48px`, warna latar `#FCF9F6`, border `#E6D7D2`, dan *focus ring* berwarna `#C88A82`. Berikan pesan umpan balik (*loading*, berhasil, atau gagal) yang jelas dan sopan.

## 7. `MusicPlayer.tsx`
- Posisikan pemutar musik (`sound_01.mp3`) sebagai tombol kapsul kecil yang elegan di pojok kiri bawah (`bottom-5 left-5 z-40`), lengkap dengan indikator gelombang suara halus saat aktif, sehingga tidak bertabrakan dengan tombol WhatsApp di kanan bawah pada layar mobile.

# Deliverable Format
Berikan pembaruan kode secara lengkap dan modular untuk:
1. `tailwind.config.js` & `src/index.css`
2. Komponen-komponen di `src/components/` yang direfaktor.
Pastikan tidak ada error TypeScript (`fix-types.js` tetap bersih) dan seluruh fungsionalitas data Supabase berjalan sebagaimana mestinya.

```

---

## Tahap 3: Fondasi Kode Siap Pakai (Tailwind & Komponen Kunci)

Untuk mempercepat proses *refactoring* Anda, berikut adalah konfigurasi warna/tipografi beserta contoh implementasi ulang untuk **Tailwind Config**, **Hero**, dan **PriceList** yang sudah menerapkan prinsip di atas:

### 1. Pembaruan `tailwind.config.js`

Konfigurasi ini mengunci nuansa warna asli MBell MakeUp agar konsisten di seluruh komponen:

```javascript
/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      colors: {
        mbell: {
          canvas: '#FCF9F6',    // Latar utama hangat
          surface: '#F4EBE6',   // Latar sekunder / kartu
          blush: '#EBD8D0',     // Aksen lembut
          rose: '#C88A82',      // Dusty rose (aksen interaktif)
          primary: '#9E5A54',   // Deep rosewood (CTA utama)
          ink: '#2A2121',       // Teks utama (espresso)
          muted: '#786866',     // Teks sekunder
          border: '#E6D7D2',    // Garis pemisah halus
        },
      },
      fontFamily: {
        serif: ['"Cormorant Garamond"', 'Georgia', 'serif'],
        sans: ['"Plus Jakarta Sans"', 'system-ui', 'sans-serif'],
      },
    },
  },
  plugins: [],
};

```

### 2. Pembaruan `src/components/Hero.tsx` (Responsif & Editorial)

Menonjolkan potret riasan (`bella_1.png` dan `akad-makeup.jpeg`) dengan tata letak yang nyaman di layar HP maupun desktop:

```tsx
import React from 'react';
import bellaPortrait from '../assets/bella_1.png';
import akadImage from '../assets/akad-makeup.jpeg';

interface HeroProps {
  onExploreClick?: () => void;
  onBookingClick?: () => void;
}

export const Hero: React.FC<HeroProps> = ({ onExploreClick, onBookingClick }) => {
  return (
    <section className="relative bg-mbell-canvas text-mbell-ink pt-24 pb-16 md:py-32 overflow-hidden border-b border-mbell-border">
      <div className="max-w-6xl mx-auto px-5 sm:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-12 items-center">
          
          {/* Kolom Visual: Tampil di atas pada Mobile, di kanan pada Desktop */}
          <div className="lg:col-span-5 lg:order-2 relative mx-auto w-full max-w-sm lg:max-w-none">
            <div className="relative aspect-[4/5] rounded-t-full rounded-b-3xl overflow-hidden border border-mbell-border bg-mbell-surface">
              <img
                src={bellaPortrait}
                alt="Hasil riasan profesional oleh MBell MakeUp"
                className="w-full h-full object-cover object-top"
                loading="eager"
              />
            </div>

            {/* Thumbnail Pendukung (Akad) */}
            <div className="hidden sm:block absolute -bottom-5 -left-6 w-32 aspect-square rounded-2xl overflow-hidden border-4 border-mbell-canvas bg-mbell-surface">
              <img
                src={akadImage}
                alt="Riasan pengantin akad MBell MakeUp"
                className="w-full h-full object-cover"
              />
            </div>
          </div>

          {/* Kolom Teks & Aksi: Rata kiri, bersih, dan ramah dibaca */}
          <div className="lg:col-span-7 lg:order-1 text-left">
            <p className="text-sm font-medium text-mbell-primary mb-3">
              Professional Makeup Artist
            </p>
            
            <h1 className="font-serif text-4xl sm:text-5xl lg:text-6xl font-medium leading-[1.12] tracking-tight text-mbell-ink mb-6">
              Sentuhan riasan personal untuk momen paling berkesanmu.
            </h1>
            
            <p className="font-sans text-base sm:text-lg text-mbell-muted leading-relaxed max-w-[58ch] mb-8">
              Mulai dari prosesi akad, resepsi pernikahan, hingga wisuda dan acara spesial lainnya. Kami merancang tampilan yang menyatu alami dengan karakter wajahmu dan bertahan sepanjang hari.
            </p>

            {/* Tombol Aksi: Full-width di layar HP kecil, berdampingan di layar besar */}
            <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3.5">
              <a
                href="#booking"
                onClick={onBookingClick}
                className="inline-flex justify-center items-center min-h-[48px] px-7 py-3.5 rounded-full bg-mbell-primary text-mbell-canvas font-medium text-sm transition-colors hover:bg-mbell-ink focus:outline-none focus:ring-2 focus:ring-mbell-rose focus:ring-offset-2"
              >
                Cek Jadwal & Pesan
              </a>
              <a
                href="#pricelist"
                onClick={onExploreClick}
                className="inline-flex justify-center items-center min-h-[48px] px-7 py-3.5 rounded-full bg-mbell-surface text-mbell-ink border border-mbell-border font-medium text-sm transition-colors hover:bg-mbell-blush focus:outline-none focus:ring-2 focus:ring-mbell-rose focus:ring-offset-2"
              >
                Lihat Daftar Paket
              </a>
            </div>
          </div>

        </div>
      </div>
    </section>
  );
};

```

### 3. Pembaruan `src/components/PriceList.tsx` (Tab Interaktif & Zoom Ramah Mobile)

Mengatasi masalah keterbacaan gambar daftar harga (`price_01.webp`, `price_02.webp`, `price_03.png`, dan `term-condition.jpeg`) di layar ponsel:

```tsx
import React, { useState } from 'react';
import price01 from '../assets/price_01.webp';
import price02 from '../assets/price_02.webp';
import price03 from '../assets/price_03.png';
import termsImg from '../assets/term-condition.jpeg';

const PACKAGES = [
  { id: 'paket-1', label: 'Katalog Paket 1', image: price01, desc: 'Pilihan riasan akad, pengantin, dan pendamping.' },
  { id: 'paket-2', label: 'Katalog Paket 2', image: price02, desc: 'Paket riasan reguler, wisuda, lamaran, dan pesta.' },
  { id: 'paket-3', label: 'Katalog Paket 3', image: price03, desc: 'Layanan tambahan dan paket grup/keluarga.' },
  { id: 'ketentuan', label: 'Syarat & Ketentuan', image: termsImg, desc: 'Panduan pemesanan, DP, dan ketentuan layanan.' },
];

export const PriceList: React.FC = () => {
  const [activeTab, setActiveTab] = useState(PACKAGES[0]);
  const [isZoomed, setIsZoomed] = useState(false);

  return (
    <section id="pricelist" className="py-20 bg-mbell-surface/60 border-b border-mbell-border">
      <div className="max-w-5xl mx-auto px-5 sm:px-8">
        
        {/* Header Seksi */}
        <div className="max-w-2xl mb-10">
          <h2 className="font-serif text-3xl sm:text-4xl text-mbell-ink mb-3">
            Rincian Paket & Ketentuan
          </h2>
          <p className="text-mbell-muted text-sm sm:text-base">
            Pilih kategori di bawah ini untuk melihat rincian harga. Ketuk pada gambar katalog untuk memperbesar tampilan di layar ponselmu.
          </p>
        </div>

        {/* Navigasi Tab (Scrollable di Mobile) */}
        <div className="flex overflow-x-auto gap-2.5 pb-3 mb-8 no-scrollbar -mx-5 px-5 sm:mx-0 sm:px-0">
          {PACKAGES.map((item) => {
            const isActive = activeTab.id === item.id;
            return (
              <button
                key={item.id}
                onClick={() => setActiveTab(item)}
                className={`whitespace-nowrap min-h-[44px] px-5 py-2.5 rounded-full text-sm font-medium transition-colors border ${
                  isActive
                    ? 'bg-mbell-primary text-mbell-canvas border-mbell-primary'
                    : 'bg-mbell-canvas text-mbell-ink border-mbell-border hover:bg-mbell-blush/50'
                }`}
              >
                {item.label}
              </button>
            );
          })}
        </div>

        {/* Area Pratinjau Katalog */}
        <div className="bg-mbell-canvas border border-mbell-border rounded-3xl p-4 sm:p-8">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-5 mb-6 border-b border-mbell-border">
            <div>
              <h3 className="font-serif text-2xl text-mbell-ink">{activeTab.label}</h3>
              <p className="text-sm text-mbell-muted">{activeTab.desc}</p>
            </div>
            <button
              onClick={() => setIsZoomed(true)}
              className="self-start sm:self-auto inline-flex items-center gap-2 text-xs font-medium text-mbell-primary bg-mbell-surface px-4 py-2.5 rounded-full border border-mbell-border hover:bg-mbell-blush transition-colors"
            >
              Perbesar Gambar
            </button>
          </div>

          <div 
            onClick={() => setIsZoomed(true)}
            className="cursor-zoom-in overflow-hidden rounded-2xl bg-mbell-surface max-w-2xl mx-auto border border-mbell-border"
          >
            <img
              src={activeTab.image}
              alt={activeTab.label}
              className="w-full h-auto object-contain"
            />
          </div>
        </div>

        {/* Lightbox Modal untuk Mobile Zoom */}
        {isZoomed && (
          <div 
            className="fixed inset-0 z-50 bg-mbell-ink/90 backdrop-blur-sm flex items-center justify-center p-4 overflow-y-auto"
            onClick={() => setIsZoomed(false)}
          >
            <div className="relative max-w-3xl w-full my-auto" onClick={(e) => e.stopPropagation()}>
              <button
                onClick={() => setIsZoomed(false)}
                className="mb-3 ml-auto flex items-center justify-center px-4 py-2 rounded-full bg-mbell-canvas text-mbell-ink text-sm font-medium"
              >
                Tutup Pratinjau
              </button>
              <img
                src={activeTab.image}
                alt={activeTab.label}
                className="w-full h-auto max-h-[85vh] object-contain rounded-xl mx-auto"
              />
            </div>
          </div>
        )}

      </div>
    </section>
  );
};

```