# Next-gen AiiDA provenance explorer

[![NPM Version](https://img.shields.io/npm/v/aiida-explorer)](https://www.npmjs.com/package/aiida-explorer)

React component to explore AiiDA provenance.

This is a new version under development with the goal to replace https://github.com/materialscloud-org/aiida-explorer

Install via

```bash
npm install aiida-explorer
```

And use with the following (note that the components needs to be inside a `Routes` object as it contains `Route` objects itself.)

```javascript
import { BrowserRouter, Routes, Route } from "react-router-dom";

import AiidaExplorer from "aiida-explorer";

<BrowserRouter>
  <Routes>
    <Route path="/*" element={<AiidaExplorer apiUrl={aiidaRestApiUrl} />} />
  </Routes>
</BrowserRouter>;
```

where `aiidaRestApiUrl` is the base url of the [AiiDA REST API](https://aiida.readthedocs.io/projects/aiida-core/en/v2.6.2/reference/rest_api.html).

Note that this repository contains

1. the `AiidaExplorer` component (library), which is also published to `npm`; and
2. a demo page illustrating the usage, which is deployed to github pages.

## Development

### Using the demo page

For development, start the demo page by

```
npm install
npm run dev
```

### Building and testing locally the library

To build just the `AiidaExplorer` component and test locally in an external application (e.g. before publishing to `npm`), use

```bash
npm run build:lib
npm pack
```

which will create a `.tgz` file that can then be installed by the external application via

```bash
npm install /path/to/aiida-explorer-x.y.z.tgz
```

### Publishing a new version of the library on npm

To make a new version and publish to npm via GitHub Actions:

```bash
npm version <major/minor/patch>
git push --follow-tags
```

### Deploying the demo page to github-pages

```
npm run deploy
```
