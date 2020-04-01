window.format = async function (content, { type, doc }) {
  switch (type.toLowerCase()) {
    case 'html':
      return doc ? formatHtmlDoc(content) : formatHtmlData(content)
    case 'word':
      return formatWord(content)
    default:
      throw new Error('Unsupported format: ' + type)
  }
}

async function formatHtmlData (content) {
  var html = await formatHtmlDoc(content)
  return 'data:text/html,' + encodeURIComponent(html)
}

async function formatHtmlDoc (content) {
  return `<!doctype html>
    <html>
      <head>
        <meta charset="utf-8">
      </head>
      <body>${content}</body>
    </html>
  `
}

async function formatWord (content) {
  var html = await formatHtmlDoc(content)
  var docx = htmlDocx.asBlob(html)
  var reader = new FileReader()

  return new Promise(function (resolve) {
    reader.addEventListener('load', function () {
      resolve(reader.result)
    })

    reader.readAsDataURL(docx)
  })
}
