window.format = function (content, { type, doc }, done) {
  switch (type.toLowerCase()) {
    case 'html':
      return doc ? formatHtmlDoc(content, done) : formatHtmlData(content, done)
    case 'word':
      return formatWord(content, done)
    default:
      done(new Error('Unsupported format: ' + type))
  }
}

function formatHtmlData (content, done) {
  formatHtmlDoc(content, function (err, html) {
    if (err) return done(err)
    done(null, 'data:text/html,' + html)
  })
}

function formatHtmlDoc (content, done) {
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
  formatHtmlDoc(content, function (err, html) {
    if (err) return done(err)
    var docx = htmlDocx.asBlob(html)
    var reader = new FileReader()

    reader.addEventListener('load', function () {
      done(null, reader.result)
    })

    reader.readAsDataURL(docx)
  })
}
