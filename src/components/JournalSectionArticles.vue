<template>
  <app-panel>

    <div class="panel__inner" slot="content">

      <div class="heading" v-if="content.title">
        <app-title-link class="fs-m"
        wrap="h2"
        :title="content.title"/>
      </div>

      <journal-article-list :content="content.list"
      showFeatured
      showIssue/>

    </div>

  </app-panel>
</template>

<script>
import JournalArticleList from '../components/JournalArticleList.vue';

export default {
  props: {
    content: {
      required: true,
    },
  },
  components: {
    JournalArticleList,
  },
};
</script>
