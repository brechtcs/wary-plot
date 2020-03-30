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

  editor.model.document.on('change:data', function () {
    content = editor.getData()
    localStorage.setItem(key, content)
  })
}

function actions (key, name, editor) {
  var form = document.actions
  form.elements.name.value = name

  var btn = { href: '#', role: 'button' }
  var file = name + '.html'
  var download = h('a', { ...btn, download: file }, 'Download')
  var mailto = h('a', btn, 'Email')

  var content = ''

  form.elements.rename.addEventListener('click', function () {
    var prev = key
    name = form.elements.name.value
    key = encodeURIComponent(name)
    localStorage.setItem(key, editor.getData())
    localStorage.removeItem(prev)
    window.location = '/editor?draft=' + key
  })

  form.elements.trash.addEventListener('click', function () {
    sessionStorage.setItem(key, editor.getData())
    localStorage.removeItem(key)
    window.location = '/'
  })

  download.addEventListener('click', function () {
    content = encodeURIComponent(editor.getData())
    download.href = 'data:text/html,' + content
  })

  mailto.addEventListener('click', function () {
    content = encodeURIComponent(editor.getData())
    mailto.href = 'mailto:?subject=' + key + '&body=' + content
  })

  var fieldset = h('fieldset')
  fieldset.appendChild(download)
  fieldset.appendChild(mailto)
  form.appendChild(fieldset)
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
