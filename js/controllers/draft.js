var AUTOSAVE_MS = 1100

class DraftController extends Stimulus.Controller {

  static get targets () {
    return ['content', 'name', 'words', 'chars']
  }

  initialize () {
    this.rename = debounce(rename.bind(this), AUTOSAVE_MS)
  }

  async connect () {
    try {
      this.url = new URL(window.location)
      this.name = this.key

      this.contentTarget.innerHTML = localStorage.getItem(this.key) || ''
      this.editor = await InlineEditor.create(this.contentTarget, this.settings)
      this.editor.model.document.on('change:data', debounce(() => {
        localStorage.setItem(this.key, this.editor.getData())
        app.message('Draft saved.')
      }, AUTOSAVE_MS))

      this.count = this.editor.plugins.get('WordCount')
      this.count.on('update', () => {
        this.wordsTarget.innerText = this.count.words
        this.charsTarget.innerText = this.count.characters
      })

      this.wordsTarget.innerText = this.count.words
      this.charsTarget.innerText = this.count.characters

      document.title = this.name + ' · Drafts'
    } catch (err) {
      app.error(err)
    }
  }

  disconnect () {
    this.editor.destroy()
  }

  trash () {
    sessionStorage.setItem(this.key, this.editor.getData())
    localStorage.removeItem(this.key)
    Turbolinks.visit('/')
  }

  get name () {
    return this.nameTarget.value
  }

  set name (name) {
    this.nameTarget.value = name
  }

  get key () {
    if (this.url.searchParams.has('draft')) {
      return this.url.searchParams.get('draft')
    }
    throw new Error('No draft key was given')
  }

  set key (key) {
    this.url.searchParams.set('draft', key)
    history.pushState({}, '', this.url)
  }

  get settings () {
    return {
      placeholder: 'Start drafting...'
    }
  }
}

function rename () {
  var prev = this.key
  if (this.name === this.key) return
  else this.key = this.name

  localStorage.setItem(this.key, this.editor.getData())
  localStorage.removeItem(prev)
  app.success('Draft renamed.')
}

app.register('draft', DraftController)
