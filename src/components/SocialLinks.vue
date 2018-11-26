<template>
  <div class="social-links">

    <a v-for="platform of platforms"
    :key="platform.id"
    :href="platform.link"
    target="_blank"
    :aria-label="`${$tl('accessibility.externalLink')} ${$t(platform.title)}`"
    v-html="platform.svg"/>

    <slot/>

  </div>
</template>

<script>
export default {
  computed: {
    platforms() {
      return this.$store.getters['site/socialLinkables'];
    },
  },
};
</script>


