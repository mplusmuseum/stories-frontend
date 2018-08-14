<template>
  <article class="blog-item blog-post"
  :class="{ 'blog-post--truncated': post.truncated }">

    <app-panel>

      <template slot="content">

        <div class="pinned" v-if="post.pinned && post.media && showing === 'unfiltered'">

          <img src="../assets/img/pin.svg" alt="">&nbsp;<span v-html="$tl('blog.pinned')"></span>

        </div>

        <blog-post-hero :post="post"
        :key="`hero-${post.id}`"/>

        <div class="panel__inner">
        
          <div class="blog-post__header">

            <app-title-link class="blog-post__title fs-l"
            :wrap="routeName === 'post' ? 'h1' : 'h2'"
            :title="post.title"/>

            <div class="blog-post__meta">

              <snippet-byline
              :snippet="snippet"
              :author="post.author"
              :categories="post.categories"
              :date="post.date"/>

              <tag-group class="fs-s fs-b-sm"
              v-if="post.tags.length"
              :tagIds="post.tags"/>

            </div>

          </div>

          <div class="blog-post__content row">

            <div class="blog-post__aside col-sm-2">

              <share-bar class="blog-post__sharebar hide--mobile"
              :data="shareData"/>

            </div>

            <div class="blog-post__body fs-b col-sm-10">

              <content-blocks :items="content"/>

              <button class="blog-post__more button button--accent"
              v-if="routeName === 'blog' && post.content.truncateAfter && post.truncated"
              ref="more"
              @click="extend"
              v-html="$tl('site.continue')"/>

              <div class="blog-post__footer" v-if="!post.truncated">

                <share-bar class="blog-post__sharebar hide--desktop"
                :data="shareData"/>

                <app-clipboard class="blog-post__footer-section"
                :url="shareData.location"/>

                <app-newsletter class="blog-post__footer-section input-wrap--inline"
                :label="$tl('newsletter.placeholderAlt')"
                button="&rarr;"
                :identifier="`${post.name}-newsletter`"/>

                <button class="blog-post__more button button--invert"
                v-if="routeName === 'blog' && post.content.truncateAfter"
                ref="less"
                @click="collapse"
                v-html="$tl('blog.close')"/>

              </div>

            </div>

          </div>

        </div>

        <app-suggested class="blog-post__suggested"
        v-if="!post.truncated && post.related"
        :id="post.id"
        :key="`suggested-${post.id}`"/>

      </template>
    
    </app-panel>

  </article>
</template>

<script>
import { mapState } from 'vuex';
import AppClipboard from './AppClipboard.vue';
import AppNewsletter from './AppNewsletter.vue';
import AppSuggested from './AppSuggested.vue';
import BlogPostHero from './BlogPostHero.vue';
import ContentBlocks from './ContentBlocks.vue';
import ShareBar from './ShareBar.vue';
import SnippetByline from './SnippetByline.vue';

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
      lang: s => s.lang,
      routeName: s => s.route.name,
      showing: s => s.blog.showing,
      url: s => s.site.url,
    }),
    content() {
      if (this.post.content) {
        if (this.post.truncated && this.post.content.truncateAfter) {
          return this.post.content.list.slice(0, this.post.content.truncateAfter);
        }
        return this.post.content.list;
      }
      return [];
    },
    shareData() {
      const base = this.$store.getters.baseURL;
      const { post: { name, sharetext, title } } = this;
      const text = sharetext || title;
      return {
        location: `${base}/blog/${name}`,
        title: this.$t(text),
      };
    },
    snippet() {
      // If we have categories, return the byline snippet
      if (this.post.categories && this.post.categories.length) return 'blog.byline';
      // Otherwise we return a custom snippet just for the date
      const dateElem = { fn: 'date', type: 'fn' };
      return {
        en: [dateElem, { str: '.', type: 'str' }],
        tc: [dateElem, { str: '。', type: 'str' }],
      };
    },
  },
  methods: {
    extend() {
      this.$store.commit('blog/extendPost', this.post);
      this.$triggerNative();
      this.$ga.event({
        eventCategory: 'Blog Post',
        eventAction: 'Expand',
        eventLabel: this.post.title[this.lang],
      });
    },
    collapse() {
      const offset = this.$refs.less.getBoundingClientRect().top;
      this.$store.commit('blog/collapsePost', this.post);
      this.$nextTick(() => {
        const { top } = this.$refs.more.getBoundingClientRect();
        const scrollTop = window.pageYOffset || document.documentElement.scrollTop;
        const newPosition = (top + scrollTop) - offset;
        window.scrollTo(0, newPosition);
        this.$triggerNative();
      });
      this.$ga.event({
        eventCategory: 'Blog Post',
        eventAction: 'Collapse',
        eventLabel: this.post.title[this.lang],
      });
    },
  },
  components: {
    AppSuggested,
    AppNewsletter,
    AppClipboard,
    BlogPostHero,
    ContentBlocks,
    ShareBar,
    SnippetByline,
  },
};
</script>

<style lang="less">
@import "../less/variables.less";

.blog-post {
  position: relative;
  z-index: 1;
  img {
    max-width: 100%;
  }
  .panel {
    overflow: inherit;
  }
  .clipboard {
    margin-top: 3rem;
    margin-bottom: 3rem;
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
  &__header {
    margin-bottom: 1.5em;
  }
  &__hero {
    &.image-block {
      position: relative;
      padding-top: 62.5%;
      img {
        position: absolute;
        top: 0;
        height: 100%;
        width: 100%;
        display: block;
        object-fit: cover;
        font-family: 'object-fit: cover;';
      }
    }
  }
  &__more {
    margin-top: 1em;
    display: block;
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
      top: 3.5em;
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
  &__content .block, &__footer {
    max-width: @widthSmall;
  }
}
</style>
