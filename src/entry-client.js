import Vue from 'vue';
import VueAnalytics from 'vue-analytics';
import VueGtm from 'vue-gtm';
import VueClipboard from 'vue-clipboards';
import _ from 'lodash';
import 'es6-promise/auto';
import objectFitImages from 'object-fit-images';
import objectFitVideos from 'object-fit-videos';
import { createApp } from './app';
import locales from './locale';
import { setClient } from './util/meta';
import AppModal from './components/AppModal.vue';
import AppProgress from './components/AppProgress.vue';

// Global progress bar vue instance
Vue.prototype.$bar = new Vue(AppProgress).$mount();
const bar = Vue.prototype.$bar;
document.body.appendChild(bar.$el);

// Global modal dialog vue instance
Vue.prototype.$modal = new Vue(AppModal).$mount();
const modal = Vue.prototype.$modal;
document.body.appendChild(modal.$el);

Vue.prototype.$triggerNative = (event = 'resize') => {
  const evt = window.document.createEvent('UIEvents');
  evt.initUIEvent(event, true, false, window, 0);
  Vue.nextTick(() => {
    window.dispatchEvent(evt);
  });
};
const triggerNative = Vue.prototype.$triggerNative;

function handleError(error) {
  modal.error(error);
  bar.finish();
}

// A global mixin that calls `asyncData` when a route component's params change
Vue.mixin({
  beforeRouteUpdate(to, from, next) {
    const { asyncData } = this.$options;
    // IF component has no asyncData property OR just language change
    // OR just a hash change THEN no async necessary
    if (!asyncData
      || to.params.lang !== from.params.lang
      || (to.hash !== from.hash && to.path === from.path)) {
      document.cookie = `lang=${to.params.lang}; path=/`;
      next();
    } else {
      bar.start();
      asyncData({ store: this.$store, route: to })
        .then(() => {
          bar.finish();
          next();
        }).catch(handleError);
    }
  },
});

const { app, router, store } = createApp();

// Use Analytics
if (process.env.ANALYTICS_ID) {
  Vue.use(VueAnalytics, {
    id: process.env.ANALYTICS_ID,
    router,
  });
}

// Use Tag Manager
if (process.env.TAG_MANAGER_ID) {
  Vue.use(VueGtm, {
    id: process.env.TAG_MANAGER_ID,
    debug: true,
    vueRouter: router,
  });
}

// Use Clipboard
Vue.use(VueClipboard);

// Prime the store with server-initialized state.
// The state is determined during SSR and inlined in the page markup.
if (window.__INITIAL_STATE__) {
  store.replaceState(window.__INITIAL_STATE__);
  // Replace route with not found if async functions have forced a redirect
  if (store.state.route.name === 'not-found') {
    const { name, params } = store.state.route;
    router.replace({ name, params });
  }
}

// Wait until router has resolved all async before hooks
// and async components...
router.onReady(() => {
  // Add router hook for handling asyncData.
  // Doing it after initial route is resolved so that we don't double-fetch
  // the data that we already have. Using router.beforeResolve() so that all
  // async components are resolved.
  router.beforeResolve((to, from, next) => {
    const prevLang = from.params.lang;
    const newLang = to.params.lang;
    const matched = router.getMatchedComponents(to);
    const prevMatched = router.getMatchedComponents(from);
    let diffed = false;
    // eslint-disable-next-line no-return-assign
    const activated = matched.filter((c, i) =>
      diffed || (diffed = (prevMatched[i] !== c)));
    // Update language state if this route has a different recognized locale
    // e.g. example.com/en/page/ => example.com/tc/page/
    if (newLang !== prevLang && _.includes(locales, newLang)) {
      store.commit('setLanguage', { primary: newLang, secondary: prevLang });
    }
    if (to.matched[0].instances && to.matched[0].instances.default) {
      setClient(to.matched[0].instances.default);
    }
    const asyncDataHooks = activated.map(c => c.asyncData).filter(__ => __);
    if (!asyncDataHooks.length) {
      return next();
    }
    bar.start();
    return Promise.all(asyncDataHooks.map(hook => hook({ store, route: to })))
      .then(([viewResponse]) => {
        if (typeof viewResponse === 'function') {
          viewResponse = viewResponse();
        }
        bar.finish();
        next();
      }).catch(handleError);
  });

  router.afterEach(() => {
    Vue.nextTick(() => { triggerNative('resize'); });
  });

  // Actually mount to DOM
  app.$mount('#app');

  // Object fit polyfill
  objectFitImages();
  objectFitVideos();
});

// Service worker
if (process.env.NODE_ENV === 'production' && 'serviceWorker' in navigator) {
  navigator.serviceWorker.register('/service-worker.js');
}
