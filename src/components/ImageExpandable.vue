<template>
  <div class="image-expandable" @click="openLightbox(post.images[0])">
    <img :src="post.images[0].src" :alt="$t(post.images[0].alt)">
  </div>
</template>

<script>
export default {
  methods: {
    openLightbox(image) {
      this.$store.commit('lightbox/open', {
        image,
        share: this.share,
      });
    },
  },
  props: {
    share: {
      default: false,
    },
  },
};
</script>
