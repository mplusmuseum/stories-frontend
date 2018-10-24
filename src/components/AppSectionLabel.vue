<template>
  <div class="section-label fs-s">

    <span v-html="text"></span>

    <template v-if="type === 'exhibition'">

      <img v-if="same !== false"
      class="external-icon"
      src="../assets/img/external.svg"
      :alt="$tl('accessibility.externalLink')">

      <img v-else
      class="external-icon"
      src="../assets/img/external-blue.svg"
      :alt="$tl('accessibility.externalLink')">

    </template>

  </div>
</template>

<script>
export default {
  props: {
    type: {
      required: true,
    },
    same: {
      default: false,
    },
  },
  computed: {
    text() {
      return typeof this.type === 'object'
        ? this.type.fn(this.type.data)
        : this.$tl(`content.${this.type}`).one;
    },
  },
};
</script>

<style>
.external-icon {
  height: 1em;
  margin-left: 0.125em;
}
</style>
