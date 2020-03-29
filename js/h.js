window.h = h

function h (tag, attrs = {}, children = []) {
  children = Array.isArray(children) ? children : [children]
  var el = document.createElement(tag)

  Object.keys(attrs).forEach(function (attr) {
    el.setAttribute(attr, attrs[attr])
  })

  children.forEach(function (child) {
    if (typeof child === 'string') {
      el.innerText += child
    } else {
      el.appendChild(child)
    }
  })

  return el
}
