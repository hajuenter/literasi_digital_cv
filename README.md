# Bahrul Portfolio

Portfolio statis dengan tema **neobrutalism monokrom** (putih + hitam/abu). Styling memakai **Tailwind CSS v4 lewat CDN**, tanpa build CSS. Hasil akhir yang dipakai GitHub Pages tetap satu file `index.html` biasa.

## Struktur

```
index.html                  hasil build (jangan diedit manual)
src/
  index.template.html       kerangka HTML + penanda @include + lightbox
  partials/
    head.html               meta, font, Tailwind CDN, @theme, Font Awesome
    sidebar.html            sidebar + navigasi (vanilla toggle)
    header.html             hero + typed text
    large-btn.html          tombol Resume & Hire Me
    about.html              profil + tech stack
    education.html          Education
    experience.html         Experience + sertifikat
    service.html            Service
    portfolio.html          Portfolio + filter + data lightbox
    review.html             Review (scroll-snap slider)
    contact.html            Contact + form Google Sheet
    footer.html             Footer
scripts/build.js            penyusun partial -> index.html (Node.js, tanpa dependency)
js/main.js                  navbar, scrollspy, typed text, filter, lightbox, slider, back-to-top (vanilla JS)
js/theme.js                 toggle tema Terang/Gelap (default Terang = tampilan awal, tersimpan di localStorage)
js/i18n.js                  kamus EN/ID + toggle bahasa (default ID, tersimpan di localStorage)
js/contact-form.js          submit form ke Google Apps Script
css/style.css               component layer neobrutalism (kartu, tombol, chip, input, dialog)
```

## Styling

- Tailwind CDN: `<script src="https://cdn.jsdelivr.net/npm/@tailwindcss/browser@4"></script>`
- Token warna/font didefinisikan di `@theme` pada `src/partials/head.html`:
  `ink` (#0a0a0a), `paper` (#ffffff), `smoke`, `steel`, font `Space Grotesk` + `IBM Plex Mono`.
- Kelas komponen (`nb-card`, `nb-btn`, `nb-chip`, `nb-input`, dll.) ada di `css/style.css` dan dibungkus `@layer components` (urutan layer: `theme, base, components, utilities`). Ini penting supaya utility Tailwind seperti `hidden` / `lg:hidden` tetap menang atas aturan komponen—tanpa ini, hamburger tidak bisa hilang di desktop.

> Catatan: Tailwind menyebut CDN ini sebagai *Play CDN* dan ditujukan untuk development/prototyping. Ini sesuai permintaan: tidak ada instalasi atau langkah build CSS. Jika suatu hari mau produksi yang dioptimasi, bisa diganti dengan build Tailwind lokal tanpa mengubah markup.

## JavaScript

Semua library lama (jQuery, Bootstrap, slick, typed.js, isotope, lightbox, waypoints, easing) sudah dihapus. Folder `lib/` juga sudah dihapus. Perilakunya kini ada di `js/main.js` dengan vanilla JS:

- toggle navigasi mobile
- active state navbar saat scroll
- efek mengetik di hero
- filter portfolio
- lightbox gallery (± tombol prev/next, Esc, klik backdrop)
- slider review berbasis `scroll-snap`
- tombol back to top

## Bahasa

Di sidebar ada tombol **ID / EN**. Default-nya **Bahasa Indonesia**; pilihan tersimpan di `localStorage` sehingga tetap ingat saat halaman dibuka lagi. Semua teks yang bisa diterjemahkan diberi penanda `data-i18n="kunci"`, `data-i18n-placeholder`, `data-i18n-aria`, atau `data-i18n-typed`. Kamus dan logika togglenya ada di `js/i18n.js` (dimuat sebelum `js/main.js` supaya teks hero sudah terjemahan saat animasi mengetik dimulai).

## Tema

Di sidebar sebelah tombol bahasa ada dua ikon tema:

- **Matahari / Terang** (default) — bagian putih dan gelap berselang seperti tampilan awal
- **Bulan / Gelap** — semua bagian gelap

Pilihan disimpan di `localStorage` dan diterapkan lebih awal lewat skrip kecil di `src/partials/head.html` supaya tidak kedip saat halaman dimuat. Warna memakai variabel Tailwind (`--color-paper`, `--color-ink`, `--color-steel`) yang diubah lewat `html[data-theme="..."]`, jadi utility seperti `bg-paper`, `text-ink`, dan `border-ink` ikut menyesuaikan.

## Cara edit

1. Edit file di `src/` (misal `src/partials/experience.html`).
2. Jalankan build:

   ```bash
   npm run build
   ```

   Atau:

   ```bash
   npm run watch
   ```

3. Commit `src/`, `js/`, `css/`, dan `index.html` bersamaan.

> `index.html` adalah file hasil generate. Jangan diedit langsung.

## GitHub Pages

Tidak ada langkah khusus: GitHub Pages menyajikan `index.html` apa adanya. `.nojekyll` memastikan tidak ada pemrosesan Jekyll. Preview lokal cukup buka `index.html` di browser.
