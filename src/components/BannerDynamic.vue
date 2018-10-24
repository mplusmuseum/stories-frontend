<template>
  <app-banner :content="content">

    <app-section-label :type="labelType(content)" same/>

    <app-title class="fs-l"
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

        <div class="button button--accent"
        v-html="$tl(`exhibitions.${button.translation}`)"/>

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
  },
  components: {
    AppLink,
    SnippetTranslate,
  },
};
</script>
