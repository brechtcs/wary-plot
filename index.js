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

provider.awareness.setLocalStateField('user', {
  name: prompt("What's your eame?"),
  color: randomColor()
})

var plugins = [
  ySyncPlugin(fragment),
  yCursorPlugin(provider.awareness),
  yUndoPlugin(),
  keymap({
    'Mod-z': undo,
    'Mod-Shift-z': redo
  })
]

window.editor = new Pamphlet(window.writer, { plugins })
window.fragment = fragment
window.provider = provider

function randomColor () {
  return '#' + randomHex() + randomHex() + randomHex()
}

function randomHex () {
  return Math.round(Math.random() * 255).toString(16)
}
