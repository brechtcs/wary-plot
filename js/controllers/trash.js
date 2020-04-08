class TrashController extends Stimulus.Controller {

  static get targets () {
    return ['content', 'name']
  }

  connect () {
    try {
      this.url = new URL(window.location)
      this.content = sessionStorage.getItem(this.key)
      this.name = this.key
    } catch (err) {
      app.error(err)
    }
  }

  restore () {
    localStorage.setItem(this.name, this.content)
    sessionStorage.removeItem(this.key)
    Turbolinks.visit('/editor?draft=' + encodeURIComponent(this.name))
  }

  purge () {
    this.name = this.key
    var check = prompt(`Purge ${this.name}? Type 'purge' to confirm.`)
    if (check.toLowerCase() !== 'purge') return alert(`Purge not confirmed, ${this.name} was kept`)
    sessionStorage.removeItem(this.key)
    Turbolinks.visit('/')
  }

  get key () {
    if (!this.url.searchParams.has('draft')) {
      throw new Error('No draft key was given')
    }
    return this.url.searchParams.get('draft')
  }

  get name () {
    return this.nameTarget.value
  }

  set name (name) {
    this.nameTarget.value = name
  }

  get content () {
    return this.contentTarget.innerHTML
  }

  set content (content) {
    this.contentTarget.innerHTML = content
  }
}

app.register('trash', TrashController)
