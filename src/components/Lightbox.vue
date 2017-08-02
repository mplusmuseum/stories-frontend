<template>
  <div class="lightbox">
    <button class="lightbox__close" @click="close"><img src="../assets/img/cross.svg" alt="Close"></button>
    <div class="lightbox__share">
      <share-bar v-if="share"
        class="sharebar--horizontal"
        :limit="0"
        :url="share.url"
        :title="share.title"></share-bar>
    </div>
    <div class="lightbox__inner">
      <div class="lightbox__content" @click="close">
        <img :src="image.src" :alt="$t(image.src)">
      </div>
      <div class="lightbox__footer">
        <div class="lightbox__caption fs-s" v-html="$t(image.caption)"></div>
      </div>
    </div>
  </div>
</template>

<script>
import { mapState } from 'vuex';
import ShareBar from './ShareBar.vue';

export default {
  created() {
    document.body.classList.add('modal-active');
    window.addEventListener('keydown', this.keyHandler);
  },
  destroyed() {
    document.body.classList.remove('modal-active');
    window.removeEventListener('keydown', this.keyHandler);
  },
  computed: {
    ...mapState('lightbox', [
      'share',
      'image',
    ]),
  },
  methods: {
    close() {
      this.$store.commit('lightbox/close');
    },
    keyHandler(e) {
      if (e.keyCode === 27) this.close();
    },
  },
  components: {
    ShareBar,
  },
};
</script>

<style lang="less">
  @import '../less/variables.less';

  @lightboxBackground: lighten(@black, 10%);

  .lightbox {
    position: fixed;
    z-index: 101;
    left: 0;
    top: 0;
    width: 100%;
    height: 100%;
    background-image: linear-gradient(to top, @lightboxBackground, fade(@lightboxBackground, 95%));
    color: @white;
    &__close, &__share {
      position: absolute;
      right: 0;
      padding: 1.5rem;
    }
    &__close {
      top: 0;
      height: 7rem;
      width: 7rem;
      border: none;
      background: none;
      img {
        width: 100%;
        height: 100%;
      }
    }
    &__share {
      bottom: 0;
      .sharebar {
        margin-bottom: 0;
      }
    }
    &__inner {
      width: 100%;
      height: 100%;
      display: flex;
      align-items: center;
      justify-content: center;
      flex-direction: column;
    }
    &__content {
      display: flex;
      align-items: center;
      justify-content: center;
      width: 100%;
      height: 100%;
      padding: 1rem;
      .mq-sm({
        padding: 3rem 3rem 1rem;
      });
      img {
        cursor: zoom-out;
        max-width: 100%;
        max-height: 100%;
        object-fit: contain;
        font-family: 'object-fit: contain;';
      }
    }
    &__footer {
      width: 100%;
      display: flex;
      justify-content: space-between;
      align-items: flex-end;
      padding: 1.5rem 7rem 1.5rem 1.5rem;
    }
    &__caption {
      flex-grow: 1;
    }
  }
</style>
