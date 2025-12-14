# Next.js SaaS Starter Kit (Nexus)

Boilerplate SaaS lengkap dan siap produksi yang dibangun dengan teknologi modern. Dibuat untuk mempercepat proses development aplikasi SaaS Anda dengan fitur-fitur utama seperti autentikasi, manajemen organisasi, sistem pembayaran, dan tampilan dashboard yang modern.

![Pratinjau Dashboard](/public/dashboard-preview.png)

## 🚀 Tech Stack

- **Framework:** [Next.js 15](https://nextjs.org/) (App Router)
- **Bahasa:** [TypeScript](https://www.typescriptlang.org/)
- **Styling:** [Tailwind CSS](https://tailwindcss.com/)
- **UI Components:** [shadcn/ui](https://ui.shadcn.com/)
- **Icons:** [HugeIcons](https://hugeicons.com/)
- **Autentikasi:** [Better Auth](https://www.better-auth.com/)
- **ORM:** [Prisma](https://www.prisma.io/)
- **Data Fetching:** [TanStack React Query](https://tanstack.com/query/latest)
- **Pembayaran:** [Midtrans](https://midtrans.com/) (Sudah terintegrasi)
- **Validasi:** [Zod](https://zod.dev/)
- **Forms:** [React Hook Form](https://react-hook-form.com/)

## ✨ Fitur Utama

- **🔐 Sistem Autentikasi**

  - Login via Email/Password & Google OAuth
  - Proteksi route dashboard menggunakan Middleware
  - Manajemen sesi pengguna via Better Auth

- **🏢 Manajemen Organisasi**

  - Membuat dan berpindah antar organisasi dengan mudah
  - Kelola anggota tim dan hak akses (role)
  - Sistem undangan member (siap dikembangkan lebih lanjut)

- **📊 Modern Dashboard**

  - Layout Sidebar yang responsif
  - Manajemen proyek dengan fitur CRUD lengkap (Create, Read, Update, Delete)
  - UI interaktif dengan loading state dan optimistic updates menggunakan React Query

- **💳 Billing & Subscription**

  - Integrasi pembayaran menggunakan Midtrans
  - Manajemen langganan (Pilihan Paket, Status Langganan)
  - Riwayat transaksi lengkap
  - Webhook handler untuk update status pembayaran otomatis

- **🛠️ Developer Experience**
  - Full Type-safe
  - Konfigurasi Biome yang rapi untuk linting kode
  - Arsitektur komponen yang modular dan mudah dikembangkan

## 📦 Panduan Awal

### Persyaratan Sistem

- Node.js (v18+)
- Bun (Rekomendasi) atau npm/yarn/pnpm
- Database PostgreSQL

### Instalasi

1. **Clone repository**

   ```bash
   git clone https://github.com/rizkraf/nextjs-saas-starter-kit.git
   cd nextjs-saas-starter-kit
   ```

2. **Install dependencies**

   ```bash
   bun install
   ```

3. **Konfigurasi Environment**
   Salin file contoh environment dan sesuaikan dengan key Anda:

   ```bash
   cp .env.example .env
   ```

   Isi variabel environment berikut:

   - `DATABASE_URL`
   - `BETTER_AUTH_SECRET` & `BETTER_AUTH_URL`
   - `GOOGLE_CLIENT_ID` & `GOOGLE_CLIENT_SECRET`
   - `MIDTRANS_SERVER_KEY`, `MIDTRANS_CLIENT_KEY`

4. **Setup Database**
   Push schema Prisma ke database Anda:

   ```bash
   bun run db:push
   ```

   (Opsional) Isi database dengan data awal (seeding):

   ```bash
   bun run db:seed
   ```

5. **Jalankan Project**
   Jalankan server development lokal:

   ```bash
   bun run dev
   ```

   Buka [http://localhost:3000](http://localhost:3000) untuk melihat hasilnya.

## 🗂️ Struktur Folder

```
src/
├── app/              # Halaman Next.js App Router & API Routes
│   ├── (auth)/       # Halaman Autentikasi (Sign in, Sign up)
│   ├── (dashboard)/  # Halaman Dashboard (Perlu login)
│   └── api/          # Backend API Endpoints
├── components/       # UI Components reusable
│   ├── ui/           # Komponen dasar shadcn/ui
│   ├── dashboard/    # Komponen khusus Dashboard
│   └── landing/      # Komponen Landing Page
├── lib/              # Utilities, auth client, query client
├── hooks/            # Custom React Hooks
└── wrapper/          # Providers (QueryProvider, dll.)
```

## 📜 Lisensi

Didistribusikan di bawah Lisensi MIT. Lihat file `LICENSE` untuk informasi lebih lanjut.

## 🤝 Kontribusi

Kontribusi sangat terbuka! Jangan ragu untuk membuat Pull Request.
