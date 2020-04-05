// Start Stimulus
var stim = Stimulus.Application.start()

// Configure Alertify
alertify.defaults.notifier.position = 'top-left'
alertify.defaults.notifier.delay = 3

// Expose App object
window.app = {
  register: function (name, controller) {
    stim.register(name, controller)
  },
  message: function (msg) {
    console.info(msg)
    alertify.message(msg)
  },
  success: function (msg) {
    console.info(msg)
    alertify.success(msg)
  },
  warning: function (err) {
    console.warn(err)
    alertify.warning(err.message)
  },
  error: function (err) {
    console.error(err)
    alertify.error(err.message)
  }
}
