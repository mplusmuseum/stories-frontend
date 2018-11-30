<template>
  <div class="instagram-block block">

    <blockquote class="instagram-media"
    v-if="isPostLoaded"
    data-instgrm-captioned
    data-instgrm-version="7">

      <a :href="url"></a>

    </blockquote>

  </div>
</template>

<script>
import addScript from '../util/promise-script';

export default {
  data() {
    return {
      isPostLoaded: false,
    };
  },
  props: {
    content: {
      type: Object,
      required: true,
    },
  },
  computed: {
    url() {
      return `https://www.instagram.com/p/${this.$t(this.content)}/`;
    },
  },
  mounted() {
    const scriptLoaded = !window.instgrm
      ? addScript('//platform.instagram.com/en_US/embeds.js')
      : Promise.resolve();

    scriptLoaded.then(() => {
      this.isPostLoaded = true;
      this.$nextTick().then(() => {
        window.instgrm.Embeds.process();
      });
    });
  },
};
</script>

<style lang="less">
  .instagram-block {
    iframe {
      width: 100%;
    }
  }
</style>
