var AUTOSAVE_MS = 1200

var settings = {
  placeholder: 'Start drafting...',
  toolbar: [
    'heading', '|', 'bold', 'italic', 'link', '|',
    'bulletedList', 'numberedList', 'blockQuote',
    'insertTable', 'mediaEmbed', '|',
    'undo', 'redo'
  ],
  heading: {
    options: [
      { model: 'paragraph', title: 'Paragraph' },
      { model: 'heading1', view: 'h1', title: 'Heading 1' },
      { model: 'heading2', view: 'h2', title: 'Heading 2' },
      { model: 'heading3', view: 'h3', title: 'Heading 3' },
      { model: 'heading4', view: 'h4', title: 'Heading 4' }
    ]
  }
}

async function edit (err, name) {
  if (err) {
    app.error(err.message)
    return console.error(err)
  }

  var key = encodeURIComponent(name)
  var article = document.querySelector('article')
  var editor = await InlineEditor.create(article, settings).catch(console.error)
  var content = localStorage.getItem(key)
  actions(key, name, editor)

  if (content) {
    editor.setData(content)
  }

  editor.model.document.on('change:data', debounce(function () {
    content = editor.getData()
    localStorage.setItem(key, content)
    app.message('Draft saved.')
  }, AUTOSAVE_MS))

  var style = document.querySelector('style')
  style.setAttribute('media', 'screen')
}

function actions (key, name, editor) {
  var form = document.draft
  var el = form.elements

  var content = ''
  el.name.value = name

  el.name.addEventListener('input', debounce(function () {
    if (el.name.value === name) {
      return
    }
    var prev = key
    name = el.name.value
    key = encodeURIComponent(name)
    localStorage.setItem(key, editor.getData())
    localStorage.removeItem(prev)
    window.history.pushState({}, '', '/editor?draft=' + key)
    app.success('Draft renamed.')
  }, AUTOSAVE_MS))

  el.trash.addEventListener('click', function () {
    sessionStorage.setItem(key, editor.getData())
    localStorage.removeItem(key)
    window.location = '/'
  })
}

function open (done) {
  ready(function () {
    var name, key
    var url = new URL(window.location)

    if (url.searchParams.has('draft')) {
      key = url.searchParams.get('draft')
      name = decodeURIComponent(key)
    } else {
      name = prompt('Name your draft:')
      key = encodeURIComponent(name)
      url.searchParams.set('draft', key)
      history.pushState({}, '', url)
    }

    document.title = name + ' · Drafts'
    done(null, name)
  })
}

open(edit)
