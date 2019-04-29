import Vue from 'vue';
import Vuex from 'vuex';
import locales from '../locale';
import blog from './blog';
import channel from './channel';
import exhibitions from './exhibitions';
import talks from './talks';
import explore from './explore';
import header from './header';
import home from './home';
import journal from './journal';
import lightbox from './lightbox';
import pages from './pages';
import search from './search';
import site from './site';
import tags from './tags';
import { asyncGet, Response } from '../api';

Vue.use(Vuex);

export function createStore() {
  return new Vuex.Store({
    state: {
      lang: locales[0],
      langSecondary: locales[1],
      translations: {},
    },
    getters: {
      baseURL(state) {
        return `${state.site.url}/${state.lang}`;
      },
    },
    actions: {
      init(context) {
        if (!context.state.initialized) {
          return asyncGet('data/site/').then((response) => {
            const { data } = response;
            context.commit('site/init', data);
            context.commit('tags/set', data);
            context.commit('setTranslations', data);
            return response;
          });
        }
        return Promise.resolve(new Response(true));
      },
    },
    mutations: {
      setLanguage(state, { primary, secondary }) {
        state.lang = primary;
        state.langSecondary = secondary;
      },
      setTranslations(state, { translations }) {
        state.translations = translations;
      },
    },

    modules: {
      blog: blog(),
      channel: channel(),
      exhibitions: exhibitions(),
      explore: explore(),
      header: header(),
      home: home(),
      journal: journal(),
      lightbox: lightbox(),
      pages: pages(),
      talks: talks(),
      search: search(),
      site: site(),
      tags: tags(),
    },
  });
}
