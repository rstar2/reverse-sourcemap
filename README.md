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
