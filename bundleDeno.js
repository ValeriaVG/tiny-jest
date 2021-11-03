const fs = require("fs/promises");
const path = require("path");
const bundle = async () => {
  const files = ["Test.ts", "expect.ts", "prettify.ts"];
  let mod = "";
  for (const file of files) {
    const content = await fs.readFile(path.resolve(__dirname, "src", file));
    const lines = content.toString().split("\n");
    for (const line of lines) {
      if (line.startsWith("import")) continue;
      if (line.startsWith("export default")) {
        mod += line.replace("export default", "export") + "\n";
        continue;
      }
      mod += line + "\n";
    }
  }
  await fs.writeFile(path.resolve(__dirname, "dist", "mod.ts"), mod);
};
bundle();
