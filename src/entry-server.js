import { createApp } from './app';
import locales from './locale';
import promiseAllSoftFail from './util/promise-all-soft-fail';

const isDev = process.env.NODE_ENV !== 'production';

// This exported function will be called by `bundleRenderer`.
// This is where we perform data-prefetching to determine the
// state of our application before actually rendering it.
// Since data fetching is async, this function is expected to
// return a Promise that resolves to the app instance.
export default context => new Promise((resolve, reject) => {
  const s = isDev && Date.now();
  const { app, router, store } = createApp();

  // set router's location
  router.push(context.url);

  // wait until router has resolved possible async hooks
  router.onReady(() => {
    const matchedComponents = router.getMatchedComponents();
    // no matched routes
    if (!matchedComponents.length) {
      console.log('No matched components...');
      reject({ status: 404 });
    }

    // Prepend the site data request
    matchedComponents.unshift({
      asyncData() {
        return store.dispatch('site/init');
      },
    });

    // Call fetchData hooks on components matched by the route.
    // A preFetch hook dispatches a store action and returns a Promise,
    // which is resolved when the action is complete and store state has been
    // updated.
    promiseAllSoftFail(matchedComponents.map(({ asyncData }) => asyncData && asyncData({
      store,
      route: router.currentRoute,
      router,
    }))).then((responses) => {
      if (isDev) console.log(`data pre-fetch: ${Date.now() - s}ms`);

      // If the site request didn't resolve, then reject
      if (!responses[0].resolved) return reject(responses[0]);
      // If the site data was retrieved but the view data wasn't, we initialize
      // the app but show the 404 view as we can't display the requested route
      if (!responses[1].resolved) router.replace({ name: 'not-found', params: { lang: locales[0] } });

      // After all preFetch hooks are resolved, our store is now
      // filled with the state needed to render the app.
      // Expose the state on the render context, and let the request handler
      // inline the state in the HTML response. This allows the client-side
      // store to pick-up the server-side state without having to duplicate
      // the initial data fetching on the client.
      context.state = store.state;
      return resolve(app);
    });
  }, reject);
});
