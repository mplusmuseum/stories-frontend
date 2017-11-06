<template>
  <main class="exhibitions" v-if="page">

    <div class="header-push"></div>

    <div class="wrap wrap--wide">

      <app-sticky fadeOut>

        <div class="exhibitions__overview">

          <div class="heading">

            <app-title-link class="app-title--same fs-l"
            wrap="h1"
            :title="page.title"/>

          </div>

          <block-text :content="page.blurb"/>

        </div>

      </app-sticky>

    </div>

    <div class="wrap wrap--full">

      <div class="exhibition shadow"
      v-for="exhibition of exhibitions"
      :key="exhibition.id">

        <div class="pinned" v-if="exhibition.pinned">

          <img src="../assets/img/pin.svg" alt="Pin Icon">&nbsp;<span v-html="$t($store.state.translations.exhibitions.pinned)"></span>

        </div>

        <app-banner :content="exhibition">

          <app-section-label type="exhibition" same/>

          <app-title class="fs-l"
          wrap="h2"
          :title="exhibition.title"/>

        </app-banner>

      </div>

    </div>

    <div class="wrap wrap--wide" v-if="remaining">

      <button class="exhibitions__more button button--outline button--wide"
      v-html="$t($store.state.translations.exhibitions.more)"
      @click="getMore">
      </button>

    </div>

  </main>
</template>

<script>
import { mapState } from 'vuex';

import meta from '../util/meta';
import SectionHeader from '../components/SectionHeader.vue';
import AppSticky from '../components/AppSticky.vue';

export default {
  mixins: [meta],
  meta() {
    const title = this.$t(this.$store.state.site.sections.exhibitions);
    return {
      title,
      description: this.$t(this.page.desc),
      image: this.page.simulacrum,
      type: 'website',
      notice: {
        id: 'exhibitions',
        value: title,
        isTitle: true,
      },
    };
  },
  asyncData({ store }) {
    return store.dispatch('exhibitions/init');
  },
  data() {
    return {
      loadingExhibitions: false,
    };
  },
  computed: {
    ...mapState('exhibitions', {
      page: s => s.page,
      exhibitions: s => s.exhibitions,
      remaining: s => s.remaining,
    }),
  },
  methods: {
    getMore() {
      if (this.loadingExhibitions) return false;
      const offset = this.$store.state.exhibitions.exhibitions.length;

      this.loadingExhibitions = true;
      this.$bar.start();

      return this.$store.dispatch('exhibitions/getExhibitions', offset)
        .then(this.afterGetMore)
        .catch((error) => {
          this.afterGetMore();
          this.$modal.error(error);
        });
    },
    afterGetMore() {
      this.loadingExhibitions = false;
      this.$bar.finish();
      this.$nextTick(() => {
        this.$triggerNative('resize');
      });
    },
  },
  components: {
    AppSticky,
    SectionHeader,
  },
};
</script>

<style lang="less">
@import "../less/variables.less";

.exhibition {
  position: relative;
  width: 100%;
  margin-bottom: 3em;
  &--half {
    width: 50%;
  }
  &__info {
    position: relative;
    z-index: 5;
    margin-top: -5em;
  }
}

.exhibitions {
  &__overview {
    padding-top: 1em;
    padding-bottom: 1.5em;
    .heading {
      text-align: center;
    }
  }
  &__more {
    margin-bottom: 1.5em;
  }
}
</style>