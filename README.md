# Lumina web frontend

Frontend statis untuk GitHub Pages. Folder ini hanya berisi HTML, CSS, dan JavaScript publik; jangan menambahkan token, secret, data spreadsheet, atau data pasien.

## Status

- UI login Google dirancang memakai Google Identity Services.
- ID token dikirim hanya melalui header HTTPS `Authorization: Bearer ...` ke Cloud Run lalu langsung dibuang dari alur aplikasi.
- UI tidak menyimpan token ke local storage, session storage, cookie, URL, atau log.
- API memverifikasi identitas Gmail dan allowlist `User_Access`; belum ada modul pasien atau dashboard yang terhubung.
- `config.js` masih memiliki URL kosong. Login sengaja tetap tertutup sampai Cloud Run dan OAuth Client ID siap.
- Pemilik menyetujui repo publik terpisah bernama `vendrii/lumina-web`; repo belum dibuat dan tidak ada file UI yang dipublikasikan.

Setelah Cloud Run siap, isi `apiBaseUrl` di `config.js` dengan origin HTTPS API. Tambahkan `https://vendrii.github.io` sebagai origin yang diizinkan di Cloud Run dan pada OAuth Client ID. Uji di preview sebelum Pages diaktifkan.

Workflow Pages berada di `.github/workflows/pages.yml`. Sumber frontend akan disinkronkan dari repo pengembangan ke repo publik khusus `lumina-web`; repo tersebut hanya boleh menerima isi folder ini dan workflow Pages. Source Apps Script, Cloud Run, Script Properties, token, serta spreadsheet tidak boleh disalin ke sana.
