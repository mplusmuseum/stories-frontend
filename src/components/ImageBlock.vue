<template>
  <div class="image-block block">
    <img :src="content[0].thumb" :alt="$t(content[0].alt)" @click="lightbox">
    <div v-if="caption"
    class="image-block__caption fs-s"
    v-html="$t(content[0].caption)"></div>
  </div>
</template>

<script>
export default {
  props: {
    content: {
      required: true,
    },
    caption: {
      default: true,
    },
    share: {
      default: false,
    },
  },
  methods: {
    lightbox() {
      this.$store.commit('lightbox/open', {
        image: this.content[0],
        share: this.share,
      });
    },
  },
};
</script>

<style lang="less">
@import '../less/variables.less';

.image-block {
  img {
    max-width: 100%;
    cursor: zoom-in;
    display: block;
    margin: 0 auto;
  }
  &__caption {
    margin: 1rem 0;
    color: @midgrey;
  }
}
</style>
