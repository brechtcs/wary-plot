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
    alertify.success('Saved!')
  }, 1500))
}

function actions (key, name, editor) {
  var form = document.actions
  form.elements.name.value = name

  var role = 'button'
  var download = h('a', { role, download: name + '.docx' }, 'Download')
  var mailto = h('a', { role }, 'Email')
  var options = h('select', {}, [
    h('option', {}, 'HTML'),
    h('option', {}, 'Word')
  ])

  var content = ''
  var type = 'HTML'
  options.value = type

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

  options.addEventListener('change', function () {
    switch (options.value.toLowerCase()) {
      case 'html':
        download.removeAttribute('href')
        mailto.removeAttribute('hidden')
        break
      case 'word':
        download.removeAttribute('href')
        mailto.setAttribute('hidden', true)
        break
    }
  })

  download.addEventListener('click', async function (event) {
    if (download.href) {
      return
    }
    event.stopPropagation()
    event.preventDefault()
    content = editor.getData()
    type = options.value

    try {
      var data = await format(content, { type })
      download.href = data
      download.click()
      reset(download, editor)
    } catch (err) {
      alertify.error(err.message)
      console.error(err)
    }
  })

  mailto.addEventListener('click', async function (event) {
    if (mailto.href) {
      return
    }
    event.stopPropagation()
    event.preventDefault()
    content = editor.getData()
    type = options.value

    try {
      var data = await format(content, { type, doc: true })
      mailto.href = 'mailto:?subject=' + key + '&body=' + encodeURIComponent(data)
      mailto.click()
      reset(mailto, editor)
    } catch (err) {
      alertify.error(err.message)
      console.error(err)
    }
  })

  var fieldset = h('fieldset')
  fieldset.appendChild(options)
  fieldset.appendChild(download)
  fieldset.appendChild(mailto)
  form.appendChild(fieldset)
  form.style.display = 'block'
}

function reset (link, editor) {
  editor.model.document.once('change:data', function () {
    if (link.href) {
      link.removeAttribute('href')
    }
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
