ready(function () {
  var main = document.querySelector('main')
  var stored = Object.keys(localStorage)
  var deleted = Object.keys(sessionStorage)

  if (stored.length) {
    var drafts = h('ul', {}, stored.map(link.bind(null, 'editor')))
    main.appendChild(h('hr'))
    main.appendChild(h('p', {}, 'Want to revisit a previous draft?'))
    main.appendChild(drafts)
  }

  if (deleted.length) {
    var trash = h('ul', {}, deleted.map(link.bind(null, 'trash')))
    var empty = h('button', { type: 'button', name: 'purge' }, 'Empty Trash')
    empty.addEventListener('click', purge)

    main.appendChild(h('hr'))
    main.appendChild(h('p', {}, 'Need to recover something from the trash?'))
    main.appendChild(trash)
    main.appendChild(empty)
  }
})

function link (page, key) {
  var name = decodeURIComponent(key)
  var href = `/${page}?draft=${key}`
  return h('li', {}, h('a', { href }, name))
}

function purge () {
  var name = 'all trash'
  var check = prompt(`Purge ${name}? Type 'purge' to confirm.`)
  if (check.toLowerCase() !== 'purge') return alert(`Purge not confirmed, ${name} was kept`)
  deleted.forEach(sessionStorage.removeItem.bind(sessionStorage))
  window.location.reload()
}
