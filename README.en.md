# ml-country-selector

Lightweight country/region selector written in TypeScript, zero framework dependency. Supports local/server search, pinyin match, i18n, sticky header with independent scroll, dark mode, and both ESM/UMD builds.

## Install
```bash
npm i ml-country-selector -S
```
CDN:
```html
<script src="https://unpkg.com/ml-country-selector/dist/index.js"></script>
```

## Quick Start
```ts
import { mlCountrySelector } from 'ml-country-selector';
mlCountrySelector.initializationFn({ el: '#container', selectedCallback: console.log }).render();
```

## Features
- Local & server search (type=search to trigger enter search)
- Pinyin/global match (local mode)
- Independent scroll for large lists
- Dark/light theme switch
- Rich callbacks & public APIs

## Options
See the Chinese README for the full table. Key options:
- `useServerSeach`: enable server search
- `serverTjAPI`: recommend API on typing
- `serverSeaAPI`: search API on enter (set `inputType='search'`)
- `supportEnSearch`: pinyin match (local mode)
- `globalSearchWord`: global match (local mode)

## Frameworks
Vue/React/Vanilla examples are available in the Chinese README.

## License
ISC


