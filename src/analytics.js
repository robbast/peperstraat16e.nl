// Google Analytics initialization
window.dataLayer = window.dataLayer || []

function gtag() {
  window.dataLayer.push(arguments)
}

gtag('js', new Date())
gtag('config', 'G-Q5YN1ZCS28')

// Load Google Analytics script
const script = document.createElement('script')

script.src = 'https://www.googletagmanager.com/gtag/js?id=G-Q5YN1ZCS28'
script.defer = true
script.async = true

document.head.appendChild(script)
