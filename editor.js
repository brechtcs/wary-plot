var settings = {
  placeholder: 'Start drafting...'
}

async function edit (err, name) {
  if (err) {
    return console.error(err)
  }

  var article = document.querySelector('article')
  var editor = await InlineEditor.create(article, settings).catch(console.error)
  var content = localStorage.getItem(name)

  if (content) {
    editor.setData(content)
  }

  editor.model.document.on('change:data', function () {
    content = editor.getData()
    localStorage.setItem(name, content)
  })
}

function open (done) {
  var ready = ['complete', 'interactive']

  function init () {
    var url = new URL(window.location)
    var name = null

    if (url.searchParams.has('name')) {
      name = url.searchParams.get('name')
    } else {
      name = prompt('Name your draft:')
      url.searchParams.set('name', name)
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
