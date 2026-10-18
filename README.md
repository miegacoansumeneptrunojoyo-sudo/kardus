# Sistem Rekap Uang Kardus — Biru & Pink (v1.2)

Aplikasi web untuk penggunaan pribadi pada **satu perangkat dan satu browser**, tanpa login dan tanpa database online.

## Desain v1.2
- Warna dominan biru dan pink.
- Tampilan responsif untuk laptop dan HP, dengan navigasi bawah pada layar kecil.

## Fitur
- Dashboard pemasukan, pengeluaran, saldo, dan grafik bulanan.
- Tambah, edit, hapus, pencarian, filter bulan/jenis, dan saldo berjalan.
- Rekap tahunan dan ekspor CSV untuk dibuka di Excel.
- **Cadangkan Data**: simpan seluruh transaksi sebagai file JSON.
- **Pulihkan**: pulihkan transaksi dari JSON; data saat ini akan diganti setelah konfirmasi.
- Penyimpanan lokal melalui `localStorage`.
- PWA/offline sederhana setelah dibuka pertama kali melalui HTTPS, di browser yang sama dan selama cache browser tersedia.

## Publikasi gratis melalui GitHub Pages
1. Buat repository GitHub baru, misalnya `rekap-uang-kardus`.
2. Ekstrak ZIP ini dan unggah **isi folder** `sistem-rekap-uang-kardus` ke root repository. Pastikan `index.html` berada langsung di root.
3. Buka **Settings → Pages**.
4. Pada **Build and deployment**, pilih **Deploy from a branch**.
5. Pilih branch `main` dan folder `/(root)`, lalu klik **Save**.
6. Tunggu hingga GitHub Pages memberikan alamat, biasanya `https://USERNAME.github.io/rekap-uang-kardus/`.

## Penyimpanan data — penting
- Website online tidak berarti data transaksi disimpan online. Data **hanya tersimpan di browser/perangkat ini**, tidak diunggah ke GitHub atau server.
- Gunakan browser dan perangkat yang sama. Jangan gunakan mode incognito/private.
- Jangan hapus data situs/browser sebelum membuat cadangan.
- Klik **Cadangkan Data** secara rutin dan simpan file `.json` di tempat aman. CSV untuk dibaca di Excel; JSON untuk pemulihan aplikasi.
- **Pulihkan** akan mengganti seluruh data transaksi saat ini dengan isi cadangan.
- Jika membuka situs di browser/perangkat lain, transaksi tidak otomatis muncul.

## Isi proyek
- `index.html` — struktur halaman.
- `assets/style.css` — desain responsif.
- `assets/app.js` — logika transaksi, laporan, ekspor dan pemulihan.
- `manifest.webmanifest` — metadata aplikasi.
- `service-worker.js` — cache/offline sederhana.
- `assets/icon.svg` — ikon aplikasi.
