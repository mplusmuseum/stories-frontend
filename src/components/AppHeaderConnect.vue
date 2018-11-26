<template>
  <div class="infopanel infopanel--connect shadow">

    <div class="infopanel__section">

      <h6 class="infopanel__header"
      v-html="$tl('site.connect')"></h6>

      <social-links class="fs-s"/>

    </div>

    <hr>

    <div class="infopanel__section">

      <h6 class="infopanel__header"
      v-html="$tl('newsletter.placeholderAlt')"></h6>

      <app-newsletter class="input-wrap--inline"
      :label="$tl('newsletter.placeholder')"
      button="&rarr;"
      identifier="connect-newsletter"/>

    </div>

  </div>
</template>

<script>
import AppNewsletter from './AppNewsletter.vue';
import SocialLinks from './SocialLinks.vue';

export default {
  props: {
    active: {
      required: true,
    },
    prevent: {
      type: String,
      default: 'connect',
    },
  },
  mounted() {
    window.addEventListener('keydown', this.keyHandler);
    window.addEventListener('mousedown', this.clickHandler);
  },
  destroyed() {
    window.removeEventListener('keydown', this.keyHandler);
    window.removeEventListener('mousedown', this.clickHandler);
  },
  methods: {
    keyHandler(e) {
      if (e.keyCode === 27) this.close();
    },
    clickHandler(e) {
      if (e.target.dataset.prevent !== this.prevent
      && e.target !== this.$el
      && !this.$el.contains(e.target)) {
        this.close();
      }
    },
    close() {
      this.$emit('update:active', false);
    },
  },
  computed: {
    socialPlatforms() {
      return this.$store.getters['site/socialLinkables'];
    },
  },
  components: {
    AppNewsletter,
    SocialLinks,
  },
};
</script>
