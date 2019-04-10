<template>
  <div class="talks-series-desc">

    <transition name="fade" mode="out-in">

      <a v-if="!visible"
      href="#"
      class="talks-series-desc__open hide--mobile"
      @click.prevent="open()">
        <span v-html="$t($store.state.translations.talks.about)"></span>
      </a>

    </transition>

    <div v-if="visible"
    class="talks-series-desc__text">
      <block-text :content="content"/>
      
      <div class="talks-series-desc__close-wrap hide--mobile">
        <a href="#"
        class="talks-series-desc__close"
        @click.prevent="close()">
          <span v-html="$t($store.state.translations.talks.close)"></span>
        </a>
      </div>
    </div>

    <a href="#"
    class="talks-series-desc__toggle fs-m hide--desktop"
    @click.prevent="toggle()">
      <span v-html="toggleText"></span>
    </a>

  </div>
</template>

<script>
export default {
  data() {
    return {
      visible: false,
    };
  },
  props: {
    content: {
      required: true,
      type: Object,
    },
  },
  computed: {
    toggleText() {
      return this.visible
        ? this.$t(this.$store.state.translations.talks.close)
        : this.$t(this.$store.state.translations.talks.about);
    },
  },
  methods: {
    close() {
      this.visible = false;
    },
    open() {
      this.visible = true;
    },
    toggle() {
      this.visible = !this.visible;
    },
  },
};
</script>

<style lang="less">
@import "../less/variables.less";

.talks-series-desc {
  position: relative;
  &__text {
    padding-top: 1em;
  }
  &__open {
    .mq-sm({
      position: absolute;
      top: -2.5rem;
      right: 0;
      left: auto;
    });
  }
  &__toggle {
    span {
      font-size: 70%;
    }
  }
  &__close-wrap {
    .mq-sm({
      text-align: right;
    });
  }
}
</style>
