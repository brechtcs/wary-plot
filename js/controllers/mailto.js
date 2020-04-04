class MailtoController extends Stimulus.Controller {

  static get targets () {
    return ['button', 'body', 'subject', 'type']
  }

  connect () {
    if (this.type === 'html') {
      this.buttonTarget.removeAttribute('disabled')
    } else {
      this.buttonTarget.setAttribute('disabled', true)
    }
  }

  submit (event) {
    try {
      var href = this.href
      var target = '_blank'
      h('a', { href, target }).click()
    } catch (err) {
      app.error(err.message)
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

  get type () {
    return this.typeTarget.value
  }
}

app.register('mailto', MailtoController)
