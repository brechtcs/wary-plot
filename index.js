var { WebrtcProvider } = require('y-webrtc')
var { keymap } = require('prosemirror-keymap')
var { ySyncPlugin, yCursorPlugin, yUndoPlugin, undo, redo } = require('y-prosemirror')
var Pamphlet = require('pamphlet')
var Y = require('yjs')

var signaling = []
var local = new URL(location)
local.protocol = 'ws:'
local.port= '4444'
signaling.push(local)

var doc = new Y.Doc()
var room = 'draft'
var fragment = doc.getXmlFragment(room)
var provider = new WebrtcProvider(room, doc, { signaling })
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
