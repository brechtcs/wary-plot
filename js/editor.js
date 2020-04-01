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

  editor.model.document.on('change:data', debounce(function () {
    content = editor.getData()
    localStorage.setItem(key, content)
    alertify.success('Saved!')
  }, 1500))
}

function actions (key, name, editor) {
  var form = document.actions
  form.elements.name.value = name

  var role = 'button'
  var download = h('a', { role, download: name + '.docx' }, 'Download')
  var mailto = h('a', { role }, 'Email')

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

  editor.model.document.on('change:data', function () {
    if (download.href) {
      download.removeAttribute('href')
    }
  })

  download.addEventListener('click', function (event) {
    if (download.href) {
      return
    }
    event.stopPropagation()
    event.preventDefault()

    var html = '<!doctype html><head><meta charset="utf-8"></head><html><body>' + editor.getData() + '</body></html>'
    var docx = htmlDocx.asBlob(html)

    var reader = new FileReader()
    reader.addEventListener('load', function () {
      download.href = reader.result
      download.click()
    })

    reader.readAsDataURL(docx)
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
