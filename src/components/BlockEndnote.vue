<template>
  <div class="endnote-block block">

    <component class="endnote-block__content fs-s" :is="rendered"/>

  </div>
</template>


<script>
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
  methods: {
    createElement(el) {
      if (el.type === 'str') {
        return el.str;
      } else if (el.type === 'fn' && el.fn === 'author') {
        return this.renderAuthor();
      }
      return false;
    },
    renderAuthor() {
      const author = this.$store.state.site.authors[this.content.author];
      const title = this.$t(author.title);
      return `<router-link :to="{ name: 'search', query: { q: '${title}' } }">${title}</router-link>`;
    },
  },
  computed: {
    rendered() {
      const { lang } = this.$store.state;
      const elems = this.content.dynamic[lang]
        .map(match => this.createElement(match));
      const content = elems.join('');
      return {
        template: `<div>${content}</div>`,
      };
    },
  },
};
</script>

<style lang="less">
@import "../less/variables.less";

.endnote-block {
  clear: both;
  &__content {
    border: 1px solid @accent;
    padding: 1em;
  }
}
</style>
