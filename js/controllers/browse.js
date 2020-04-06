class BrowseController extends Stimulus.Controller {

  static get targets () {
    return ['list', 'toggle']
  }

  connect () {
    Object.keys(localStorage)
      .map(link.bind(this, 'editor'))
      .forEach(li => this.listTarget.appendChild(li))

    Object.keys(sessionStorage)
      .map(link.bind(this, 'trash'))
      .forEach(li => this.listTarget.appendChild(li))
  }
}

function link (page, name) {
  var href = `/${page}?draft=${encodeURIComponent(name)}`
  var content = [h('a', { href }, name)]
  if (page === 'trash') {
    content.push(h('em', {}, ' (deleted)'))
  }
  return h('li', {}, content)
}

app.register('browse', BrowseController)
