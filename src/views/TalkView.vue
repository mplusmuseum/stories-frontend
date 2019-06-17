<template>
  <main class="talk" v-if="talk">

    <div class="talk__video">

      <div class="header-push"></div>

      <div class="wrap wrap--wide">

        <block-brightcove :content="talk.video"
        :key="talk.id"
        :lazy="false"
        @play="play"
        @ended="ended">

          <talk-suggested
          v-if="finished"
          :talk="talk"/>

        </block-brightcove>

      </div>

    </div>

    <div class="talk__content wrap wrap--wide">

      <app-panel>

        <div slot="content" class="panel__inner">

          <div class="heading">

            <h3 class="fs-b"
            v-html="$t(talk.series.title)"></h3>

          </div>

          <div class="heading">

            <app-title-link class="fs-l" :wrap="'h1'" :title="talk.title"/>

          </div>

          <div class="heading">

            <snippet-byline
            :snippet="snippet"
            :authors="talk.authors"
            :talkcategories="talk.categories"
            :date="talk.date"/>

          </div>

          <div class="heading">

            <tag-group class="fs-s fs-b-sm"
            :tagIds="talk.tags"/>

          </div>

          <div class="heading">

            <share-bar class="sharebar--horizontal"
            :data="shareData"/>

          </div>

          <div class="row">

            <div class="col-sm-9">

              <content-blocks :items="content"/>

              <div class="talk__footer">

                <button class="talk__more button"
                :class="moreClass"
                v-if="talk.content.truncateAfter"
                @click="toggle()"
                v-html="moreText"/>

                <a class="talk__more button button--accent"
                v-if="talk.asset"
                :href="$t(talk.asset)"
                v-html="$tl('talks.downloadTranscript')"></a>

              </div>
                           
            </div>

            <div class="col-sm-3">
              <block-text class="fs-s" :content="talk.credits"/>
            </div>
            
          </div>

        </div>

      </app-panel>

      <div class="talk__series"
      v-if="talk.series && talk.series.talks && talk.series.talks.length">

        <div class="talk__series__header shadow">

          <snippet-translate tag="h3"
          class="fs-m"
          snippet="talks.series"
          :data="{ series: talk.series.title }"
          :parsers="{ series: (s, h) => h('span', {}, $t(s)) }"/>

        </div>

        <talk-list :content="talk.series.talks"/>

      </div>

      <app-panel v-else>

        <app-suggested slot="content"
        :id="talk.id"/>

      </app-panel>

    </div>
    
  </main>
</template>

<script>
import meta from '../util/meta';
import AppSuggested from '../components/AppSuggested.vue';
import BlockBrightcove from '../components/BlockBrightcove.vue';
import ContentBlocks from '../components/ContentBlocks.vue';
import TalkList from '../components/TalkList.vue';
import TalkSuggested from '../components/TalkSuggested.vue';
import ShareBar from '../components/ShareBar.vue';
import SnippetByline from '../components/SnippetByline.vue';
import SnippetTranslate from '../components/SnippetTranslate.vue';

export default {
  mixins: [meta],
  meta() {
    return {
      title: this.$t(this.talk.title),
      description: this.$t(this.talk.desc),
      image: this.talk.simulacrum,
      type: 'article',
      notice: {
        id: 'talks',
        value: this.$t(this.$store.state.site.sections.talks),
        isTitle: true,
        link: {
          name: 'talks',
        },
      },
    };
  },
  data() {
    return {
      finished: false,
      suggested: false,
      truncated: true,
    };
  },
  asyncData({ store, route }) {
    return store.dispatch('talks/initTalk', {
      talk: route.params.talk,
    });
  },
  computed: {
    talk() {
      return this.$store.getters['talks/talk'];
    },
    content() {
      if (this.talk.content) {
        if (this.truncated && this.talk.content.truncateAfter) {
          return this.talk.content.list.slice(0, this.talk.content.truncateAfter);
        }
        return this.talk.content.list;
      }
      return [];
    },
    shareData() {
      const base = this.$store.getters.baseURL;
      const { talk: { name, sharetext, title } } = this;
      const location = `${base}/talks/${name}/`;
      const text = sharetext || title;
      return {
        location,
        title: this.$t(text),
      };
    },
    snippet() {
      // If we have categories & authors, return the byline snippet
      if ((this.talk.categories && this.talk.categories.length)
        && (this.talk.authors && this.talk.authors.length)) return 'talks.byline';
      // If we have categories, return categories byline snippet
      if (this.talk.categories && this.talk.categories.length) return 'talks.bylineCategories';
      // If we have authors, return authors byline snippet
      if (this.talk.authors && this.talk.authors.length) return 'talks.bylineAuthors';
      // Otherwise we return a custom snippet just for the date
      const dateElem = { fn: 'date', type: 'fn' };
      return {
        en: [dateElem, { str: '.', type: 'str' }],
        tc: [dateElem, { str: '。', type: 'str' }],
      };
    },
    moreText() {
      return this.truncated
        ? this.$t(this.$store.state.translations.talks.readTranscript)
        : this.$t(this.$store.state.translations.talks.close);
    },
    moreClass() {
      return {
        'button--accent': this.truncated,
        'button--invert': !this.truncated,
      };
    },
  },
  methods: {
    play() {
      this.finished = false;
    },
    ended() {
      this.finished = true;
    },
    toggle() {
      this.truncated = !this.truncated;
      this.$triggerNative();
      this.$gtm.trackEvent({
        category: 'Talk',
        action: this.truncated ? 'Collapse' : 'Expand',
        label: this.talk.title[this.lang],
      });
    },
  },
  watch: {
    talk() {
      this.finished = false;
    },
  },
  components: {
    AppSuggested,
    BlockBrightcove,
    ContentBlocks,
    TalkList,
    TalkSuggested,
    ShareBar,
    SnippetByline,
    SnippetTranslate,
  },
};
</script>

<style lang="less">
@import "../less/variables.less";

.talk {
  &__video {
    background: @black;
    .brightcove-video {
      margin-bottom: 0;
    }
  }
  &__series {
    margin-bottom: 1em;
    .mq-sm({
      margin-bottom: 1.5em;
    });
    &__header {
      position: relative;
      padding: 1em;
      background: @white;
      .mq-sm({
        padding: 1.5em;
      });
    }
    h3 {
      font-weight: @fontNormal;
      span {
        font-weight: @fontBold;
      }
    }
    .talk-list {
      justify-content: flex-start;
    }
  }
  &__footer {
    margin: 1.5em 0 1em;
    .mq-sm({
      margin: 1.5em 0 0;
    });
  }
  &__more {
    margin: 0 0.5em 0.5em 0;
    .mq-sm({
      margin: 0 0.5em 0 0;
    });
  }
  .row {
    margin-top: 1.5em;
    .col-sm-3 {
      margin-bottom: 1.5em;
      .mq-sm-under({
        margin-bottom: 0;
      });
    }
  }
  .sharebar {
    margin-bottom: 0;
  }
}
</style>
