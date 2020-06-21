export function listDrafts () {
  var drafts = {}
  var order = (a, b) => b.opened - a.opened

  for (var key in localStorage) {
    if (!key.startsWith('title|')) {
      continue
    }

    var id = key.replace(/^title\|/, '')
    if (!drafts[id]) drafts[id] = { id }
    drafts[id].title = localStorage[key]
    drafts[id].opened = 0
  }

  for (var key in sessionStorage) {
    if (!key.startsWith('opened|')) {
      continue
    }

    var id = key.replace(/^opened\|/, '')
    if (!drafts[id]) drafts[id] = { id }
    drafts[id].opened = Number(sessionStorage[key])
  }

  return Object.values(drafts).sort(order)
}

export function loadUser () {
  try {
    return JSON.parse(localStorage.user)
  } catch (err) {
    console.debug(err)
    return null
  }
}
