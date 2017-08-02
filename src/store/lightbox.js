export default function () {
  return {
    namespaced: true,

    state: {
      active: false,
      image: false,
      share: {},
    },

    mutations: {
      open(state, { image, share }) {
        state.active = true;
        state.image = image;
        state.share = share || false;
      },
      close(state) {
        state.active = false;
      },
    },
  };
}
