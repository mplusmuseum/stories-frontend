<template>
  <app-banner class="article-featured" :content="content">

    <div class="pinned">

      <img src="../assets/img/pin.svg" alt="">&nbsp;<span v-html="$tl('journal.pinned')"></span>

    </div>

    <div class="section-label fs-s">
      <template v-if="showIssue !== false"><snippet-issue-number :number="content.issue.number"/>:&ensp;</template><span v-html="$t(content.theme.title)"></span>
    </div>

    <app-title class="fs-l"
    wrap="h3"
    :title="content.title"/>

    <snippet-byline class="fs-s fs-b-sm hide--mobile"
    :snippet="`journal.${content.byline_type}`"
    :author="content.author"
    :authors="content.authors"
    :date="content.date"
    :link="false"/>

  </app-banner>
</template>

<script>
import SnippetIssueNumber from './SnippetIssueNumber.vue';
import SnippetByline from './SnippetByline.vue';

export default {
  props: {
    content: {
      required: true,
    },
    showIssue: {
      default: false,
    },
  },
  // @TODO Is this used?
  computed: {
    byline() {
      // @TODO Make translation authorable ?
      const by = {
        en: 'By ',
        tc: '由',
      };
      const author = this.$t(this.$store.state.site.authors[this.content.author].title);
      return `${this.$t(by)}${author}`;
    },
  },
  components: {
    SnippetIssueNumber,
    SnippetByline,
  },
};
</script>

<style lang="less">
@import "../less/variables.less";

.article-featured {
  .wrap {
    .mq-sm({
      max-width: 85%;
    })
  }
}
</style>
