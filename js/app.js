window.app = Stimulus.Application.start()

alertify.defaults.notifier.position = 'top-left'
alertify.defaults.notifier.delay = 3
app.message = alertify.message
app.success = alertify.success
app.warning = alertify.warning
app.error = alertify.error
