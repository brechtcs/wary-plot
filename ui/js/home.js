import { crel, ready } from './lib.js'
import { formatTimestamp } from './util.js'
import { listDrafts } from './storage.js'

ready(() => {
  listDrafts().forEach(draft => {
    var href = '/editor?room=' + draft.id
    var item = crel('li', crel('a', { href }, draft.title || 'Untitled'))
    window.drafts.append(item)
  })

  var create = crel('button', '+ New')
  create.addEventListener('click', createDraft)
  window.nav.append(create)
})

function createDraft () {
  location = '/editor'
}
