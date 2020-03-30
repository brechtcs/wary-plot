ready(function () {
  var url = new URL(window.location)

  if (!url.searchParams.has('draft')) return
  var key = url.searchParams.get('draft')
  var article = document.querySelector('article')
  var form = document.actions

  var name = decodeURIComponent(key)
  var content = sessionStorage.getItem(key)
  article.innerHTML = content

  form.elements.restore.addEventListener('click', function () {
    var prev = key
    key = encodeURIComponent(form.elements.name.value)
    localStorage.setItem(key, content)
    sessionStorage.removeItem(prev)
    window.location = '/editor?draft=' + key
  })

  form.elements.purge.addEventListener('click', function () {
    form.elements.name.value = name
    var check = prompt(`Purge ${name}? Type 'purge' to confirm.`)
    if (check.toLowerCase() !== 'purge') return alert(`Purge not confirmed, ${name} was kept`)
    sessionStorage.removeItem(key)
    window.location = '/'
  })

  form.elements.name.value = name
  form.style.display = 'block'
})
