class TrashController extends Stimulus.Controller {

  static get targets () {
    return ['content', 'name']
  }

  connect () {
    try {
      this.url = new URL(window.location)
      this.content = sessionStorage.getItem(this.key)
      this.name = decodeURIComponent(this.key)
    } catch (err) {
      app.error(err.message)
      console.error(err)
    }
  }

  restore () {
    var key = encodeURIComponent(this.name)
    localStorage.setItem(key, this.content)
    sessionStorage.removeItem(this.key)
    window.location = '/editor?draft=' + key
  }

  purge () {
    this.name = decodeURIComponent(this.key)
    var check = prompt(`Purge ${name}? Type 'purge' to confirm.`)
    if (check.toLowerCase() !== 'purge') return alert(`Purge not confirmed, ${name} was kept`)
    sessionStorage.removeItem(this.key)
    window.location = '/'
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
