<template>
  <article class="blog-item blog-post shadow"
  :class="{ 'blog-post--truncated': post.truncated }">
    <div class="blog-post__pinned"
    v-if="post.pinned && !$store.getters['blog/filtered']">
      <img src="../assets/img/pin.svg" alt="Pin Icon"> {{ $t(t.blog.pinned) }}
    </div>

    <blog-post-header :post="post" :share="shareData"></blog-post-header>

    <div class="blog-item__inner">
      <div class="blog-post__content row">

        <div class="blog-post__aside col-md-3">
          <share-bar class="blog-post__sharebar hide--mobile"
          :url="shareData.url"
          :title="shareData.title"></share-bar>
        </div>

        <div class="blog-post__body fs-b col-md-9">
          <content-blocks :items="sections" :share="shareData"></content-blocks>
          <button class="blog-post__more button button--accent"
          v-if="post.truncated && post.sections.truncateAfter"
          @click="extend">{{ $t(t.site.continue) }}</button>

          <div class="blog-post__footer" v-if="showFooterContent">

            <share-bar class="blog-post__sharebar hide--desktop"
            :url="shareData.url"
            :title="shareData.title"></share-bar>

            <clipboard class="blog-post__footer-section"
            :url="shareData.url"></clipboard>

            <newsletter-block class="blog-post__footer-section input-wrap--inline"
            :label="$t($store.state.site.translations.newsletter.placeholderAlt)"
            :name="`newsletter__${post.name}`"
            :button="'&rarr;<span class=\'sr-only\'>Subscribe to the M+ Stories Newsletter</span>'"></newsletter-block>

          </div>
        </div>
      </div>
    </div>

    <suggested class="blog-post__suggested"
    v-if="showFooterContent && post.related"
    :items="post.related.items"></suggested>

  </article>
</template>

<script>
import { mapState } from 'vuex';
import BlogPostHeader from './BlogPostHeader.vue';
import Clipboard from './Clipboard.vue';
import ContentBlocks from './ContentBlocks.vue';
import NewsletterBlock from './NewsletterBlock.vue';
import ShareBar from './ShareBar.vue';
import Suggested from './Suggested.vue';

export default {
  data() {
    return {
      busy: false,
    };
  },
  props: {
    post: {
      type: Object,
    },
  },
  computed: {
    ...mapState({
      t: s => s.site.translations,
      lang: s => s.lang,
      url: s => s.site.url,
    }),
    sections() {
      if (this.post.sections) {
        if (this.post.truncated && this.post.sections.truncateAfter) {
          return this.post.sections.list.slice(0, this.post.sections.truncateAfter);
        }
        return this.post.sections.list;
      }
      return [];
    },
    shareData() {
      return {
        url: `${this.url}/${this.lang}/blog/${this.post.name}`,
        title: this.$t(this.post.title),
      };
    },
    showFooterContent() {
      return !this.post.truncated;
    },
  },
  methods: {
    extend() {
      this.$store.commit('blog/extendPost', this.post);
    },
  },
  components: {
    BlogPostHeader,
    Clipboard,
    ContentBlocks,
    NewsletterBlock,
    ShareBar,
    Suggested,
  },
};
</script>

<style lang="less">
@import "../less/variables.less";

.blog-post {
  z-index: 1;
  img {
    max-width: 100%;
  }
  .clipboard {
    margin-top: 2em;
  }
  &__content {
    .mq-sm({
      display: flex;
    });
  }
  &__aside {
    transform: translate3d(0, 0, 0); // Fix for Chrome on Retina rendering bug;
  }
  &__header {
    background: @white;
  }
  &__hero {
    img {
      height: 250px;
      .mq-sm({
        height: 600px;
      });
      width: 100%;
      display: block;
      object-fit: cover;
      font-family: 'object-fit: cover;';
    }
  }
  &__more {
    margin-top: 1.5rem;
    .mq-sm({
      margin-top: 3rem;
    });
  }
  &__pinned {
    font-weight: @fontBold;
    text-align: center;
    padding: 1rem;
    background: @accent;
    color: @white;
    line-height: 1;
    img {
      display: inline-block;
      vertical-align: top;
      height: 1em;
    }
  }
  &__title {
    margin-bottom: 1rem;
    padding: 1.5rem 1.5rem 0;
    .mq-sm({
      padding: 3rem 3rem 0;
    });
  }
  &__meta {
    padding-left: 1.5rem;
    padding-right: 1.5rem;
    .mq-sm({
      padding-left: 3rem;
      padding-right: 3rem;
    })
  }
  &__footer-section {
    margin: 3rem 0;
    &:last-child {
      margin-bottom: 0;
    }
  }
  &__sharebar {
    position: static;
    .mq-sm({
      top: 7rem;
      left: 0;
      position: sticky;
    });
    .ieOnly({
      top: 0 !important;
    });
    .edgeOnly({
      top: 0 !important;
    });
  }
  &__toggle {
    position: relative;
  }
}
</style>
