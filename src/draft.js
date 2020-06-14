import * as Y from 'yjs'
import { IndexeddbPersistence } from 'y-indexeddb'
import { WebrtcProvider } from 'y-webrtc'
import { keymap } from 'prosemirror-keymap'
import { ySyncPlugin, yCursorPlugin, yUndoPlugin, undo, redo } from 'y-prosemirror'
import Pamphlet from 'pamphlet'

var room = location.host + location.pathname
var password = location.host

var doc = new Y.Doc()
var content = doc.getXmlFragment(room)
var network = new WebrtcProvider(room, doc, { password })
var storage = new IndexeddbPersistence(room, doc)
var user = randomName()

network.awareness.setLocalStateField('user', { name: user })

var plugins = [
  ySyncPlugin(content),
  yCursorPlugin(network.awareness),
  yUndoPlugin(),
  keymap({
    'Mod-z': undo,
    'Mod-Shift-z': redo
  })
]

window.username.setAttribute('placeholder', user)
window.username.addEventListener('input', event => {
  network.awareness.setLocalStateField('user', { name: event.target.value || user })
})

window.editor = new Pamphlet(window.writer, { plugins })
window.content = content
window.network = network
window.storage = storage

//=====

function randomName () {
  return Math.round(Math.random() * 200000000).toString(16).padStart(7, '0').toUpperCase()
}
