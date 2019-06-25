<template>
  <div class="sharebar">

    <transition-group class="sharebar__items"
    name="resize"
    tag="div">

      <a v-for="(item) of items"
      class="sharebar__block"
      @click="share(item.share, item.title, $event)"
      :key="item.id"
      :href="item.share | shareLink(data)">

        <div class="sharebar__block-inner">

          <div class="sharebar__block-background"
          :style="{ 'background-color': item.colour }"></div>

          <img :src="item.icon"
          :alt="$t(item.title) | shareText(shareSnippet)">

        </div>

      </a>

    </transition-group>

    <button v-if="$store.state.site.social.length > limit"
      class="sharebar__block"
      @click="toggle">

      <div class="sharebar__block-inner">

        <div class="sharebar__block-background"></div>

        <img v-if="expanded"
        src="../assets/img/minus.svg"
        :alt="$tl('accessibility.shareLess')">

        <img v-else
        src="../assets/img/plus.svg"
        :alt="$tl('accessibility.shareMore')">

      </div>

    </button>

  </div>
</template>

<script>
import { decode } from 'he';

function prepareComponent(component) {
  const unescaped = decode(component);
  const encoded = encodeURIComponent(unescaped);
  return encoded;
}

function prepareURI(url, { location, title }) {
  url = url.replace('{location}', prepareComponent(location));
  url = url.replace('{title}', prepareComponent(title));
  return url;
}

export default {
  props: {
    data: {
      required: true,
    },
    limit: {
      default: 3,
    },
  },
  data() {
    return {
      expanded: false,
      isMobile: false,
    };
  },
  filters: {
    shareLink(val, data) {
      return prepareURI(val, data);
    },
    shareText(val, snippet) {
      return snippet.map((segment) => {
        if (segment.type === 'fn' && segment.fn === 'platform') return val;
        if (segment.type === 'str') return segment.str;
        return '';
      }).join('');
    },
  },
  methods: {
    toggle() {
      this.expanded = !this.expanded;
    },
    share(shareURI, platform, e) {
      if (shareURI.startsWith('http')) {
        e.preventDefault();
        let top = 100;
        let left = 100;
        if (window.screen) {
          top = Math.round(window.screen.height / 3);
          left = Math.round((window.screen.width / 2) - 275);
        }
        shareURI = prepareURI(shareURI, {
          location: this.data.location,
          title: this.data.title,
        });
        window.open(shareURI, 'Share', `scrollbars=yes,resizable=yes,toolbar=no,location=0,width=550,height=420,top=${top},left=${left}`);
      } else if (shareURI.startsWith('qr://')) {
        e.preventDefault();
        this.$store.commit('lightbox/updateQR', this.data.location);
      }
      this.$gtm.trackEvent({
        category: this.$t(platform),
        action: 'Share',
        label: this.data.title,
      });
    },
  },
  mounted() {
    this.isMobile = (typeof navigator !== 'undefined' && /Mobi|UCBrowser/i.test(navigator.userAgent));
  },
  computed: {
    allItems() {
      return this.$store.getters['site/socialShareables'];
    },
    mobileItems() {
      return this.allItems.filter(item => !item.hide.mobile);
    },
    desktopItems() {
      return this.allItems.filter(item => !item.hide.desktop);
    },
    items() {
      const items = this.isMobile ? this.mobileItems : this.desktopItems;
      return this.expanded ? items : items.slice(0, this.limit);
    },
    shareSnippet() {
      return this.$tl('accessibility.shareVia');
    },
  },
};
</script>

<style lang="less">
@import '../less/variables.less';

@blockSizeSmall: 3.5rem;
@blockSize: 4rem;

.resize-enter-active, .resize-leave-active {
  transition: all .25s ease;
}

.sharebar__block.resize-enter, .sharebar__block.resize-leave-active {
  width: 0;
  height: @blockSizeSmall;
  .mq-sm({
    width: @blockSize;
    height: 0;
  });
}

.sharebar {
  display: flex;
  flex-direction: row;
  flex-wrap: wrap;
  margin: 1.5em 0;
  .mq-sm({
    margin: 0;
    flex-direction: column;
  });
  &__items {
    display: flex;
    flex-direction: row;
    flex-wrap: wrap;
    .mq-sm({
      flex-direction: column;
    });
  }
  &__block {
    width: @blockSizeSmall;
    height: @blockSizeSmall;
    line-height: @blockSizeSmall;
    .mq-sm({
      width: @blockSize;
      height: @blockSize;
      line-height: @blockSize;
    });
    background: none;
    overflow: hidden;
    padding: 0;
    border: none;
    display: inline-block;
    vertical-align: top;
    background-color: @accent;
    color: @white;
    text-align: center;
    box-shadow: @shadowStyleSmall;
    cursor: pointer;
    img {
      width: 100%;
      height: 100%;
      position: relative;
      z-index: 2;
    }
    &:hover, &:focus {
      .sharebar__block-background {
        opacity: 1;
      }
    }
  }
  &__block-inner {
    height: @blockSizeSmall;
    width: @blockSizeSmall;
    padding: @blockSizeSmall * 0.15;
    .mq-sm({
      height: @blockSize;
      width: @blockSize;
      padding: @blockSize * 0.15;
    });
    position: relative;
  }
  &__block-background {
    opacity: 0;
    position: absolute;
    top: 0;
    left: 0;
    background: @midgrey;
    width: 100%;
    height: 100%;
    z-index: 1;
  }
  &--horizontal {
    flex-direction: row;
    .sharebar__items {
      flex-direction: row;
    }
    .sharebar__block.resize-enter, .sharebar__block.resize-leave-active {
      width: 0;
      height: @blockSizeSmall;
      .mq-sm({
        height: @blockSize;
      });
    }
  }
  &--reverse {
    .sharebar__items {
      flex-direction: row-reverse;
    }
  }
}
</style>
