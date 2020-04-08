class CreateController extends Stimulus.Controller {

  static get targets () {
    return ['name']
  }

  confirm () {
    Turbolinks.visit(`/editor?draft=${this.param}`)
  }

  get param () {
    return encodeURIComponent(this.name)
  }

  get name () {
    return this.nameTarget.value
  }
}

app.register('create', CreateController)
