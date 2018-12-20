<template>
  <div class="button-block block">
    <a
    v-if="isExternalLink"
    class="button button--accent"
    :href="link"
    target="_blank"
    v-html="$t(content.text)"
    />

    <router-link
    v-else
    class="button button--accent"
    :to="link"
    v-html="$t(content.text)"
    />
  </div>
</template>

<script>
const isHttpLink = /^https?:\/\/[^\s/$.?#].[^\s]*$/;

export default {
  props: {
    content: {
      required: true,
    },
  },
  computed: {
    link() {
      return this.$t(this.content.link);
    },
    isExternalLink() {
      return isHttpLink.test(this.link);
    },
  },
};
</script>
