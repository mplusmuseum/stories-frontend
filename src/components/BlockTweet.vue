<script>
import addScript from '../util/promise-script';

export default {
  data() {
    return {
      isTweetLoaded: false,
    };
  },
  props: {
    content: {
      type: Object,
      required: true,
    },
  },
  mounted() {
    const scriptLoaded = !window.twttr
      ? addScript('//platform.twitter.com/widgets.js')
      : Promise.resolve();

    scriptLoaded.then(() => {
      window.twttr.widgets.createTweetEmbed(
        this.$t(this.content.media),
        this.$refs.media, this.options,
      );
      this.isTweetLoaded = true;
    });
  },
  render(h) {
    const inner = h('div', { ref: 'media' }, this.isTweetLoaded ? undefined : this.$slots.default);
    const caption = this.$t(this.content.caption)
      ? h('div', {
        class: 'tweet-block__caption fs-s',
        domProps: { innerHTML: this.$t(this.content.caption) },
      }) : null;
    return h('div', { class: 'tweet-block block' }, [inner, caption]);
  },
};
</script>

<style lang="less">
@import '../less/variables.less';

.tweet-block {
  .twitter-tweet {
    margin-left: auto;
    margin-right: auto;
  }
  &__caption {   
    margin: 1rem auto;
    max-width: 500px;
    color: @midgrey;
  }
}
</style>
