import { resolve } from 'path'
import { defineConfig } from 'vite'
import { viteStaticCopy } from 'vite-plugin-static-copy'

const root = new URL('.', import.meta.url).pathname

export default defineConfig({
  // Relative base so paths work from any subdirectory (fotos/*/index.html etc.)
  base: './',

  build: {
    outDir: 'dist',
    emptyOutDir: true,
    rollupOptions: {
      input: {
        // Root pages
        index: resolve(root, 'index.html'),
        fotos: resolve(root, 'fotos.html'),
        tijdlijn: resolve(root, 'tijdlijn.html'),
        bronnen: resolve(root, 'bronnen.html'),
        contact: resolve(root, 'contact.html'),
        detijd: resolve(root, 'detijd.18940116.html'),
        // Photo gallery sub-pages
        'fotos-dakterras': resolve(root, 'fotos/dakterras/index.html'),
        'fotos-keuken': resolve(root, 'fotos/keuken/index.html'),
        'fotos-tuin': resolve(root, 'fotos/tuin/index.html'),
        'fotos-renovatie-exterieur': resolve(
          root,
          'fotos/renovatie-exterieur/index.html',
        ),
        'fotos-oude-doos': resolve(root, 'fotos/oude-doos/index.html'),
      },
    },
  },

  plugins: [
    // Vite rewrites <img src="…"> to hashed asset paths, which would break
    // data-pswp-srcset attributes (PhotoSwipe) that reference the same relative
    // paths. Temporarily rename the attribute around Vite's HTML transform so
    // the images are NOT processed as bundled assets, and copy them separately.
    {
      name: 'preserve-relative-img-src',
      transformIndexHtml: {
        order: 'pre',
        handler(html) {
          return html.replace(
            /(<img\b[^>]*)\bsrc="((?!(?:https?:|\/\/|\/|data:))[^"]+\.(?:webp|jpg|jpeg|png)[^"]*)"/gi,
            '$1 data-preserve-src="$2"',
          )
        },
      },
    },
    {
      name: 'restore-relative-img-src',
      transformIndexHtml: {
        order: 'post',
        handler(html) {
          return html.replace(/\bdata-preserve-src="([^"]+)"/g, 'src="$1"')
        },
      },
    },

    // Copy static assets that are not imported from JS/CSS.
    // - fotos/*/resized/: WebP images referenced via <a href> and <img src>
    // - images/: bouwtekening PNGs linked from tijdlijn.html via <a href>
    // - CNAME: must be present at the GitHub Pages domain root
    viteStaticCopy({
      targets: [
        { src: 'fotos/dakterras/resized', dest: 'fotos/dakterras' },
        { src: 'fotos/keuken/resized', dest: 'fotos/keuken' },
        { src: 'fotos/tuin/resized', dest: 'fotos/tuin' },
        {
          src: 'fotos/renovatie-exterieur/resized',
          dest: 'fotos/renovatie-exterieur',
        },
        { src: 'fotos/oude-doos/resized', dest: 'fotos/oude-doos' },
        { src: 'images', dest: '.' },
        { src: 'CNAME', dest: '.' },
      ],
    }),
  ],
})
