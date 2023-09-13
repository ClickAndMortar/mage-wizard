# Mage Wizard

## Requirements

- [Node.js](https://nodejs.org/en/) (`18.x` or newer)

## Usage

### Installing globally using npm

```shell
npm install -g mage-wizard

mage-wizard
```

Open http://localhost:3000 in your browser.

### Using npx

```shell
npx mage-wizard
```

Open http://localhost:3000 in your browser.

### Environment variables

| Name   | Description       | Default value |
|--------|-------------------|---------------|
| `PORT` | Port to listen on | `3000`        |
| `HOST` | Host to listen on | `127.0.0.1`   |

## Development

### Requirements

- [pnpm](https://pnpm.io/) (v6 or newer)

### Setup

```bash
pnpm install
```

### Development server

Start the development server on `http://localhost:3000`:

```bash
pnpm run dev
```

## Build

* Bump version in `package.json`
* `pnpm run build`
* Remove `scripts` and `devDependencies` from `package.json`
* Add `#!/usr/bin/env node` at the top of `dist/server/index.mjs` and make it executable (`chmod +x dist/server/index.mjs`)
* `npm pack`
* `npm publish --access=public`
