export default function () {
  return {
    namespaced: true,

    state: {
      notice: false,
      blurredContent: false,
    },

    getters: {

    },

    actions: {

    },

    mutations: {
      updateNotice(state, notice) {
        state.notice = notice;
      },
      clearNotice(state) {
        state.notice = false;
      },
      updateBlurredContent(s, blurred) {
        s.blurredContent = blurred;
      },
    },

  };
}
