# 🚀 VietBlox — Modern Web Top Up Robux Instant & Dashboard Admin

<p align="center">
  <img src="public/logo_background.PNG" alt="VietBlox Logo" width="120" style="border-radius: 50%; box-shadow: 0 8px 24px rgba(255,46,116,0.25);" />
</p>

<p align="center">
  <strong>Platform Top Up Robux Instant, Legal, Aman & Bergaransi 100%</strong><br>
  Dilengkapi Storefront Modern, Sistem Tracking Pesanan Realtime, dan Dashboard Admin Lengkap.
</p>

<p align="center">
  <img src="https://img.shields.io/badge/Next.js-16.3.5-black?style=for-the-badge&logo=next.js" alt="Next.js" />
  <img src="https://img.shields.io/badge/React-19-blue?style=for-the-badge&logo=react" alt="React" />
  <img src="https://img.shields.io/badge/TypeScript-5.0-3178C6?style=for-the-badge&logo=typescript" alt="TypeScript" />
  <img src="https://img.shields.io/badge/Tailwind_CSS-v4-38B2AC?style=for-the-badge&logo=tailwind-css" alt="Tailwind CSS" />
  <img src="https://img.shields.io/badge/Neon_PostgreSQL-Serverless-00E599?style=for-the-badge&logo=postgresql" alt="Neon Postgres" />
  <img src="https://img.shields.io/badge/Cloudflare-Edge_Ready-F38020?style=for-the-badge&logo=cloudflare" alt="Cloudflare" />
</p>

---

## 🌟 Fitur Utama

### 🛒 1. Storefront Pelanggan
- **Roblox Username Checker:** Validasi username instan ke Roblox API disertai foto avatar headshot resolusi tinggi.
- **Daftar Paket Robux Dinamis:** Pilihan nominal Robux interaktif dengan penanda status *Promo*, *Sold Out*, dan ketersediaan stok realtime.
- **Promo Banner & Countdown:** Banner hero estetik dengan countdown batas waktu promo otomatis.
- **Checkout & Pembayaran QRIS:** Form order terpadu dengan upload bukti transfer yang otomatis dikompresi ke WebP (< 35 KB).
- **Direct WhatsApp Gateway:** Opsi checkout langsung terhubung ke nomor WhatsApp admin CS dengan template pesan otomatis.

### 🔍 2. Live Order Tracking
- **Pencarian Cepat:** Cek status pesanan hanya dengan memasukkan Kode Pesanan (`VBX...`) atau Username Roblox.
- **Multi-Step Progress Bar:** Visualisasi tahapan pesanan (*Menunggu Pembayaran* ➔ *Sedang Diproses* ➔ *Pesanan Selesai*).
- **Instant Activation Link:** Tombol satu-klik untuk membuka Link Aktivasi Gamepass / ID 97K yang diatur oleh Admin.
- **Beri Ulasan Pasca Pesanan:** Pelanggan yang pesanannya telah selesai dapat langsung memberikan rating bintang dan testimoni.

### 👑 3. Dashboard Admin Terpadu (`/admin`)
- **Manajemen Transaksi:**
  - Filter pesanan berdasarkan status (*Semua*, *Menunggu Bayar*, *Diproses*, *Selesai*, *Dibatalkan*).
  - Update status pesanan, input catatan admin, dan set link aktivasi pesanan.
  - Quick-copy format konfirmasi WhatsApp pelanggan.
- **Pengaturan Toko & Banner Hero:**
  - Ganti Nama Toko, Nomor WhatsApp CS, dan Default Link Aktivasi Gamepass.
  - Konfigurasi paket promo aktif dan set tanggal berakhir promo via kalender interaktif.
  - Upload Barcode QRIS, Logo Toko, dan Foto Banner Promo dengan auto-compress WebP.
- **Pricelist & Paket Robux:**
  - Tambah, edit harga nominal, urutan display, status aktif/nonaktif, dan toggle *Sold Out*.
  - Sinkronisasi instan ke database Neon PostgreSQL.
- **Manajemen Testimoni:**
  - Moderasi testimoni masuk (*Approved*, *Pending*, *Rejected*).
  - Berikan balasan resmi admin pada review pelanggan.
  - Quick-select paket order yang telah tersedia di sistem.
- **Sistem Blacklist Akun:**
  - Blokir akun bermasalah agar tidak bisa melakukan checkout di website.

---

## ⚡ Arsitektur & Super Optimasi

Aplikasi ini dirancang khusus untuk berjalan di infrastruktur **Cloudflare Pages / Workers (Free Tier)** dan **Neon PostgreSQL (Free Tier 0.5 GB Storage & 5 GB Transfer/Bulan)** dengan efisiensi maksimal:

```
[ Pelanggan ] ───► [ Cloudflare Edge CDN (Cache 60s) ] ───► (99.8% Cache Hit / 0ms delay)
                               │ (Bypass / Admin / Mutation)
                               ▼
                   [ Next.js Serverless API ]
                               │
                               ▼
               [ Neon PostgreSQL Connection Pooler ]
```

1. **Cloudflare Edge CDN Caching:** Endpoint publik (`/api/settings`, `/api/products`, `/api/testimonials`, `/api/tracking`) dilengkapi header `Cache-Control: public, s-maxage=60, stale-while-revalidate=300`.
2. **Ultra-Compressed WebP Engine:** Seluruh upload gambar (Logo, QRIS, Banner, Bukti Transfer) dikompresi ke WebP berkuran ~15KB - 35KB di sisi client sebelum dikirim ke API, mencegah error *413 Payload Too Large* di Cloudflare.
3. **Stateless Connection Pooling:** Menggunakan driver `@neondatabase/serverless` over HTTP/WebSocket untuk mencegah kehabisan limit koneksi database.
4. **Instant In-App Synchronization:** Front-end menggunakan *LocalStorage-first hydration* dan event dispatcher kustom (`vietblox_settings_updated`) sehingga perubahan admin langsung aktif tanpa reload.

---

## 🛠️ Tech Stack

- **Framework:** [Next.js 16](https://nextjs.org/) (App Router, Turbopack)
- **Language:** [TypeScript](https://www.typescriptlang.org/)
- **Styling:** [Tailwind CSS v4](https://tailwindcss.com/)
- **Icons:** [Lucide React](https://lucide.dev/)
- **Database:** [Neon Serverless PostgreSQL](https://neon.tech/)
- **Deployment:** [Cloudflare Pages](https://pages.cloudflare.com/) / [Vercel](https://vercel.com/)

---

## 📁 Struktur Direktori

```text
vietblox/
├── app/
│   ├── api/
│   │   ├── blacklist/        # API endpoint blacklist user
│   │   ├── check-roblox/     # API resolver user Roblox & avatar
│   │   ├── orders/           # API transaksi pesanan & checkout
│   │   ├── products/         # API katalog paket Robux (Edge Cached)
│   │   ├── settings/         # API konfigurasi toko & banner (Edge Cached)
│   │   ├── testimonials/     # API ulasan & rating pelanggan (Edge Cached)
│   │   └── tracking/         # API live tracking order (Edge Cached)
│   ├── admin/                # Halaman Dashboard Admin
│   ├── tracking/             # Halaman Live Order Tracking Pelanggan
│   ├── layout.tsx            # Root Layout & Metadata
│   ├── page.tsx              # Halaman Utama Storefront
│   └── globals.css           # Styling Global
├── components/
│   ├── admin/                # Komponen Dashboard Admin (Settings, Orders, Pricelist, dll)
│   ├── HeroBanner.tsx        # Banner Hero Promo & Countdown
│   ├── Navbar.tsx            # Navbar Toko & Dynamic Logo
│   ├── PackageGrid.tsx       # Grid Pilihan Paket Robux
│   ├── PaymentModal.tsx      # Modal Checkout & QRIS Pembayaran
│   └── TestimonialsSection.tsx # Section Ulasan Pelanggan
├── hooks/
│   └── useStoreSettings.ts   # Custom hook sync pengaturan toko realtime
├── lib/
│   ├── adminStore.ts         # State management paket & transaksi
│   ├── db.ts                 # Database helper Neon serverless
│   └── imageCompressor.ts    # WebP client compression utility
└── public/                   # Asset statis (Logo, Banner, QRIS fallback)
```

---

## 🚀 Memulai (Local Development)

### 1. Prasyarat
- [Node.js](https://nodejs.org/) versi 18.17+ atau 20+
- Akun [Neon.tech](https://neon.tech/) untuk database PostgreSQL

### 2. Clone & Install Dependencies
```bash
git clone https://github.com/username/vietblox.git
cd vietblox
npm install
```

### 3. Konfigurasi Environment Variable
Buat file `.env.local` di root direktori project:
```env
# Neon Serverless Postgres Connection String (Gunakan link -pooler)
DATABASE_URL="postgres://user:password@ep-sample-pooler.ap-southeast-1.aws.neon.tech/neondb?sslmode=require"
```

### 4. Jalankan Development Server
```bash
npm run dev
```
Buka [http://localhost:3000](http://localhost:3000) pada browser Anda.

### 5. Build Production
```bash
npm run build
npm run start
```

---

## ☁️ Panduan Deployment (Cloudflare Pages)

1. Hubungkan repository GitHub ke **Cloudflare Pages**.
2. Masukkan pengaturan Build:
   - **Framework Preset:** `Next.js`
   - **Build Command:** `npx @cloudflare/next-on-pages@1` atau `npm run build`
   - **Output Directory:** `.vercel/output/static` (atau sesuai konfigurasi adapter)
3. Tambahkan Environment Variable di **Settings > Environment Variables**:
   - `DATABASE_URL` = `postgres://...-pooler.region.neon.tech/neondb?sslmode=require`
   - `NODE_VERSION` = `20`
4. Klik **Save and Deploy**.

---

## 📄 Lisensi & Hak Cipta

Dikelola secara eksklusif untuk **VietBlox Store**. Seluruh hak cipta dilindungi undang-undang.
