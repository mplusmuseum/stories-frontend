<template>
  <div class="brightcove-video block">

    <div v-if="alt"
    class="brightcove-video__alt sr-only"
    v-text="alt"></div>

    <component class="brightcove-video__wrap"
    :is="componentType"
    v-if="validated"
    :key="$t(content.media.id)"
    @show="onLazyload">

      <!-- <video class="video-js brightcove-video__media"
      v-if="loaded"
      ref="media"
      :data-video-id="$t(content.media.id)"
      :data-account="content.media.account"
      :data-player="content.media.player"
      data-embed="default"
      data-application-id
      controls></video> -->

      <video class="video-js brightcove-video__media"
      ref="media"
      data-embed="default"
      controls></video>

    </component>

    <div v-if="caption"
    class="image-block__caption fs-s"
    v-html="caption"></div>

  </div>
</template>


<script>
import addScript from '../util/promise-script';

export default {
  data() {
    return {
      loaded: false,
      validated: false,
      player: null,
    };
  },
  props: {
    lazy: {
      default: true,
      type: Boolean,
    },
    content: {
      required: true,
      type: Object,
    },
  },
  methods: {
    loadScript() {
      if (this.validated) {
        const scriptLoaded = !window.videojs || !window.bc
          ? addScript(`//players.brightcove.net/${this.content.media.account}/${this.content.media.player}_default/index.min.js`)
          : Promise.resolve();

        scriptLoaded.then(() => {
          this.loaded = true;
          this.$nextTick(() => {
            const { media } = this.$refs;
            media.setAttribute('data-account', this.content.media.account);
            media.setAttribute('data-player', this.content.media.player);
            media.setAttribute('data-video-id', this.$t(this.content.media.id));
            window.bc(media);
            this.player = window.videojs(media);
          });
        });
      }
    },
    onLazyload() {
      this.loadScript();
    },
  },
  created() {
    this.validated = Object.prototype.hasOwnProperty.call(this.content.media, 'id')
      && Object.prototype.hasOwnProperty.call(this.content.media, 'account')
      && Object.prototype.hasOwnProperty.call(this.content.media, 'player');
  },
  mounted() {
    if (!this.lazy && this.validated) {
      this.loadScript();
    }
  },
  destroyed() {
    if (this.player) {
      this.player.dispose();
    }
  },
  computed: {
    componentType() {
      return this.lazy ? 'lazy-component' : 'div';
    },
    caption() {
      if (!this.content.caption) return false;
      return this.$t(this.content.caption) || false;
    },
    alt() {
      if (!this.content.alt) return false;
      return this.$t(this.content.alt) || false;
    },
  },
};
</script>

<style lang="less">
.brightcove-video {
  &__wrap {
    position: relative;
    padding-bottom: 56.25%;
  }
  &__media {
    position: absolute;
    top: 0;
    left: 0;
    height: 100%;
    width: 100%;
  }
}
</style>