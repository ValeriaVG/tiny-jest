const fs = require("fs");
const path = require("path");
const { prettify } = require("./dist");
// Read directory
function runTests(dir) {
  fs.readdir(dir, async (err, files) => {
    if (err) return console.error(err);
    for (let file of files) {
      if (/\.(test|spec)\.js/.test(file) {
        const test = require(path.join(__dirname, dir, file));
        console.log("Running", test.title, ":", test.suite.length, "tests");
        await test.run().then(prettify);
      }
    }
  });
}
runTests("./tests");
