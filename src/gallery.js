// PhotoSwipe lightbox shared by the gallery pages and the drawings on tijdlijn.html

import PhotoSwipeLightbox from 'photoswipe/lightbox'
import PhotoSwipeFullscreen from './photoswipe-fullscreen.js'

// Show the <figcaption> next to the clicked link as the caption of the open photo
function registerCaption(lightbox) {
  lightbox.on('uiRegister', () =>
    lightbox.pswp.ui.registerElement({
      name: 'custom-caption',
      order: 9,
      isButton: false,
      appendTo: 'root',
      html: '',
      onInit: (el) =>
        lightbox.pswp.on('change', () => {
          const captionElement = lightbox.pswp.currSlide.data.element?.nextElementSibling

          el.replaceChildren(...Array.from(captionElement?.childNodes ?? [], (node) => node.cloneNode(true)))
        }),
    }),
  )
}

export function initGallery(gallery, { captions = false } = {}) {
  const lightbox = new PhotoSwipeLightbox({
    gallery,
    children: 'a[data-pswp-width]',
    pswpModule: () => import('photoswipe'),
    bgOpacity: 0.9,
    loop: false,
  })

  if (captions) {
    registerCaption(lightbox)
  }

  new PhotoSwipeFullscreen(lightbox)

  lightbox.init()
}
