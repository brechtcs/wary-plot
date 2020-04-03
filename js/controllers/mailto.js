class MailtoController extends Stimulus.Controller {

  static get targets () {
    return ['button', 'body', 'subject', 'type']
  }

  connect () {
    this.typeListener = onTypeChange.bind(this)
    this.typeTarget.addEventListener('change', this.typeListener)
  }

  disconnect () {
    this.typeTarget.removeEventListener('change', this.typeListener)
  }

  submit (event) {
    try {
      var href = this.href
      var target = '_blank'
      var mailto = h('a', { href, target })
      mailto.click()
    } catch (err) {
      alertify.error(err.message)
      console.error(err)
    }
  }

  get href () {
    return 'mailto:?subject=' + this.subject + '&body=' + encodeURIComponent(this.body)
  }

  get body () {
    return this.bodyTarget.ckeditorInstance.getData()
  }

  get subject () {
    return this.subjectTarget.value
  }
}

function onTypeChange (e) {
  if (e.target.value === 'html') {
    this.buttonTarget.removeAttribute('disabled')
  } else {
    this.buttonTarget.setAttribute('disabled', true)
  }
}

app.register('mailto', MailtoController)
