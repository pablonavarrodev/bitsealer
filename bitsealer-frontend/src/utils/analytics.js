export function trackEvent(eventName, payload = {}) {
  try {
    if (typeof window !== 'undefined' && window.umami && typeof window.umami.track === 'function') {
      window.umami.track(eventName, payload)
    }
  } catch (error) {
    console.error('Umami track error:', error)
  }
}