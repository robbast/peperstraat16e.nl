// chrome mobile sometimes does not scroll to anchor identifier

function scrollToAnchor() {
  const isChrome = /Chrome/.test(navigator.userAgent) && /Google Inc/.test(navigator.vendor)
  const location = new URL(window.location)
  const anchorTarget = location.hash?.replace('#', '')

  if (anchorTarget && isChrome) {
    setTimeout(() => document.getElementById(anchorTarget)?.scrollIntoView(), 250)
  }
}

if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', scrollToAnchor)
} else {
  scrollToAnchor()
}
