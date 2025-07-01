# Petunjuk Penggunaan Collection Postman SPK-WP

## Cara Import Collection dan Environment

1. Buka Postman
2. Klik tombol "Import" yang berada di pojok kiri atas
3. Pilih tab "File" dan drag-and-drop atau browse file-file berikut:
   - `SPK-WP-Collection.json`
   - `SPK-WP-Environment.json`
4. Klik "Import" untuk menyelesaikan proses import

## Cara Menggunakan Environment

1. Setelah import, pilih environment "SPK-WP Environment" dari dropdown di pojok kanan atas Postman
2. Ganti nilai variabel environment sesuai dengan konfigurasi sistem Anda:
   - `base_url`: URL dasar API (default: http://localhost:5000)
   - `username`: Username untuk login
   - `password`: Password untuk login

## Alur Penggunaan API

1. **Autentikasi**:

   - Jalankan request "Login" untuk mendapatkan token JWT
   - Token akan otomatis tersimpan ke variabel `token` untuk digunakan pada request lainnya

2. **Mengelola Kriteria**:

   - Gunakan endpoints di folder "Criteria" untuk CRUD operasi kriteria
   - Setelah mendapatkan ID kriteria dari "Get All Criteria", Anda bisa mengupdate variabel `criterion_id` untuk request lain

3. **Mengelola Alternatif**:

   - Gunakan endpoints di folder "Alternatives" untuk CRUD operasi alternatif
   - Setelah mendapatkan ID alternatif dari "Get All Alternatives", Anda bisa mengupdate variabel `alternative_id` untuk request lain

4. **Perhitungan SPK-WP**:
   - Gunakan endpoint "Get Calculation Results" untuk mendapatkan hasil perhitungan dengan metode Weighted Product

## Tips Penggunaan

- Semua request (kecuali Login dan API Status) membutuhkan autentikasi Bearer Token
- Token akan otomatis digunakan jika Anda sudah menjalankan request Login terlebih dahulu
- Pastikan server backend berjalan sebelum menjalankan request-request ini
- Untuk testing lebih efisien, gunakan fitur "Run Collection" Postman untuk menjalankan serangkaian request secara berurutan
