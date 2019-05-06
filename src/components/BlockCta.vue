<template>
  <div class="button-block block" :class="alignmentClass">
    <component :is="isExternalLink ? 'a' : 'router-link'"
    class="button button--accent"
    v-bind="linkProps">
      <span v-html="$t(content.text)"/>

      <template v-if="content.icon === 'external-link'">
        <img
        class="external-icon"
        src="../assets/img/external.svg"
        :alt="$tl('accessibility.externalLink')">

        <img
        class="external-icon external-icon--hover"
        src="../assets/img/external-blue.svg"
        :alt="$tl('accessibility.externalLink')">
      </template>
    </component>
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
    &--hover {
      display: none;
    }
  }
  a:hover, a:focus {
    .external-icon {
      display: none;
      &--hover {
        display: inline;
      }
    }
  }
}
</style>

