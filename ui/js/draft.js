import { Draft, debounce, ready } from '/js/lib.js'

ready(() => {
  var url = new URL(location)
  var user = loadUser()

  window.draft = new Draft(window.writer, url.searchParams.get('room'), user)
  window.title.setAttribute('placeholder', 'Untitled')
  window.username.setAttribute('placeholder', draft.user.name)

  if (user) {
    window.username.value = user.name
  }

  if (url.searchParams.has('room')) {
    window.title.value = localStorage.getItem('title|' + draft.room)
  } else {
    url.searchParams.set('room', draft.room)
    history.pushState({}, '', url)
  }

  if (!window.title.value) {
    sessionStorage.setItem('recent|' + draft.room, Date.now())
  }

  window.title.addEventListener('input', debounce(event => {
    localStorage.setItem('title|' + draft.room, event.target.value)
  }, 750))

  window.username.addEventListener('input', debounce(event => {
    draft.user = { name: event.target.value }
    localStorage.setItem('user', JSON.stringify(draft.user))
  }, 750))

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
})

function loadUser () {
  try {
    return JSON.parse(localStorage.user)
  } catch (err) {
    console.debug(err)
    return null
  }
}
