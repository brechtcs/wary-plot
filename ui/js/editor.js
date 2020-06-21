import { Draft, basename, crel, debounce, dirname, ready } from './lib.js'
import { formatTimestamp } from './util.js'
import { listDrafts, loadUser } from './storage.js'

var url = new URL(location)
var user = loadUser()

ready(() => {
  window.draft = new Draft(window.writer, url.searchParams.get('room'), user)
  window.title.setAttribute('placeholder', 'Untitled')
  window.username.setAttribute('placeholder', draft.user.name)
  sessionStorage.setItem('opened|' + draft.room, Date.now())

  if (user) {
    window.username.value = user.name
  }

  if (url.searchParams.has('room')) {
    window.title.value = localStorage.getItem('title|' + draft.room)
  } else {
    url.searchParams.set('room', draft.room)
    history.pushState({}, '', url)
  }

  window.draft.doc.on('update', debounce(updateCounters, 50, true))
  document.addEventListener('selectionchange', debounce(updateCounters, 1500))
  updateCounters()

  window.title.addEventListener('input', debounce(event => {
    localStorage.setItem('title|' + draft.room, event.target.value)
  }, 750))

  window.username.addEventListener('input', debounce(event => {
    draft.user = { name: event.target.value }
    localStorage.setItem('user', JSON.stringify(draft.user))
  }, 750))

  window.new.addEventListener('click', event => {
    location = '/editor'
  })

  window.browse.addEventListener('click', event => {
    event.preventDefault()
    window.popup.toggleAttribute('open')
    window.main.classList.add('blur')
  })

  window.cancel.addEventListener('click', event => {
    event.preventDefault()
    window.popup.toggleAttribute('open')
    window.main.classList.remove('blur')
  })

  if ('beaker' in window) {
    window.save.removeAttribute('disabled')
    window.save.addEventListener('click', async event => {
      event.preventDefault()

      var prev = JSON.parse(localStorage.getItem('file|' + draft.room))
      var file = await beaker.shell.saveFileDialog({
        defaultFilename: prev ? basename(prev.path) : window.title.value + '.md',
        defaultPath: prev ? dirname(prev.path): null,
        drive: prev ? prev.origin : null
      })

      await beaker.hyperdrive.writeFile(file.url, draft.editor.content)
      localStorage.setItem('file|' + draft.room, JSON.stringify(file))
    })
  }

  listDrafts().forEach(draft => {
    var href = '/editor?room=' + draft.id
    var item = crel('li',
      crel('a', { href }, draft.title || 'Untitled'),
      draft.opened > 0 ? crel('time', formatTimestamp(draft.opened)) : null
    )

    window.drafts.append(item)
  })
})

function updateCounters () {
  var { chars, words } = draft.editor.count()
  window.chars.innerText = chars
  window.words.innerText = words
}
