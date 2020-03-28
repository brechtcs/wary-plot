var settings = {
  placeholder: 'Start drafting...'
}

async function edit (err, name) {
  if (err) {
    return console.error(err)
  }

  var key = encodeURIComponent(name)
  var article = document.querySelector('article')
  var editor = await InlineEditor.create(article, settings).catch(console.error)
  var content = localStorage.getItem(key)

  if (content) {
    editor.setData(content)
  }

  editor.model.document.on('change:data', function () {
    content = editor.getData()
    localStorage.setItem(key, content)
  })

  actions(key, name, editor)
}

function actions (key, name, editor) {
  var el = document.querySelector('.actions')
  var file = name + '.html'
  var download = h('a', { href: '#', download: file }, 'Download')
  var mailto = h('a', { href: '#' }, 'Email')

  var content = ''

  download.addEventListener('click', function () {
    content = encodeURIComponent(editor.getData())
    download.href = 'data:text/html,' + content
  })

  mailto.addEventListener('click', function () {
    content = encodeURIComponent(editor.getData())
    mailto.href = 'mailto:?subject=' + key + '&body=' + content
  })

  el.appendChild(download)
  el.appendChild(mailto)
}

function open (done) {
  var ready = ['complete', 'interactive']

  function init () {
    var name, key
    var url = new URL(window.location)

    if (url.searchParams.has('name')) {
      key = url.searchParams.get('name')
      name = decodeURIComponent(key)
    } else {
      name = prompt('Name your draft:')
      key = encodeURIComponent(name)
      url.searchParams.set('name', key)
      history.pushState({}, '', url)
    }

    document.title = name + ' · Drafts'
    done(null, name)
  }

  if (ready.includes(document.readyState)) {
    return setTimeout(init)
  }
  document.addEventListener('DOMContentLoaded', init)
}

open(edit)
