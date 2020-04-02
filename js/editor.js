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
    alertify.error(err.message)
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
    alertify.message('Draft saved.')
  }, AUTOSAVE_MS))

  var style = document.querySelector('style')
  style.setAttribute('media', 'screen')
}

function actions (key, name, editor) {
  var form = document.draft
  var el = form.elements

  var content = ''
  var extension = 'html'
  el.extension.value = extension
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
  }, AUTOSAVE_MS))

  el.trash.addEventListener('click', function () {
    sessionStorage.setItem(key, editor.getData())
    localStorage.removeItem(key)
    window.location = '/'
  })

  el.extension.addEventListener('change', function () {
    extension = el.extension.value

    switch (extension.toLowerCase()) {
      case 'html':
        el.mailto.removeAttribute('disabled')
        break
      case 'docx':
        el.mailto.setAttribute('disabled', true)
        break
    }
  })

  el.download.addEventListener('click', async function () {
    content = editor.getData()
    name = el.name.value
    extension = el.extension.value

    try {
      var download = name + '.' + extension
      var href = await format(content, { extension })
      h('a', { href, download }).click()
    } catch (err) {
      alertify.error(err.message)
      console.error(err)
    }
  })

  el.mailto.addEventListener('click', async function () {
    content = editor.getData()
    extension = el.extension.value

    try {
      var data = await format(content, { extension, doc: true })
      var href = 'mailto:?subject=' + key + '&body=' + encodeURIComponent(data)
      h('a', { href }).click()
    } catch (err) {
      alertify.error(err.message)
      console.error(err)
    }
  })

  form.style.display = 'block'
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
