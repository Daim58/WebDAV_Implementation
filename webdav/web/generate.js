console.log(`Generating icons ...`)

var path  = require('path')
var fs    = require('fs')
var bi    = path.join(__dirname, 'node_modules', 'bootstrap-icons', 'icons')

function capitalize(string) {
    return string.charAt(0).toUpperCase() + string.slice(1);
}

function pascalize (string) {
  const words = string.split('-')
  const capitalized = words.map(word => capitalize(word))
  return capitalized.join('')
}

fs.readdir(bi, function (err, items) {
  let content = ""
  if (err) {
    return console.log('Unable to scan directory: ' + err)
  }
  items.forEach(function (item) {
    let kebab  = item
    let pascal = pascalize(item).replace('.svg', 'Icon')
    let prefix = (content.length === 0) ? '' : '\n'
    content = content.concat(`${prefix}export { ReactComponent as BS${pascal} } from "bootstrap-icons/icons/${kebab}"`)
  })
  fs.writeFileSync(path.join(__dirname, 'src', 'components', 'bootstrap-icons.tsx'), content)
})