/* eslint-disable no-console */

const fs = require('node:fs');
const minimist = require('minimist');

const { convertAsync } = require('../lib/convert.cjs');

const argv = minimist(process.argv.slice(2));

// Usage: bin -o -s sourcemap.js.map -i input
const { s, i, o } = argv;

if (!s && !i) {
    console.log(
        `Usage:
  re-sourcemap -s sourcemap.js.map -i input -o
Options:
    -s : string - path to the sourcemap file (usually ending in js.map)
    -i : string - extract from DevTools stack trace (usually after error), containing the mapped line,column data that need to be "reversed"
    -o : [bool] - if present will store the output in a file named as the input and added extension ".result"
  `,
    );
    process.exit(0);
}

if (!fs.existsSync(s)) {
    console.error(`No valid sourcemap file provided: ${s}`);
    process.exit(1);
}

const sourceMap = fs.readFileSync(s, 'utf-8');
const input = fs.existsSync(i) ? fs.readFileSync(i, 'utf-8') : i;

(async () => {
    const result = await convertAsync(sourceMap, input, !o);

    if (!o) return console.log(result);

    fs.writeFileSync(`${i}.result`, result, {
        encoding: 'utf-8',
        flag: 'w',
    });
})();
