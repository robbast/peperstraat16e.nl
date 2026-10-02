// chrome mobile sometimes does not scroll to anchor identifier

function scrollToAnchor () {
  const isChrome = /Chrome/.test(navigator.userAgent) && /Google Inc/.test(navigator.vendor)
  const location = new URL(window.location)

  if (location.hash && isChrome) {
    setTimeout(() => document.getElementById(location.hash.replace('#', ''))?.scrollIntoView(), 250)
  }
}

if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', scrollToAnchor)
} else {
  scrollToAnchor()
}
