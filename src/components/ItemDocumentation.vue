<template>
  <div class="item item--documentation">

    <app-panel class="panel--mini shadow--small">

      <template slot="content">

        <router-link :to="link"
        role="presentation"
        aria-hidden="true"/>

        <div class="panel__inner">

          <router-link :to="link">

            <app-section-label type="documentation"/>

            <app-title class="item__title"
            wrap="h4"
            :title="item.title"/>

          </router-link>

          <tag-group class="fs-s"
          :tagIds="item.tags"/>

        </div>

      </template>

    </app-panel>

  </div>
</template>

<script>
import { itemMixin } from '../util/mixins';

export default {
  mixins: [itemMixin],
  props: {
    item: {
      required: true,
    },
  },
  computed: {
    link() {
      return {
        name: 'page',
        params: {
          lang: this.$store.state.lang,
          page: this.item.name,
        },
      };
    },
  },
};
</script>
