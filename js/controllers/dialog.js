class DialogController extends Stimulus.Controller {

  static get targets () {
    return ['main', 'browse']
  }

  connect () {
    this.openDialog = null
  }

  browse () {
    this.close()
    this.browseTarget.setAttribute('open', true)
    this.mainTarget.classList.add('blur')
    this.openDialog = this.browseTarget
  }

  close () {
    if (this.openDialog) {
      this.openDialog.removeAttribute('open')
    }
    this.mainTarget.classList.remove('blur')
  }
}

app.register('dialog', DialogController)
