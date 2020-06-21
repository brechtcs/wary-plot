export function formatTimestamp (ms) {
  var date = new Date(ms)
  var year = 1900 + date.getYear()
  var month = String(date.getMonth() + 1).padStart(2, '0')
  var day = String(date.getDate()).padStart(2, '0')
  var hours = String(date.getHours()).padStart(2, '0')
  var minutes = String(date.getMinutes()).padStart(2, '0')
  return `${year}-${month}-${day} ${hours}:${minutes}`
}
