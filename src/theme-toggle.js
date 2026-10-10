// Theme toggle: System/Auto + Dark + Light with localStorage persistence

const STORAGE_KEY = 'peperstraat-theme'
const DARK = 'dark'
const LIGHT = 'light'
const SYSTEM = 'system'

function getSystemPreference() {
  return window.matchMedia('(prefers-color-scheme: dark)').matches ? DARK : LIGHT
}

// localStorage throws when storage is blocked; fall back to the system theme and don't remember the choice
function getStoredTheme() {
  try {
    return localStorage.getItem(STORAGE_KEY)
  } catch {
    return null
  }
}

function saveTheme(theme) {
  try {
    localStorage.setItem(STORAGE_KEY, theme)
  } catch {
    // ignore
  }
}

// Always set an explicit theme: Bootstrap's CSS has no prefers-color-scheme rules of its own.
// The inline script in each page's <head> does the same before first paint.
function applyTheme(theme) {
  document.documentElement.setAttribute('data-bs-theme', theme === SYSTEM ? getSystemPreference() : theme)
}

function getCurrentTheme() {
  const stored = getStoredTheme()

  // Ignore anything we didn't store ourselves, like the inline <head> script does
  if (stored === DARK || stored === LIGHT || stored === SYSTEM) {
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
    return 'Schakel naar donkere modus'
  } else if (next === LIGHT) {
    return 'Schakel naar lichte modus'
  } else {
    return 'Volg systeeminstelling'
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
  applyTheme(getCurrentTheme())

  // Listen for system preference changes
  window.matchMedia('(prefers-color-scheme: dark)').addEventListener('change', () => {
    if (getCurrentTheme() === SYSTEM) {
      applyTheme(SYSTEM)
    }
    updateToggleButton()
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
