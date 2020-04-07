var ctrl = Stimulus.Application.start()

/**
 * Global app object
 */
window.app = {
  register: function (name, controller) {
    ctrl.register(name, controller)
  },
  message: function (msg) {
    console.info(msg)
    message(msg)
  },
  success: function (msg) {
    console.info(msg)
    message(msg, 'success')
  },
  warn: function (err) {
    console.warn(err)
    message(err instanceof Error ? err.message : err, 'warn')
  },
  error: function (err) {
    console.error(err)
    message(err instanceof Error ? err.message : err, 'error')
  }
}

/**
 * App alerts factory
 */
var container = null

function message (text, type) {
  if (container === null) {
    container = document.getElementById('alerts')
  }

  var time = new Date()
  var hours = String(time.getHours()).padStart(2, '0')
  var minutes = String(time.getMinutes()).padStart(2, '0')
  var seconds = String(time.getSeconds()).padStart(2, '0')

  var dialog = h('dialog', { open: true }, [
    h('time', {}, `${hours}:${minutes}:${seconds}`),
    h('pre', {}, text)
  ])

  dialog.classList.add('alert')
  if (type) dialog.classList.add(type)
  container.prepend(dialog)

  setTimeout(function () {
    container.removeChild(dialog)
  }, 3000)
}
