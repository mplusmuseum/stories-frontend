<template>
  <div class="article-listing">

    <div class="article-listing__thumb" v-if="imgObj">

      <router-link :to="$link(content.link)"
      role="presentation"
      aria-hidden="true">

        <div class="article-listing__image">

          <img class="lazy"
          :src="imgObj.loading"
          v-lazy="imgObj"
          :alt="$t(content.alt)">
        
        </div>

      </router-link>

    </div>

    <div class="article-listing__info">

      <div class="section-label fs-s">
        <template v-if="showIssue !== false"><snippet-issue-number :number="content.issue.number"/>:&ensp;</template><span v-html="$t(content.theme.title)"></span>
      </div>

      <div class="article-listing__title">

        <router-link class="fs-m fs-l-sm" :to="$link(content.link)">

          <app-title
          wrap="h4"
          :title="content.title"/>

        </router-link>

      </div>

      <snippet-byline class="fs-s fs-b-sm hide--mobile"
      :snippet="`journal.${content.byline_type}`"
      :author="content.author"
      :authors="content.authors"
      :date="content.date"/>

      <tag-group class="fs-s fs-b-sm"
      :tagIds="content.tags"/>

    </div>

  </div>
</template>

<script>
import SnippetByline from './SnippetByline.vue';
import SnippetIssueNumber from './SnippetIssueNumber.vue';

export default {
  props: {
    content: {
      required: true,
    },
    styleFeatured: {
      default: true,
    },
    showIssue: {
      default: false,
    },
  },
  computed: {
    imgObj() {
      const { card } = this.content;
      return card ? {
        src: card.content.src,
        loading: this.$placeholder.generate(card.content.dim, 'loading', 'black', 'white'),
      } : false;
    },
  },
  components: {
    SnippetByline,
    SnippetIssueNumber,
  },
};
</script>

<style lang="less">
@import "../less/variables.less";

.article-listing {
  display: block;
  .mq-sm({
    display: flex;
    flex-direction: row;
  });
  img {
    width: 100%;
  }
  &__title {
    margin-bottom: 0.5em;
    a {
      color: @black;
      &:hover, &:focus {
        color: @accent;
      }
    }
  }
  &__info {
    width: 100%;
    .mq-sm({
      width: 100% / 3 * 2;
    });
  }
  &__thumb {
    float: left;
    .mq-sm({
      float: none;
    });
    width: 100% / 3;
    margin-bottom: 0;
    margin-right: 1em;
    img {
      display: block;
    }
  }
  .tags {
    margin-top: 0.5em;
  }
  &--featured {
    display: flex;
    flex-direction: column;
    .article-listing {
      &__info, &__thumb {
        width: 100%;
      }
      &__info {
        margin: 0.5em 0 0;
      }
      &__thumb {
        float: none;
        margin: 0;
      }
    }
  }
}
</style>
