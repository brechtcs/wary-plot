import { crel } from './lib.js'
import { listDrafts } from './storage.js'

var attrs = { class: 'popup', open: 'open' }

export function createBrowseDialog () {
  var drafts = listDrafts().map(draft => {
    var link = crel('a', { href: '/editor?room=' + draft.id }, draft.title || 'Untitled')
    var opened = draft.opened > 0 ? crel('time', formatTimestamp(draft.opened)) : null
    return crel('li', link, opened)
  })

  return crel('dialog', attrs,
    crel('h1', 'Recent Drafts'),
    crel('ul', { class: 'drafts' }, drafts),
    crel('section', { class: 'actions' }, createCloseButton())
  )
}

export function createSaveDialog () {
  var beaker = crel('a', { href: 'https://beakerbrowser.com' }, 'Beaker Browser')

  return crel('dialog', attrs,
    crel('h1', 'Save Draft'),
    crel('p', 'At the moment, it\'s only possible to save drafts to a Hyperdrive in ', beaker, '.'),
    crel('section', { class: 'actions' }, createCloseButton())
  )
}

function createCloseButton () {
  var button = crel('button', { class: 'cancel' }, 'Close')
  button.addEventListener('click', e => closeDialog(e.target), { once: true })
  return button
}

function closeDialog (el) {
  if (el.tagName !== 'DIALOG') {
    return closeDialog(el.parentElement)
  }
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
