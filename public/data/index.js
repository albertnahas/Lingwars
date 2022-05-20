const fs = require("fs")

function getFiles(dir, files_) {
  files_ = files_ || []
  var files = fs.readdirSync(dir)
  for (var i in files) {
    var name = dir + "/" + files[i]
    if (fs.statSync(name).isDirectory()) {
      getFiles(name, files_)
    } else {
      files_.push(name)
    }
  }
  return files_
}

const root = "audio"
const output = getFiles(`./${root}`).map((f) => f.replace(`./${root}/`, ""))
// stringify JSON Object
var jsonContent = JSON.stringify(output)

fs.writeFile("files.json", jsonContent, "utf8", function (err) {
  if (err) {
    console.log("An error occured while writing JSON Object to File.")
    return console.log(err)
  }

  console.log("JSON file has been saved.")
})
