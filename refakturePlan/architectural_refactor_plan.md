# Analisis Arsitektur & Perencanaan Refactoring: MBell MakeUp

## 1. Analisis Kritis terhadap `refakturePlan/plan.md`

Berdasarkan tinjauan arsitektural mendalam terhadap dokumen `plan.md` dan kode sumber aktif di `c:\codingVibes\myPortfolio\mbell\mbell-1`, berikut adalah evaluasi komparatif dari sudut pandang **Lead Frontend Engineer & Full Stack Architect**:

### Kelebihan & Poin Kuat `plan.md`
1. **Penetapan Identitas Visual (Design Tokens):**
   - Transformasi dari warna standar/generik pink-abu menjadi palet editorial mewah (*Alabaster Silk* `#FCF9F6`, *Soft Blush* `#F4EBE6`, *Deep Rosewood* `#9E5A54`, *Dusty Rose* `#C88A82`, *Espresso Ink* `#2A2121`).
   - Pendekatan ini mempertahankan esensi feminin dan kehangatan brand asli MBell MakeUp tanpa terkesan seperti template template AI murah atau saturasi berlebihan.
2. **Koreksi Tipografi:**
   - Pasangan font *Cormorant Garamond* (Editorial Display/Heading) dan *Plus Jakarta Sans* (Modern Clean Body/Numbers) adalah standar emas untuk portofolio kecantikan dan bridal premium.
   - Aturan anti-bloat melarang all-caps tracking berlebihan dan larangan pewarnaan aneh di tengah kalimat judul.
3. **Peningkatan UX Krusial pada Price List:**
   - Menyelesaikan masalah fundamental: gambar katalog harga (`price_01.webp`, `price_02.webp`, `price_03.png`, `term-condition.jpeg`) yang teksnya kekecilan di layar ponsel diubah menjadi *Interactive Package Switcher* + *Lightbox Zoom* + *Direct WhatsApp Action*.
4. **Optimasi Kinerja (Performance & Accessibility):**
   - Pengurangan intensitas `FlowerBackground` (maksimal 8-10%) dan pemindahan `MusicPlayer` ke kiri bawah agar tidak menabrak FAB WhatsApp.

### Celah & Temuan Kritis di Lapangan (*Gap Analysis & Architectural Findings*)
1. **Navigasi Utama (`Navbar` & `Footer`) Hilang di `App.tsx`:**
   - Di codebase aktif saat ini, komponen `Navbar.tsx` dan `Footer.tsx` hanya di-import di dalam overlay (`FullGalleryOverlay` & `FullTestimonialOverlay`), namun **sama sekali belum dirender di tampilan utama `App.tsx`**. Pengunjung website tidak memiliki menu navigasi tetap saat menjelajah! Ini adalah prioritas arsitektur yang harus diperbaiki.
2. **Resiko Patah Styling (Backward Compatibility Tailwind):**
   - Jika `tailwind.config.js` hanya mendefinisikan warna `mbell.*`, maka komponen yang masih memanggil class `bg-primary`, `text-textMain`, `bg-surface`, dan `border-primary` akan kehilangan warna.
   - **Solusi Arsitektural:** Melakukan *color aliasing* di `tailwind.config.js` sehingga token baru `mbell` tersedia, dan token lama (`primary`, `surface`, `textMain`) otomatis diarahkan ke palet baru `#9E5A54`, `#FCF9F6`, dan `#2A2121`.
3. **Data Binding Aset PriceList yang Keliru:**
   - Di `PriceList.tsx` lama, aset yang dipakai adalah `price_01.webp`, `price_03.png`, dan `akad-makeup.jpeg`. Aset `price_02.webp` dan `term-condition.jpeg` tidak terpakai secara optimal. Switcher baru harus menampung seluruh paket secara proporsional.
4. **Sinkronisasi Flow Booking:**
   - Integrasi tombol aksi dari `Hero`, `PriceList`, dan `Portfolio` ke bagian `BookingCalendar` dan formulir `Contact.tsx`, dengan pesan WhatsApp yang otomatis terformat rapi sesuai paket atau tanggal yang dipilih klien.
5. **Integritas Site Guard & Supabase:**
   - Menjamin 100% proteksi `SiteGuard.tsx` dan konfigurasi `src/lib/supabase.ts` tidak tersentuh atau terganggu selama refactoring.

---

## 2. Planning & Roadmap Refactoring (Arsitektur Lengkap)

| Fase | File Sasaran | Tujuan & Spesifikasi Implementasi |
| :--- | :--- | :--- |
| **Fase 1: Design Tokens & Typography** | `index.html`<br>`tailwind.config.js`<br>`src/index.css` | 1. Import Google Fonts *Cormorant Garamond* & *Plus Jakarta Sans*.<br>2. Definisi token warna `mbell` & backward compatibility mapping.<br>3. Konfigurasi scrollbar halus, focus rings, dan animasi equalizer. |
| **Fase 2: Shell Aplikasi & Navigasi** | `src/App.tsx`<br>`src/components/Navbar.tsx`<br>`src/components/Footer.tsx` | 1. Pasang `Navbar` di atas dan `Footer` di bawah pada `App.tsx`.<br>2. Refactor Navbar menjadi floating blurred header dengan drawer mobile berukuran touch target >= 48px.<br>3. Refactor Footer dengan aksen warm taupe dan quick links. |
| **Fase 3: Visual Identity (Hero & About)** | `src/components/Hero.tsx`<br>`src/components/About.tsx` | 1. Tata letak asimetris editorial lookbook di desktop, vertikal proporsional di mobile.<br>2. Bingkai lengkung organik untuk `bella_1.png` + thumbnail `akad-makeup.jpeg`.<br>3. Copywriting hangat dan profil Bella Aprillian (`bella_2.webp`) dengan sorotan keahlian riasan. |
| **Fase 4: Core Experience (PriceList & Portfolio)** | `src/components/PriceList.tsx`<br>`src/components/Portfolio.tsx` | 1. Switcher paket interaktif (Paket 1, Paket 2, Paket 3, Syarat & Ketentuan) + Lightbox Zoom + WhatsApp Direct CTA.<br>2. Horizontal scrollable filter pills untuk portofolio + kartu editorial aspect-[4/5] + Coming soon state yang mewah. |
| **Fase 5: Social Proof & Interaksi** | `src/components/Testimonials.tsx`<br>`src/components/TestimonialCard.tsx`<br>`src/components/TestimonialForm.tsx` | 1. Grid rapi di desktop & snap carousel horizontal di mobile.<br>2. Form input min-height 48px, background kanvas hangat, star rating interaktif, pesan status yang ramah. |
| **Fase 6: Booking System & Background Ambient** | `src/components/ui/BookingCalendar.tsx`<br>`src/components/Contact.tsx`<br>`src/components/ui/MusicPlayer.tsx`<br>`src/components/ui/FlowerBackground.tsx` | 1. Touch target tanggal minimal 44x44px di mobile.<br>2. Indikator status tanggal tersedia vs terisi yang lembut dan jelas.<br>3. Tombol MusicPlayer kapsul di pojok kiri bawah tanpa menutupi tombol kontak.<br>4. Flower background diturunkan opasitasnya (8-10%) dengan zero GPU lag. |
| **Fase 7: Verifikasi & Audit Kualitas** | Seluruh file proyek | Audit kelengkapan tipe TypeScript, responsivitas mobile-first, dan integritas Supabase. |
