# Lumina web frontend

Frontend statis untuk GitHub Pages. Folder ini hanya berisi HTML, CSS, dan JavaScript publik; jangan menambahkan token, secret, data spreadsheet, atau data pasien.

## Status

- UI login Google dirancang memakai Google Identity Services.
- ID token dikirim hanya melalui header HTTPS `Authorization: Bearer ...` ke Cloud Run lalu langsung dibuang dari alur aplikasi.
- UI tidak menyimpan token ke local storage, session storage, cookie, URL, atau log.
- API memverifikasi identitas Gmail dan allowlist `User_Access`; belum ada modul pasien atau dashboard yang terhubung.
- `config.js` masih memiliki URL kosong. Login sengaja tetap tertutup sampai Cloud Run dan OAuth Client ID siap.
- Repo publik terpisah [vendrii/lumina-web](https://github.com/vendrii/lumina-web) dan [GitHub Pages](https://vendrii.github.io/lumina-web/) sudah dibuat. Hanya file UI statis yang dipublikasikan.

Setelah Cloud Run siap, isi `apiBaseUrl` di `config.js` dengan origin HTTPS API. Tambahkan `https://vendrii.github.io` sebagai origin yang diizinkan di Cloud Run dan pada OAuth Client ID. Uji di preview sebelum Pages diaktifkan.

Workflow Pages berada di `.github/workflows/pages.yml`. Workflow sinkronisasi dari repo pengembangan ke repo publik berada di `.github/workflows/publish-lumina-web.yml`; workflow itu tetap nonaktif sampai secret/variable GitHub disiapkan. Repo publik hanya menerima isi folder ini dan workflow Pages. Source Apps Script, Cloud Run, Script Properties, token, serta spreadsheet tidak boleh disalin ke sana.
