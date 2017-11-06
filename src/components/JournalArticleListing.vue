<template>
  <div class="article-listing">

    <div class="article-listing__thumb">

      <router-link :to="$link(content.link)">

        <img class="lazy"
        :src="$placeholder.generate(content.card.content.dim, 'loading', 'black', 'black')"
        v-lazy="{
          src: content.card.content.src,
          loading: $placeholder.generate(content.card.content.dim, 'loading', 'black', 'black'),
        }">

      </router-link>

    </div>

    <div class="article-listing__info">

      <div class="section-label fs-s">
        <template v-if="showIssue !== false"><snippet-issue-number :number="content.issue.number"/>:&ensp;</template><span v-html="$t(content.theme.title)"></span>
      </div>

      <div class="article-listing__title">

        <router-link class="fs-m fs-l-sm" :to="$link(content.link)">

          <app-title
          wrap="span"
          :title="content.title"/>

        </router-link>

      </div>

      <snippet-byline class="fs-s fs-b-sm hide--mobile"
      :snippet="$store.state.translations.journal.byline"
      :author="content.author"
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
      margin-left: 0.5em;
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
    margin-right: 0.5em;
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