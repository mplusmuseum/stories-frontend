<template>
  <div class="infopanel infopanel--search shadow">

    <div class="infopanel__section">

      <form class="input-wrap input-wrap--inline fs-m" action="/" @submit.prevent="onSearch">

        <label v-if="!query.length"
        v-html="$tl('search.cta')"
        for="search"/>

        <input v-model="query"
        id="search"
        type="text"
        ref="search">

      </form>

    </div>

  </div>
</template>

<script>
export default {
  props: {
    active: {
      required: true,
    },
    prevent: {
      type: String,
      default: 'search',
    },
  },
  data() {
    return {
      query: '',
    };
  },
  mounted() {
    window.addEventListener('keydown', this.keyHandler);
    window.addEventListener('mousedown', this.clickHandler);
    this.$nextTick(() => {
      this.$refs.search.focus();
    });
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
    onSearch() {
      this.$router.push({
        name: 'search',
        query: { q: this.query },
      });
      this.close();
    },
    close() {
      this.$emit('update:active', false);
    },
  },
};
</script>

