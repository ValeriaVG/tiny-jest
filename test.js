const fs = require("fs/promises");
const path = require("path");
const { prettify } = require("./dist");
// Read directory
async function runTests(dir) {
  let passed = true;
  const files = await fs.readdir(dir);
  for (let file of files) {
    if (/\.(test|spec)\.js/.test(file)) {
      const test = require(path.join(__dirname, dir, file));
      console.log("Running", test.title, ":", test.suite.length, "tests");
      const results = await test.run();
      prettify(results);
      if (passed) passed = results.every((test) => test.passed);
    }
  }
  return passed;
}
runTests("./tests").then((passed) => {
  if (passed) return console.log(`All tests have passed`);
  console.error("Some tests have failed");
  process.exit(-1);
});
