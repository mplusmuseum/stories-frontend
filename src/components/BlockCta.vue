<template>
  <div class="button-block block" :class="alignmentClass">
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
    index: {
      type: Number,
      required: false,
    },
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
    alignmentClass() {
      return this.content.align
        ? `button-block--align-${this.content.align}`
        : null;
    },
  },
};
</script>

<style lang="less">
.button-block {
  &--align-left {
    text-align: left;
  }
  &--align-center {
    text-align: center;
  }
  &--align-right {
    text-align: right;
  }
}
</style>

