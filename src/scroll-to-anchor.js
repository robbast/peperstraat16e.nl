// chrome mobile sometimes does not scroll to anchor identifier

function scrollToAnchor() {
  const isChromeMobile = /Chrome/.test(navigator.userAgent) && /Mobile/.test(navigator.userAgent) && /Google Inc/.test(navigator.vendor)
  const location = new URL(window.location)
  const anchorTarget = location.hash?.replace('#', '')

  if (anchorTarget && isChromeMobile) {
    const startScrollY = window.scrollY

    setTimeout(() => {
      const target = document.getElementById(anchorTarget)
      // Only step in when the browser didn't scroll to the target and the user hasn't scrolled in the meantime
      const targetInView = target && Math.abs(target.getBoundingClientRect().top) < 50

      if (target && !targetInView && window.scrollY === startScrollY) {
        target.scrollIntoView()
      }
    }, 250)
  }
}

if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', scrollToAnchor)
} else {
  scrollToAnchor()
}
