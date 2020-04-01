window.format = function (type, content, done) {
  switch (type.toLowerCase()) {
    case 'htmldocument':
      return formatHtmlDocument(content, done)
    case 'word':
      return formatWord(content, done)
    default:
      done(new Error('Unsupported format: ' + type))
  }
}

function formatHtmlDocument (content, done) {
  setTimeout(function () {
    done(null, `<!doctype html>
      <html>
        <head>
          <meta charset="utf-8">
        </head>
        <body>${content}</body>
      </html>
    `)
  })
}

function formatWord (content, done) {
  formatHtmlDocument(content, function (err, html) {
    if (err) return done(err)
    var docx = htmlDocx.asBlob(html)
    var reader = new FileReader()

    reader.addEventListener('load', function () {
      done(null, reader.result)
    })

    reader.readAsDataURL(docx)
  })
}
