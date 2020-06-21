import * as Y from 'yjs'
import { IndexeddbPersistence } from 'y-indexeddb'
import { WebrtcProvider } from 'y-webrtc'
import { keymap } from 'prosemirror-keymap'
import { ySyncPlugin, yCursorPlugin, yUndoPlugin, undo, redo } from 'y-prosemirror'
import Pamphlet from 'pamphlet'

export default class Draft {
  constructor (element, room, user) {
    this.room = room || this.rand()
    this.doc = new Y.Doc()
    this.network = new WebrtcProvider(this.room, this.doc, { password: this.room })
    this.storage = new IndexeddbPersistence(this.room, this.doc)
    this.editor = new Pamphlet(element, { plugins: this.plugins })
    this.user = user || { name: this.rand() }
  }

  rand () {
    return Math.round(Math.random() * Date.now()).toString(16).padStart(12, '0')
  }

  get plugins () {
    return [
      ySyncPlugin(this.doc.getXmlFragment(this.room)),
      yCursorPlugin(this.network.awareness),
      yUndoPlugin(),
      keymap({
        'Mod-z': undo,
        'Mod-Shift-z': redo
      })
    ]
  }

  get user () {
    return this.network.awareness.getLocalState().user
  }

  set user (user) {
    this.network.awareness.setLocalStateField('user', user)
  }
}
