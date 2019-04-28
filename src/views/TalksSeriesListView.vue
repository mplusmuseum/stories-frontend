<template>
  <talks-view v-if="series">
    
    <app-sticky fadeOut>

      <div class="talks__overview">

        <div class="heading">

          <app-title-link class="app-title--same fs-l"
          wrap="h1"
          :title="page.title"/>

        </div>

        <block-text :content="page.blurb"/>

        <div class="talks__categories fs-b">

          <router-link class="talks__category"
          :class="{'talks__category--active': cat.active }"
          v-for="cat in categories"
          :key="cat.id"
          :to="cat.name ? { name: 'talks', query: { category: cat.name } } : { name: 'talks' }"
          v-html="$t(cat.title)"/>

        </div>

        <app-marquee class="talks__marquee fs-m"
        v-if="!series.length"
        :content="this.$t(this.t.talks.noTalks)"/>

      </div>

    </app-sticky>

    <template v-if="series.length">

      <div class="talks-series"
      v-for="seriesItem in series"
      :key="`${showing}-${seriesItem.name}`">

        <div class="talks-series__header shadow">

          <app-title-link class="talks-series__title fs-m"
          wrap="h2"
          :title="seriesItem.title"
          :block="true"/>

          <talks-series-desc v-if="$t(seriesItem.description.html)"
          :content="seriesItem.description"/>

        </div>

        <component v-for="(item, i) in seriesItem.content"
        :key="i"
        :is="item.type"
        :content="item.content"
        :showSection="false"/>

      </div>

      <button class="button button--wide button--outline talks__button"
      v-if="remaining"
      @click="getMore"
      v-html="moreText"/>

    </template>

  </talks-view>
</template>

<script>
import { mapState } from 'vuex';

import AppMarquee from '../components/AppMarquee.vue';
import AppSticky from '../components/AppSticky.vue';
import TalksView from './TalksView.vue';
import TalkList from '../components/TalkList.vue';
import TalksSeriesDesc from '../components/TalksSeriesDesc.vue';
import meta from '../util/meta';
import BannerDynamic from '../components/BannerDynamic.vue';

export default {
  mixins: [meta],
  meta() {
    const title = this.$t(this.$store.state.site.sections.talks);
    return {
      title,
      description: this.$t(this.page.desc),
      image: this.page.simulacrum,
      type: 'website',
      notice: {
        id: 'talks',
        value: title,
        isTitle: true,
      },
    };
  },
  asyncData({ store, route }) {
    return store.dispatch('talks/initTalks', route.query);
  },
  data() {
    return {
      loadingSeries: false,
    };
  },
  computed: {
    ...mapState({
      t: s => s.translations,
      page: s => s.talks.page,
      query: s => s.route.query,
      showing: s => s.talks.showing,
      category: s => s.talks.category,
    }),
    moreText() {
      return this.loadingSeries ? this.$t(this.t.site.loading) : this.$t(this.t.talks.more);
    },
    categories() {
      return this.$store.getters['talks/categories'];
    },
    series() {
      return this.$store.getters['talks/series'];
    },
    remaining() {
      return this.$store.getters['talks/remaining'];
    },
  },
  methods: {
    getMore() {
      if (this.loadingSeries) return false;
      const type = this.showing;
      const selectors = {};
      selectors.offset = this.$store.state.talks[type].length;
      if (this.query && this.query.category) selectors.category = this.query.category;

      this.loadingSeries = true;
      this.$bar.start();

      return this.$store.dispatch('talks/getSeries', { type, selectors })
        .then(this.afterGetMore)
        .catch((error) => {
          this.afterGetMore();
          this.$modal.error(error);
        });
    },
    afterGetMore() {
      this.loadingSeries = false;
      this.$bar.finish();
      this.$triggerNative();
    },
  },
  components: {
    AppMarquee,
    AppSticky,
    TalksView,
    Banner: BannerDynamic,
    List: TalkList,
    TalksSeriesDesc,
  },
};
</script>
