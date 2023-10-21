# Reverse SourceMap

## CLI app

### Package portable executables withe the [pkg](https://github.com/vercel/pkg) tool. To create executables for Linux and Windows use the script

```bash
npm run build:cli
```

> This implies the `pkg` is globally installed with ```npm install -g pkg```

## Electron UI app

### Starting Development

Start the app in the `dev` environment:

```bash
npm start
```

### Packaging for Production

To package apps for the local platform:

```bash
npm run package
```

## Apps Contents - https://www.electron.build/configuration/contents

- Extracting the *app.asar* archive

```bash
npx asar extract app.asar <destfolder>
```

- `__dirname` is problematic in packaged mode, because the code for the main process is bundled as single file main.js (in webpack.config.main.prod.ts), and so when it is run the `__dirname` is the same current one `app.asar/dist/main`. This is problematic for this project as the used `source-map` package loads a file `mappings.wasm` from its lib folder using `__dirname`.
   > One way to get around this is to use the `source-map-js` package which is a fork from the `source-map` before using Rust and WASM.
   > The other way is to copy the `mappings.wasm` file in the `release/app/dist/main` before electron package. Done with a `npm` script `copy:source-map-wasm`.
