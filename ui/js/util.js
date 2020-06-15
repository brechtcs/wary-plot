export function debounce (fn, ms, immediate) {
  var timeout = null

  return function (...args) {
    var now = immediate && !timeout
    clearTimeout(timeout)
    timeout = setTimeout(() => {
      timeout = null
      if (!immediate) fn.apply(this, args)
    }, ms)

    if (now) fn.apply(this, args)
  }
}