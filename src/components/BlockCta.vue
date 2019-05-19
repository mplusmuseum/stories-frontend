<template>
  <div class="button-block block" :class="alignmentClass">
    <component :is="isExternalLink ? 'a' : 'router-link'"
    class="button button--accent"
    v-bind="linkProps">
      <span v-html="$t(content.text)"/>

      <ExternalIcon
      v-if="content.icon === 'external-link'"
      class="external-icon" />
    </component>
  </div>
</template>

<script>
import ExternalIcon from './icons/External.vue';

const isHttpLink = /^https?:\/\/[^\s/$.?#].[^\s]*$/;

export default {
  components: {
    ExternalIcon,
  },
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
    linkProps() {
      return this.isExternalLink ? {
        href: this.link,
        target: '_blank',
      } : {
        to: this.link,
      };
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
  .external-icon {
    height: 1em;
    margin-left: 0.125em;
  }
}
</style>

