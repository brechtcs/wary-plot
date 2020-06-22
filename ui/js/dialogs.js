import { crel } from './lib.js'
import { listDrafts } from './storage.js'

export function createBrowseDialog () {
  var header = crel('h1', 'Recent Drafts')
  var list = crel('ul', { class: 'drafts' }, listDrafts().map(draft => {
    var link = crel('a', { href: '/editor?room=' + draft.id }, draft.title || 'Untitled')
    var opened = draft.opened > 0 ? crel('time', formatTimestamp(draft.opened)) : null
    return crel('li', link, opened)
  }))

  var close = crel('button', { class: 'cancel' }, 'Close')
  var actions = crel('section', { class: 'actions' }, close)

  var dialog = crel('dialog', header, list, actions)
  close.addEventListener('click', () => closeDialog(dialog), { once: true })
  dialog.setAttribute('class', 'popup')
  dialog.setAttribute('open', true)

  return dialog
}

function closeDialog (el) {
  el.remove()
  window.main.classList.remove('blur')
}

function formatTimestamp (ms) {
  var date = new Date(ms)
  var year = 1900 + date.getYear()
  var month = String(date.getMonth() + 1).padStart(2, '0')
  var day = String(date.getDate()).padStart(2, '0')
  var hours = String(date.getHours()).padStart(2, '0')
  var minutes = String(date.getMinutes()).padStart(2, '0')
  return `${year}-${month}-${day} ${hours}:${minutes}`
}
