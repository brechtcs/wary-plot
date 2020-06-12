var { WebsocketProvider } = require('y-websocket')
var { keymap } = require('prosemirror-keymap')
var { ySyncPlugin, yCursorPlugin, yUndoPlugin, undo, redo } = require('y-prosemirror')
var Pamphlet = require('pamphlet')
var Y = require('yjs')

var ws = new URL(location)
ws.protocol = 'ws:'
ws.port= '1234'

var doc = new Y.Doc()
var fragment = doc.getXmlFragment('draft')
var provider = new WebsocketProvider(ws.href, 'draft', doc)
var name = randomName()

provider.awareness.setLocalStateField('user', { name })

var plugins = [
  ySyncPlugin(fragment),
  yCursorPlugin(provider.awareness),
  yUndoPlugin(),
  keymap({
    'Mod-z': undo,
    'Mod-Shift-z': redo
  })
]

window.username.setAttribute('placeholder', name)
window.username.addEventListener('input', event => {
  provider.awareness.setLocalStateField('user', { name: event.target.value || name })
})

window.editor = new Pamphlet(window.writer, { plugins })
window.fragment = fragment
window.provider = provider

//=====

function randomName () {
  return Math.round(Math.random() * 200000000).toString(16).padStart(7, '0').toUpperCase()
}
