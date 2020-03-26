open(edit)

async function edit (err, name) {
  if (err) {
    return console.error(err)
  }

  var article = document.querySelector('article')
  var settings = { placeholder: 'Hatch a plot...' }
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
  var url = new URL(window.location)
  var init = function () {
    var name = null

    if (url.searchParams.has('name')) {
      name = url.searchParams.get('name')
    } else {
      name = prompt('Open or create a document.\nChoose:')
      url.searchParams.set('name', name)
      history.pushState({}, '', url)
    }

    document.title = name + ' (Wary Plot)'
    done(null, name)
  }

  if (ready.includes(document.readyState)) {
    return setTimeout(init)
  }
  document.addEventListener('DOMContentLoaded', init)
}
