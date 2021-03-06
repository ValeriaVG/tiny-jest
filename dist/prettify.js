"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
function prettify(testResults) {
    testResults.forEach(({ title, passed, skipped, error }) => {
        if (passed)
            return console.info("\x1b[32m", `✓ ${title}`);
        if (skipped)
            return console.info("\x1b[33m", `□ ${title}`);
        if (!passed)
            return console.error("\x1b[31m", `𐄂 ${title}`, "\n  Failed:", error.message);
    });
    console.log("\x1b[0m");
}
exports.default = prettify;
