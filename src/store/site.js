export default function () {
  return {
    namespaced: true,
    state: {
      authors: {},
      desc: {},
      initialized: false,
      links: {},
      notfound: {},
      sections: {},
      simulacrum: '',
      social: [],
      title: {},
      url: '',
    },
    getters: {
      socialShareables(state) {
        return state.social.filter(platform => platform.share);
      },
      socialLinkables(state, getters, rootState) {
        const { lang } = rootState;
        return state.social.reduce((platforms, platform) => {
          if (platform.links[lang]) {
            const plat = { ...platform, link: platform.links[lang] };
            platforms.push(plat);
          }
          return platforms;
        }, []);
      },
    },
    actions: {
    },
    mutations: {
      init(state, data) {
        state.authors = data.authors;
        state.desc = data.desc;
        state.initialized = true;
        state.links = data.links;
        state.notfound = data.notfound;
        state.sections = data.sections;
        state.simulacrum = data.simulacrum;
        state.social = data.social;
        state.title = data.title;
        state.url = data.baseURL;
      },
    },
  };
}
