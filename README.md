# 📋 List My Job

Aplikasi desktop untuk mengelola dan mengingatkan tentang job yang akan dikerjakan. Dibangun dengan Electron, React, dan TypeScript.

## 📥 Download Installer

**Download installer terbaru di [GitHub Releases](https://github.com/musahabibulloh17/ListMyJob/releases)**

## Fitur

- **Tambah & Edit Job** - Kelola daftar pekerjaan Anda dengan mudah
- **Reminder/Notifikasi** - Dapatkan notifikasi desktop saat waktu reminder tiba
- **Deadline Tracking** - Pantau deadline pekerjaan Anda
- **Prioritas** - Tandai job dengan prioritas (Tinggi, Sedang, Rendah)
- **Status Tracking** - Lacak status job (Pending, In Progress, Completed)
- **Filter** - Filter job berdasarkan status
- **Penyimpanan Lokal** - Data tersimpan secara lokal di komputer Anda

## Cara Install & Menjalankan

### Prerequisites

- Node.js (versi 18 atau lebih baru)
- npm atau yarn

### Install Dependencies

```bash
npm install
```

### Development Mode

Jalankan aplikasi dalam mode development:

```bash
npm run dev
```

Ini akan menjalankan:
- Vite dev server untuk React (http://localhost:5173)
- Electron window yang terhubung ke dev server

### Build untuk Production

Build aplikasi untuk production dan buat installer:

**Windows:**
```bash
npm run build:win
```

**Mac:**
```bash
npm run build:mac
```

**Linux:**
```bash
npm run build:linux
```

**Semua Platform:**
```bash
npm run build
```

Ini akan:
- Compile TypeScript
- Build React app
- Package aplikasi menjadi installer (.exe untuk Windows, .dmg untuk Mac, .AppImage untuk Linux)

File installer akan berada di folder `release/`

### Upload Installer ke GitHub Releases

Untuk membuat file installer muncul di GitHub (di bagian Releases):

**Cara 1: Manual Upload (Paling Mudah)**
1. Build aplikasi: `npm run build:win`
2. Buka GitHub repository Anda di browser
3. Klik tombol **"Releases"** di sidebar kanan (atau kunjungi: `https://github.com/musahabibulloh17/ListMyJob/releases`)
4. Klik **"Create a new release"**
5. Isi:
   - **Tag version**: `v1.0.0` (sesuaikan dengan versi di package.json)
   - **Release title**: `v1.0.0` atau `Release v1.0.0`
   - **Description**: Tulis changelog atau deskripsi release
6. Di bagian **"Attach binaries"**, drag & drop file installer dari folder `release/`:
   - `List My Job-1.0.0-Setup.exe`
7. Klik **"Publish release"**

Setelah itu, file installer akan muncul di halaman Releases dan bisa diunduh oleh siapa saja!

**Cara 2: Otomatis dengan GitHub Token (Advanced)**
Jika ingin otomatis upload saat build, set environment variable:
```bash
# Windows PowerShell
$env:GH_TOKEN="your_github_token_here"
npm run build:win -- --publish always
```

**Distribusi**: File installer bisa langsung dibagikan ke teman tanpa perlu hosting! Lihat [BUILD.md](./BUILD.md) untuk detail lengkap.

## Struktur Proyek

```
list-my-job/
├── assets/           # Icon files (SVG source dan generated icons)
├── electron/         # Electron main process
│   ├── main.ts      # Main process entry point
│   └── preload.ts   # Preload script untuk IPC
├── scripts/         # Build scripts
│   └── generate-icons.js  # Script untuk generate icon dari SVG
├── src/             # React application
│   ├── components/  # React components
│   │   ├── Icons.tsx      # SVG icon components
│   │   ├── JobForm.tsx    # Form untuk tambah/edit job
│   │   ├── JobItem.tsx    # Item job individual
│   │   └── JobList.tsx    # List semua job
│   ├── types.ts     # TypeScript types
│   ├── App.tsx      # Main App component
│   ├── main.tsx     # React entry point
│   └── index.css    # Global styles
├── electron-builder.yml  # Electron builder configuration
├── package.json
└── README.md
```

## Cara Menggunakan

1. **Tambah Job Baru**
   - Isi form "Tambah Job Baru"
   - Masukkan judul (wajib), deskripsi, deadline, dan waktu reminder
   - Pilih prioritas dan status
   - Klik "Simpan Job"

2. **Edit Job**
   - Klik tombol "Edit" pada job yang ingin diubah
   - Ubah informasi yang diperlukan
   - Klik "Update Job"

3. **Ubah Status**
   - Gunakan dropdown status pada setiap job item
   - Pilih status: Pending, In Progress, atau Completed

4. **Hapus Job**
   - Klik tombol "Hapus" pada job yang ingin dihapus
   - Konfirmasi penghapusan

5. **Filter Job**
   - Gunakan tab filter di atas daftar job
   - Filter berdasarkan: Semua, Pending, In Progress, atau Completed

6. **Reminder**
   - Set waktu reminder saat menambah/edit job
   - Notifikasi desktop akan muncul otomatis saat waktu reminder tiba

## Teknologi yang Digunakan

- **Electron** - Framework untuk aplikasi desktop
- **React** - Library untuk UI
- **TypeScript** - Type-safe JavaScript
- **Vite** - Build tool dan dev server
- **date-fns** - Library untuk manipulasi tanggal

## Catatan

- Data job disimpan di `%APPDATA%/list-my-job/jobs.json` (Windows)
- Notifikasi hanya muncul jika aplikasi sedang berjalan
- Reminder akan dicek setiap 1 menit

## License

MIT

