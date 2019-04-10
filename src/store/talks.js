import Vue from 'vue';
import _ from 'lodash';
import { asyncGet, Response } from '../api';

export default function () {
  return {
    namespaced: true,

    state: {
      page: false,
      series: [],
      talk: false,
      talks: {},
      category: false,
      // Status
      showing: 'unfiltered',
      filtered: [],
      filteredRemaining: false,
      unfiltered: [],
      unfilteredRemaining: false,
    },

    getters: {
      categories(state, getters, { translations }) {
        if (!state.page) return [];
        const { categories } = state.page;
        const newCategory = {
          title: translations.talks.allCategories,
          name: false,
          active: false,
        };
        if (!state.category) newCategory.active = true;

        const newCategories = categories.map((cat) => {
          const obj = {
            title: cat.title,
            name: cat.name,
            active: false,
          };
          if (state.category.id === cat.id) obj.active = true;
          return obj;
        });

        return [newCategory, ...newCategories];
      },
      talk({ talk, talks }) {
        return talk ? talks[talk] : false;
      },
      series(state) {
        const series = state[state.showing];
        return series;
      },
      remaining(state) {
        return state[`${state.showing}Remaining`];
      },
    },

    actions: {
      initTalks(context, { category }) {
        // Get posts in category
        if (category) return context.dispatch('initFiltered', category);
        return context.dispatch('initUnfiltered');
      },

      initFiltered(context, category) {
        const type = 'filtered';

        if (context.state.filtered.length && category === context.state.category) {
          context.commit('setShowing', type);
          return Promise.resolve(new Response(true));
        }
        return asyncGet('talks', { category })
          .then((response) => {
            const {
              data,
              data: {
                series, remaining, category: cat,
              },
            } = response;
            context.dispatch('addSeries', series);
            context.commit('setSeries', { type, series });
            context.commit('setSeriesRemaining', { type, remaining });
            context.commit('setShowing', type);
            context.commit('setCategory', cat);
            if (!context.state.page) context.commit('setPage', data);
            return response;
          });
      },

      initUnfiltered(context) {
        const type = 'unfiltered';

        if (context.state.unfiltered.length) {
          context.commit('setShowing', type);
          context.commit('setCategory', false);
          return Promise.resolve(new Response(true));
        }

        // Get series
        return asyncGet('talks')
          .then((response) => {
            const { data, data: { series, remaining } } = response;
            context.dispatch('addSeries', series);
            context.commit('setSeries', { type, series });
            context.commit('setSeriesRemaining', { type, remaining });
            context.commit('setShowing', type);
            context.commit('setCategory', false);
            if (!context.state.page) context.commit('setPage', data);
            return response;
          });
      },

      getSeries(context, { type, selectors }) {
        return asyncGet('talks', selectors)
          .then((response) => {
            const { data: { series, remaining } } = response;
            context.dispatch('addSeries', series);
            context.commit('appendSeries', { type, series });
            context.commit('setSeriesRemaining', { type, remaining });
            return response;
          });
      },

      initTalk(context, { talk }) {
        const storedTalk = _.find(context.state.talks, ta => ta.name === talk);

        if (storedTalk) {
          context.commit('setTalk', storedTalk.id);
          return Promise.resolve(new Response(true));
        }

        return asyncGet(`talks/talk-entries/${talk}/`)
          .then((response) => {
            const { data: newTalk } = response;
            context.commit('addTalk', newTalk);
            context.commit('setTalk', newTalk.id);
            return response;
          });
      },
    },

    mutations: {
      setCategory(state, category) {
        state.category = category;
      },

      setPage(state, data) {
        state.page = _.pick(data, [
          'blurb',
          'categories',
          'desc',
          'generated',
          'id',
          'name',
          'simulacrum',
          'title',
        ]);
      },

      setSeries(state, { type, series }) {
        state[type] = series;
      },

      appendSeries(state, { type, series }) {
        state[type] = state[type].concat(series);
      },

      setSeriesRemaining(state, { type, remaining }) {
        state[`${type}Remaining`] = remaining;
      },

      setShowing(state, type) {
        state.showing = type;
      },

      addTalk(state, payload) {
        Vue.set(state.talks, payload.id, payload);
      },

      setTalk(state, id) {
        state.talk = id;
      },
    },
  };
}
