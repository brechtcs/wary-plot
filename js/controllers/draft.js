var AUTOSAVE_MS = 1100

class DraftController extends Stimulus.Controller {

  static get targets () {
    return ['content', 'name']
  }

  initialize () {
    this.rename = debounce(rename.bind(this), AUTOSAVE_MS)
  }

  async connect () {
    try {
      this.url = new URL(window.location)
      this.name = this.key
      this.editor = await InlineEditor.create(this.contentTarget, this.settings)
      this.editor.setData(localStorage.getItem(this.key) || '')
      this.editor.model.document.on('change:data', debounce(() => {
        localStorage.setItem(this.key, this.editor.getData())
        app.message('Draft saved.')
      }, AUTOSAVE_MS))

      document.title = this.name + ' · Drafts'
      document.querySelector('style').setAttribute('media', 'screen')
    } catch (err) {
      app.error(err)
    }
  }

  trash () {
    sessionStorage.setItem(this.key, this.editor.getData())
    localStorage.removeItem(this.key)
    window.location = '/'
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
    this.key = prompt('Name your draft:')
    return this.key
  }

  set key (key) {
    this.url.searchParams.set('draft', key)
    history.pushState({}, '', this.url)
  }

  get settings () {
    return {
      placeholder: 'Start drafting...',
      heading: this.heading,
      toolbar: this.toolbar
    }
  }

  get heading () {
    return {
      options: [
        { model: 'paragraph', title: 'Paragraph' },
        { model: 'heading1', view: 'h1', title: 'Heading 1' },
        { model: 'heading2', view: 'h2', title: 'Heading 2' },
        { model: 'heading3', view: 'h3', title: 'Heading 3' },
        { model: 'heading4', view: 'h4', title: 'Heading 4' }
      ]
    }
  }

  get toolbar () {
    return [
      'heading', '|', 'bold', 'italic', 'link', '|',
      'bulletedList', 'numberedList', 'blockQuote',
      'insertTable', 'mediaEmbed', '|',
      'undo', 'redo'
    ]
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
