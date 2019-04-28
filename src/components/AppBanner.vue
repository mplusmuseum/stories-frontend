<template>
  <div class="banner" :class="{ 'banner--hasContent' : $slots.default ? true : false }">
    
    <div class="banner__inner">

      <div class="banner__media banner__image"
      v-if="content.hero.type === 'image'">

        <img class="lazy"
        :src="media.loading"
        v-lazy="media"
        :alt="$t(content.hero.content.alt)"
        @click="$emit('clicked')">

      </div>

      <div class="banner__media banner__video" 
      v-else-if="content.hero.type === 'video'">

        <video :autoplay="true"
        :poster="media.poster.src"
        loop muted playsinline>

          <source v-for="source in media.sources"
          :key="source.type"
          :src="source.src"
          :type="`video/${source.type}`">
          Your browser doesn't support HTML5 videos.

        </video>

      </div>

      <div class="banner__content" v-if="$slots.default">

        <app-link class="banner__flex" v-if="link"
        :link="link">

          <div class="wrap wrap--wide">

            <div class="banner__box">

              <slot/>

            </div>

          </div>

        </app-link>

        <div class="banner__flex"
        v-else>

          <div class="wrap wrap--wide">

            <div class="banner__box">

              <slot/>

            </div>

          </div>

        </div>

        <div class="banner__tags" v-if="content.tags && content.tags.length">

          <tag-group class="fs-s fs-b-sm"
          :tagIds="content.tags"/>

        </div>

      </div>

    </div>

  </div>
</template>

<script>
import AppLink from './AppLink.vue';
import VideoFrame from './VideoFrame.vue';

export default {
  props: {
    content: {},
  },
  computed: {
    media() {
      return this.content.hero.type === 'image'
        ? {
          src: this.content.hero.content.src,
          loading: this.$placeholder.generate(this.content.hero.content.dim),
        }
        : this.content.hero.content;
    },
    link() {
      const type = typeof this.content.link;
      if (type === 'object') {
        // Append the language
        return this.$link(this.content.link);
      }
      if (type === 'string') return this.content.link;
      return false;
    },
  },
  components: {
    AppLink,
    VideoFrame,
  },
};
</script>
