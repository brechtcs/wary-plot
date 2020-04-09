class PopupController extends Stimulus.Controller {

  static get targets () {
    return ['backdrop', 'dialog']
  }

  disconnect () {
    this.closeDialog()
  }

  closeDialog () {
    this.dialogTarget.removeAttribute('open')
    this.backdropTarget.classList.remove('blur')
  }

  showBrowseDialog () {
    this.loadController('browse')
    this.showDialog('browse')
  }

  showCreateDialog () {
    this.loadController('create')
    this.showDialog('create')
  }

  async showDialog (partial) {
    if (partial !== this.data.get('current')) {
      await this.loadPartial(partial).catch(app.error)
    }
    this.dialogTarget.setAttribute('open', true)
    this.backdropTarget.classList.add('blur')
    this.data.set('current', partial)
  }

  async loadPartial (partial) {
    this.dialogTarget.innerHTML = await fetch(`/partials/${partial}`).then(res => {
      return res.text()
    })
  }

  loadController (ctrl) {
    var src = `/js/controllers/${ctrl}.js`
    var tag = document.head.querySelector(`script[src="${src}"]`)

    if (!tag) {
      tag = document.createElement('script')
      tag.setAttribute('src', src)
      document.head.appendChild(tag)
    }
  }
}

app.register('popup', PopupController)
