const fs = require('fs');
const path = require('path');
const LRU = require('lru-cache');
const express = require('express');
const favicon = require('serve-favicon');
const compression = require('compression');
const axios = require('axios');
const auth = require('http-auth');

const resolve = file => path.resolve(__dirname, file);
const { createBundleRenderer } = require('vue-server-renderer');

const isProd = process.env.NODE_ENV === 'production';
const useMicroCache = process.env.MICRO_CACHE !== 'false';
const serverInfo =
  `express/${require('express/package.json').version} ` +
  `vue-server-renderer/${require('vue-server-renderer/package.json').version}`;

const app = express();

const template = fs.readFileSync(resolve('./src/index.template.html'), 'utf-8');

function createRenderer(bundle, options) {
  // https://github.com/vuejs/vue/blob/dev/packages/vue-server-renderer/README.md#why-use-bundlerenderer
  return createBundleRenderer(bundle, Object.assign(options, {
    template,
    // for component caching
    cache: LRU({
      max: 1000,
      maxAge: 1000 * 60 * 15,
    }),
    // this is only needed when vue-server-renderer is npm-linked
    basedir: resolve('./dist'),
    // recommended for performance
    runInNewContext: true,
  }));
}

let renderer;
let readyPromise;
if (isProd) {
  // In production: create server renderer using built server bundle.
  // The server bundle is generated by vue-ssr-webpack-plugin.
  const bundle = require('./dist/vue-ssr-server-bundle.json');
  // The client manifests are optional, but it allows the renderer
  // to automatically infer preload/prefetch links and directly add <script>
  // tags for any async chunks used during render, avoiding waterfall requests.
  const clientManifest = require('./dist/vue-ssr-client-manifest.json');
  renderer = createRenderer(bundle, {
    clientManifest,
  });
} else {
  // In development: setup the dev server with watch and hot-reload,
  // and create a new renderer on bundle / index template update.
  readyPromise = require('./build/setup-dev-server')(app, (bundle, options) => {
    renderer = createRenderer(bundle, options);
  });
}

const serve = (path, cache) => express.static(resolve(path), {
  maxAge: cache && isProd ? 60 * 60 * 24 * 30 : 0,
});

app.use(compression({ threshold: 0 }));
app.use(favicon('./public/logo-48.png'));
app.use('/dist', serve('./dist', true));
app.use('/public', serve('./public', true));
app.use('/manifest.json', serve('./manifest.json', true));
app.use('/service-worker.js', serve('./dist/service-worker.js'));

// Basic authentication
if (process.env.AUTH === 'true') {
  const basicAuth = auth.basic({
    realm: 'Staging Area.',
    file: resolve('./.htpasswd'),
  });

  app.use((req, res, next) => {
    if (req.path === '/status') next();
    else (auth.connect(basicAuth))(req, res, next);
  });
}

// 30-second microcache.
// https://www.nginx.com/blog/benefits-of-microcaching-nginx/
const microCache = LRU({
  max: 100,
  maxAge: 30000,
});

// since this app has no user-specific content, every page is micro-cacheable.
// if your app involves user-specific content, you need to implement custom
// logic to determine whether a request is cacheable based on its url and
// headers.
const isCacheable = req => useMicroCache;

let previewQuery = false;

axios.interceptors.request.use((config) => {
  if (previewQuery) config.params.p = previewQuery;
  return config;
});

const locales = require('./src/locale/browser.js');

function render(req, res) {
  const s = !isProd ? Date.now() : false;

  // Set language
  if (req.path === '' || req.path === '/') {
    // Create flattened array of all the locales
    const allLocales = [];
    locales.groups.forEach(group =>
      locales.accepts[group].forEach(locale =>
        allLocales.push(locale)));
    // Find a match
    const lang = req.acceptsLanguages(allLocales);
    if (lang) {
      const localeMatch = locales.groups.find(group =>
        locales.accepts[group].indexOf(lang) >= 0);
      if (localeMatch) req.url = `/${localeMatch}/`;
    }
  }

  // Set the preview query for the axios interceptor
  previewQuery = req.query.p ? req.query.p : false;

  res.setHeader('Content-Type', 'text/html');
  res.setHeader('Server', serverInfo);

  const handleError = (err) => {
    if (err.url) {
      res.redirect(err.url);
    } else if (err.status === 404) {
      res.status(404).end('404 | Page Not Found');
    } else {
      // Render Error Page or Redirect
      res.status(500).end('500 | Internal Server Error');
      console.error(`error during render : ${req.url}`);
      console.error(err);
    }
  };

  const cacheable = isCacheable(req);
  if (cacheable) {
    const hit = microCache.get(req.url);
    if (hit) {
      if (!isProd) {
        console.log('cache hit!');
      }
      return res.end(hit);
    }
  }

  const context = {
    title: 'M+ Stories', // default title
    description: 'M+ Stories Website', // default description
    url: req.url,
  };

  renderer.renderToString(context, (err, html) => {
    if (err) {
      return handleError(err);
    }

    if (context.state.route.name === 'not-found' && context.state.site.initialized) {
      res.status(404);
      return res.end(html);
    }

    res.end(html);
    if (cacheable) microCache.set(req.url, html);
    if (!isProd) console.log(`whole request: ${Date.now() - s}ms`);
    return true;
  });
}

// Status check for load balancer
app.get('/status', (req, res) => {
  res.json({ status: 'running' });
});

app.get('*', isProd ? render : (req, res) => {
  readyPromise.then(() => render(req, res));
});

const port = process.env.PORT || 8080;
app.listen(port, () => {
  console.log(`server started at localhost:${port}`);
});
