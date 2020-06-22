import { createBrowseDialog } from './dialogs.js'
import { ready } from './lib.js'

ready(() => {
  window.new.addEventListener('click', event => {
    location = '/editor'
  })

  window.browse.addEventListener('click', event => {
    event.preventDefault()
    document.body.append(createBrowseDialog())
    window.main.classList.add('blur')
  })
})
