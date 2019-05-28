<template>
  <app-banner :content="content">

    <app-section-label v-if="showSection !== false"
    :type="labelType(content)" same/>

    <h3 v-if="content.type === 'talk'"
    class="fs-l">
      <span v-for="(author, i) in parseAuthors(content.authors)"
      :key="i">
        <template v-if="i !== 0">, </template>
        <app-title wrap="span"
        :title="author"/>
      </span>
    </h3>    

    <app-title v-else
    class="fs-l"
    wrap="h3"
    :title="content.title"/>

    <div v-if="content.type === 'episode'"
    class="banner__meta fs-b">

      <template v-if="content.series && content.series !== false">
        <img src="../assets/img/play.svg"
        :alt="$tl('accessibility.series')">&thinsp;<span v-html="$t(content.series.title)"></span>&ensp;
      </template>

      <img src="../assets/img/clock.svg"
      :alt="$tl('accessibility.duration')">&thinsp;<span v-html="$t(content.duration)"></span>

    </div>

    <div v-if="content.type === 'talk'"
    class="banner__meta fs-b">

      <h4 class="banner__subtitle">{{ $t(content.title) }}</h4>

      <template v-if="content.series && content.series !== false">
        <img src="../assets/img/play.svg"
        :alt="$tl('accessibility.series')">&thinsp;<span v-html="$t(content.series.title)"></span>&ensp;
      </template>

      <img src="../assets/img/clock.svg"
      :alt="$tl('accessibility.duration')">&thinsp;<span v-html="$t(content.duration)"></span>

    </div>

    <div v-else-if="content.type === 'issue'"
    class="banner__meta fs-b">

      <snippet-translate
      snippet="journal.contributions"
      :data="{ contributors: content.contributors }"
      :parsers="{ contributors: (c) => $t(c) }"/>

    </div>

    <div v-else-if="content.type === 'exhibition'"
    class="banner__meta fs-b">

      <app-link v-for="(button, i) of content.links"
      :key="i"
      :link="button.link">

        <div class="button button--accent">

          <span v-html="$tl(`exhibitions.${button.translation}`)"/>

          <img v-if="typeof button.link === 'string'"
          class="external-icon"
          src="../assets/img/external.svg"
          :alt="$tl('accessibility.externalLink')">

        </div>

      </app-link>

    </div>

  </app-banner>
</template>

<script>
import AppLink from './AppLink.vue';
import SnippetTranslate from './SnippetTranslate.vue';
import { labelMixin } from '../util/mixins';

export default {
  mixins: [labelMixin],
  props: {
    content: {
      required: true,
    },
    showSection: {
      default: true,
    },
  },
  components: {
    AppLink,
    SnippetTranslate,
  },
  methods: {
    parseAuthors(ids) {
      if (!ids || !ids.length) return false;
      const authors = ids.map((id) => {
        const author = this.$store.state.site.authors[id];
        return author.title;
      });
      return authors;
    },
  },
};
</script>
