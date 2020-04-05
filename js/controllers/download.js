class DownloadController extends Stimulus.Controller {

  static get targets () {
    return ['content', 'name', 'type']
  }

  async start () {
    try {
      var download = this.file
      var href = await format(this.content, this.type)
      h('a', { href, download }).click()
    } catch (err) {
      app.error(err)
    }
  }

  get content () {
    return this.contentTarget.ckeditorInstance.getData()
  }

  get file () {
    return this.name + '.' + this.type
  }

  get name () {
    return this.nameTarget.value
  }

  get type () {
    return this.typeTarget.value
  }
}

app.register('download', DownloadController)

/**
 * Document formatting logic:
 */
async function format (content, type) {
  switch (type.toLowerCase()) {
    case 'html':
      return formatHtml(content)
    case 'docx':
      return formatWord(content)
    default:
      throw new Error('Unsupported format: ' + type)
  }
}

async function formatHtml (content) {
  var html = await getDocument(content)
  return 'data:text/html,' + encodeURIComponent(html)
}

async function formatWord (content) {
  var html = await getDocument(content)
  var docx = htmlDocx.asBlob(html)
  var reader = new FileReader()

  return new Promise(function (resolve) {
    reader.addEventListener('load', function () {
      resolve(reader.result)
    })

    reader.readAsDataURL(docx)
  })
}

async function getDocument (content) {
  var style = await getStyle()

  return `<!doctype html>
    <html>
      <head>
        <meta charset="utf-8">
        <style>${style}</style>
      </head>
      <body>${content}</body>
    </html>
  `
}

async function getStyle () {
  var res = await fetch('/css/common.css')
  return res.text()
}
