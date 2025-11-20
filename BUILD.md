# 🚀 Panduan Build Aplikasi List My Job

## Cara Membuat Installer untuk Windows

### Langkah 1: Build Aplikasi

Jalankan perintah berikut untuk membuat installer Windows (.exe):

```bash
npm run build:win
```

Proses ini akan:
1. Compile TypeScript untuk Electron
2. Build React app untuk production
3. Package aplikasi menjadi installer Windows

### Langkah 2: File Installer

Setelah build selesai, file installer akan berada di folder `release/`:
- **Installer**: `List My Job-1.0.0-Setup.exe` (untuk install ke sistem)
- **Portable**: `List My Job-1.0.0.exe` (tidak perlu install, langsung jalan)

### Langkah 3: Upload ke GitHub Releases (Recommended)

Cara terbaik untuk membagikan installer adalah melalui GitHub Releases:

1. **Buka halaman Releases di GitHub**:
   - Kunjungi: `https://github.com/musahabibulloh17/ListMyJob/releases`
   - Atau klik tombol **"Releases"** di sidebar kanan repository

2. **Buat Release Baru**:
   - Klik **"Create a new release"**
   - **Tag version**: `v1.0.0` (atau sesuai versi di package.json)
   - **Release title**: `v1.0.0` atau `Release v1.0.0`
   - **Description**: Tulis changelog, contoh:
     ```markdown
     ## What's New
     - Initial release
     - Fitur tambah, edit, dan hapus job
     - Reminder/notifikasi desktop
     - Filter berdasarkan status
     ```

3. **Upload File Installer**:
   - Di bagian **"Attach binaries by dropping them here or selecting them"**
   - Drag & drop file `List My Job-1.0.0-Setup.exe` dari folder `release/`
   - Tunggu sampai upload selesai

4. **Publish**:
   - Klik **"Publish release"**
   - File installer sekarang bisa diunduh oleh siapa saja!

**Keuntungan menggunakan GitHub Releases:**
- ✅ File besar (>100MB) bisa diupload tanpa masalah
- ✅ Versioning yang jelas
- ✅ Changelog untuk setiap versi
- ✅ Download counter
- ✅ Link permanen untuk sharing

### Langkah 4: Distribusi Alternatif

Jika tidak menggunakan GitHub Releases, Anda bisa:
1. **Bagikan file .exe** langsung ke teman melalui:
   - USB Flash Drive
   - Email (jika file tidak terlalu besar)
   - Google Drive / Dropbox / OneDrive
   - Media sosial / WhatsApp

2. **Install di laptop sendiri**:
   - Double-click `List My Job-1.0.0-Setup.exe`
   - Ikuti wizard installer
   - Aplikasi akan terinstall dan muncul di Start Menu

## Build untuk Platform Lain

### Mac OS
```bash
npm run build:mac
```
Hasil: `List My Job-1.0.0.dmg` di folder `release/`

### Linux
```bash
npm run build:linux
```
Hasil: `List My Job-1.0.0.AppImage` di folder `release/`

## Catatan Penting

1. **Tidak Perlu Hosting**: Aplikasi desktop ini tidak perlu hosting. File installer bisa dibagikan langsung.

2. **Ukuran File**: Installer biasanya berukuran 100-200 MB karena sudah include Node.js runtime.

3. **Antivirus**: Beberapa antivirus mungkin menandai file .exe sebagai suspicious karena aplikasi Electron. Ini normal, Anda bisa:
   - Tambahkan exception di antivirus
   - Atau gunakan versi portable

4. **Icon**: Jika ingin custom icon, letakkan file:
   - `assets/icon.ico` untuk Windows
   - `assets/icon.icns` untuk Mac
   - `assets/icon.png` untuk Linux

## Troubleshooting

### Error saat build
- Pastikan semua dependencies terinstall: `npm install`
- Pastikan tidak ada error di terminal
- Coba hapus folder `dist`, `dist-electron`, dan `release` lalu build lagi

### File installer tidak jalan
- Pastikan build berhasil tanpa error
- Cek folder `release/` apakah file sudah ada
- Untuk Windows, pastikan target build adalah `nsis` atau `portable`

## Tips

- **Versi Portable**: Lebih mudah dibagikan karena tidak perlu install
- **Code Signing** (Opsional): Untuk distribusi profesional, pertimbangkan code signing certificate
- **Auto-update**: Bisa ditambahkan fitur auto-update menggunakan electron-updater

