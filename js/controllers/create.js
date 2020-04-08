class CreateController extends Stimulus.Controller {

  static get targets () {
    return ['name']
  }

  confirm () {
    window.location = `/editor?draft=${this.param}`
  }

  get param () {
    return encodeURIComponent(this.name)
  }

  get name () {
    return this.nameTarget.value
  }
}

app.register('create', CreateController)
