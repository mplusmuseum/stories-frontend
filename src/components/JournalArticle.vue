<template>
  <article class="article shadow--dark footnotes"
  :class="modifiers">

    <app-banner v-if="article.hero"
    :content="{ hero: article.hero }"
    @clicked="lightbox"/>
    
    <div class="article__content">

      <journal-article-header class="wrap"
      :article="article"
      :share-data="shareData"/>

      <div class="article__body cf"
      v-if="article.content">

        <content-blocks :items="article.content.list"/>

      </div>

      <lazy-component class="article__trigger" @show="onTrigger(article.id)"/>

      <div class="article__footer wrap">

        <share-bar class="sharebar--horizontal"
        :data="shareData"/>


      </div>

    </div>

  </article>
</template>

<script>
import ContentBlocks from '../components/ContentBlocks.vue';
import JournalArticleHeader from '../components/JournalArticleHeader.vue';
import ShareBar from '../components/ShareBar.vue';
import { footnoteMixin } from '../util/mixins';

export default {
  mixins: [footnoteMixin('article')],
  props: {
    article: {
      required: true,
    },
  },
  computed: {
    shareData() {
      const base = this.$store.getters.baseURL;
      const {
        article: {
          title,
          sharetext,
          name: article,
          issue: {
            name: issue,
          },
        },
      } = this;
      const location = `${base}/podium/${issue}/${article}/`;
      const text = sharetext || title;
      return {
        location,
        title: this.$t(text),
      };
    },
  },
  methods: {
    lightbox() {
      this.$store.commit('lightbox/open', {
        image: this.article.hero.content,
      });
    },
    onTrigger(payload) {
      this.$emit('triggered', payload);
    },
  },
  components: {
    ContentBlocks,
    JournalArticleHeader,
    ShareBar,
  },
};
</script>

<style lang="less">
@import "../less/variables.less";

.article {
  background: @lightgrey;
  &:first-of-type {
    box-shadow: none;
  }
  &__content {
    padding-top: 3em;
    padding-bottom: 3em;
  }
  &__header {
    margin-bottom: 2em;
  }
  &__body {
    margin: 0 auto;
    max-width: @widthSmall * 1.5;
    .block {
      margin-left: auto;
      margin-right: auto;
      // margin-bottom: 1em;
      padding-left: 1em;
      padding-right: 1em;
      max-width: @widthSmall;
      &.quotation-block {
        text-align: center;
        &:first-child {
          margin-top: 0;
        }
      }
      &--default {
        clear: both;
      }
      &--wide {
        max-width: 100%;
        clear: both;
      }
      &--left {
        float: left;
        clear: left;
        width: 50%;
        margin: 0;
        .mq-sm-under({
          padding-right: 0.5em;
        });
      }
      &--right {
        float: right;
        clear: right;
        width: 50%;
        margin: 0;
        .mq-sm-under({
          padding-left: 0.5em;
        });
      }
    }
    .block--left + .block--left,
    .block--right + .block--right {
      margin-top: 1em;
    }
    .block--left + .block--right + .text-block,
    .block--left + .block--right + .endnote-block {
      clear: both;
    }
  }
  &__footer {
    margin-top: 2em;
  }
  &__suggested {
    background: @lightgrey;
  }
  &__endnote {
    border: 2px solid @accent;
    padding: 1em;
    margin-top: 2em;
    margin-bottom: 2em;
  }
  &__progress {
    background: @lightgrey;
    height: 2px;
    width: 100%;
    >div {
      width: 33.333%;
      height: 100%;
      background: @accent;
    }
  }
  .banner {
    cursor: zoom-in;
  }
}
</style>
