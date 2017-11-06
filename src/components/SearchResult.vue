<template>
  <app-panel class="search-result panel--mini shadow--small">

    <div class="panel__inner" slot="content">

      <div class="search-result__text">

        <app-section-label :type="result.type"/>

        <h2 class="search-result__title fs-m">

          <app-link :link="$link(result.link)">

            <app-title :title="highlight(result.title)"/>

          </app-link>

        </h2>

        <div class="block text-block" v-html="$t(highlight(result.excerpt))"></div>

        <div class="search-result__tags" v-if="result.tags && result.tags.length">

          <tag-group class="fs-s fs-b-sm"
          :tagIds="result.tags"/>

        </div>

      </div>

      <div class="search-result__image" v-if="result.card">

        <app-link :link="$link(result.link)">

          <img :src="$placeholder.generate(result.card.content.dim)"
          v-lazy="{
            src: result.card.content.src,
            loading: $placeholder.generate(result.card.content.dim),
          }"
          :alt="$t(result.card.content.alt)">

        </app-link>

      </div>

    </div>

  </app-panel>
</template>

<script>
import _mapValues from 'lodash/mapValues';
import AppLink from './AppLink.vue';

export default {
  props: {
    query: {
      type: String,
      required: false,
      default: '',
    },
    result: {
      type: Object,
      required: true,
    },
  },
  computed: {
    label() {
      return this.$t(this.$store.state.translations.content[this.result.type]).one;
    },
  },
  methods: {
    highlight(obj) {
      if (!this.query || !this.query.length) return obj;
      const iQuery = new RegExp(this.query, 'ig');
      return _mapValues(obj, words => words.toString()
        .replace(iQuery, matchedTxt => (`<span class='highlight'>${matchedTxt}</span>`)));
    },
  },
  components: {
    AppLink,
  },
};
</script>

<style lang="less">
@import "../less/variables.less";

.search-result {
  .panel__inner {
    display: flex;
    flex-direction: row;
  }
  &__title {
    a {
      color: inherit;
      &:hover, &:focus {
        color: @accent;
      }
    }
  }
  &__text {
    flex-grow: 1;
  }
  &__image {
    flex-shrink: 0;
    margin-left: 1em;
    width: 20%;
    img {
      display: block;
      width: 100%;
    }
  }
  &__tags {
    margin-top: 0.5em;
    clear: both;
  }
  .text-block {
    margin: 0.5em 0;
  }
  .highlight {
    background: lighten(@black, 90%);
    box-shadow: 0 1px 4px 0 @shadow;
  }
}
</style>