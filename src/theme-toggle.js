// Theme toggle: System/Auto + Dark + Light with localStorage persistence

const STORAGE_KEY = 'peperstraat-theme'
const DARK = 'dark'
const LIGHT = 'light'
const SYSTEM = 'system'

function getSystemPreference() {
  return window.matchMedia('(prefers-color-scheme: dark)').matches ? DARK : LIGHT
}

function getStoredTheme() {
  return localStorage.getItem(STORAGE_KEY)
}

function saveTheme(theme) {
  localStorage.setItem(STORAGE_KEY, theme)
}

function applyTheme(theme) {
  const html = document.documentElement

  if (theme === SYSTEM) {
    html.removeAttribute('data-bs-theme')
  } else {
    html.setAttribute('data-bs-theme', theme)
  }
}

function getCurrentTheme() {
  const stored = getStoredTheme()

  if (stored) {
    return stored
  }

  return SYSTEM
}

function getNextTheme() {
  const current = getCurrentTheme()
  const systemPref = getSystemPreference()

  if (current === SYSTEM) {
    // From auto: go to opposite of current system preference
    return systemPref === DARK ? LIGHT : DARK
  } else if (current === systemPref) {
    // If forced to same as system pref: go back to system
    return SYSTEM
  } else {
    // If forced to opposite of system pref: go to system preference
    return systemPref
  }
}

function toggleTheme() {
  const newTheme = getNextTheme()

  saveTheme(newTheme)
  applyTheme(newTheme)
  updateToggleButton()
}

function getIconForNextTheme() {
  const next = getNextTheme()

  // Show icon for what you'll GET when you click
  if (next === DARK) {
    return 'bi-moon-stars-fill'
  } else if (next === LIGHT) {
    return 'bi-sun-fill'
  } else {
    return 'bi-arrow-repeat'
  }
}

function getAriaLabelForNextTheme() {
  const next = getNextTheme()

  if (next === DARK) {
    return 'Switch to dark mode'
  } else if (next === LIGHT) {
    return 'Switch to light mode'
  } else {
    return 'Switch to system theme'
  }
}

function updateToggleButton() {
  const button = document.querySelector('.theme-toggle i')
  if (!button) return

  button.className = 'bi ' + getIconForNextTheme()

  const toggleBtn = document.querySelector('.theme-toggle')
  if (toggleBtn) {
    toggleBtn.setAttribute('aria-label', getAriaLabelForNextTheme())
  }
}

// Initialize on page load
function init() {
  const stored = getStoredTheme()
  if (stored) {
    applyTheme(stored)
  }

  // Listen for system preference changes
  window.matchMedia('(prefers-color-scheme: dark)').addEventListener('change', () => {
    if (!getStoredTheme()) {
      updateToggleButton()
    }
  })

  // Setup toggle button
  const toggleBtn = document.querySelector('.theme-toggle')
  if (toggleBtn) {
    toggleBtn.addEventListener('click', toggleTheme)
    updateToggleButton()
  }
}

// Run when DOM is ready
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', init)
} else {
  init()
}
