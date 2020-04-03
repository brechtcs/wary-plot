var readyStates = ['complete', 'interactive']

window.ready = function (cb) {
  if (readyStates.includes(document.readyState)) {
    return setTimeout(cb)
  }
  document.addEventListener('DOMContentLoaded', cb)
}

window.h = function (tag, attrs = {}, children = []) {
  children = Array.isArray(children) ? children : [children]
  var el = document.createElement(tag)

  Object.keys(attrs).forEach(function (attr) {
    el.setAttribute(attr, attrs[attr])
  })

  children.forEach(function (child) {
    if (typeof child === 'string') {
      el.innerText += child
    } else {
      el.appendChild(child)
    }
  })

  return el
}

window.debounce = function (fn, ms) {
  var timeout = null

  return function (...args) {
    clearTimeout(timeout)
    timeout = setTimeout(() => {
      timeout = null
      fn.apply(this, args)
    }, ms)
  }
}

/**
 * Alertify configuration
 */
alertify.defaults.notifier.delay = 3
alertify.defaults.notifier.position = 'bottom-left'
