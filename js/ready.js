var readyStates = ['complete', 'interactive']

window.ready = function (cb) {
  if (readyStates.includes(document.readyState)) {
    return setTimeout(cb)
  }
  document.addEventListener('DOMContentLoaded', cb)
}
