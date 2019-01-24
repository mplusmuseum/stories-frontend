<template>
  <div class="article__header">

    <div class="heading">

      <router-link class="article__issue fs-b"
      tag="h3"
      :to="issueLink">
        <a>
          <span v-html="sectionTitle"/>&nbsp;<snippet-issue-number :number="article.issue.number"/>: <span v-html="this.$t(this.article.issue.title)"/>
        </a>

      </router-link>

    </div>

    <div class="heading">

      <app-title-link class="article__title fs-l"
      :wrap="'h1'"
      :title="article.title"/>

    </div>

    <div class="heading">

      <snippet-byline
      :snippet="`journal.${article.byline_type}`"
      :author="article.author"
      :authors="article.authors"
      :date="article.date"/>

    </div>

    <div class="heading">

      <tag-group class="fs-s fs-b-sm"
      :tagIds="article.tags"/>

    </div>

    <div class="heading">

      <share-bar class="sharebar--horizontal"
      :data="shareData"/>

    </div>

  </div>
</template>

<script>
import ShareBar from '../components/ShareBar.vue';
import SnippetByline from './SnippetByline.vue';
import SnippetIssueNumber from './SnippetIssueNumber.vue';

export default {
  props: {
    article: {
      type: Object,
      required: true,
    },
    shareData: {
      required: true,
    },
  },
  computed: {
    sectionTitle() {
      return this.$t(this.$store.state.site.sections.journal);
    },
    issueLink() {
      return {
        name: 'issue',
        params: {
          lang: this.$store.state.lang,
          issue: this.article.issue.name,
        },
      };
    },
  },
  components: {
    ShareBar,
    SnippetByline,
    SnippetIssueNumber,
  },
};
</script>
