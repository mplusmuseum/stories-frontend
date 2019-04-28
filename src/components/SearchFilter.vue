<template>
  <div class="search-filter">

    <div class="search-filter__buttons">

      <app-dropdown :options="filterOptions"
      :defaultButtonText="$tl('search.filterDefault')"
      :selected.sync="activeFilter"/>
    
      <app-dropdown :options="sortOptions"
      :defaultButtonText="$tl('search.sortDefault')"
      :selected.sync="activeSort"/>

    </div>

  </div>
</template>

<script>
import _ from 'lodash';
import AppDropdown from './AppDropdown.vue';

export default {
  computed: {
    filterOptions() {
      const opts = [
        'post',
        'article',
        'episode',
        'exhibition',
        'documentation',
        'basic',
        'issue',
        'talk',
      ];
      const options = _.map(opts, name => ({
        title: this.$tl(`content.${name}`).many,
        value: name,
      }));
      return options;
    },
    sortOptions() {
      return [
        {
          title: this.$tl('search.sortType'),
          value: {
            by: 'type',
            order: 'asc',
          },
        },
        {
          title: this.$tl('search.sortOldest'),
          value: {
            by: 'modified',
            order: 'asc',
          },
        },
      ];
    },
    activeSort: {
      get() {
        return this.$store.state.search.sort;
      },
      set(param) {
        this.$store.commit('search/setSort', param);
      },
    },
    activeFilter: {
      get() {
        return this.$store.state.search.filter;
      },
      set(param) {
        this.$store.dispatch('search/filter', param);
      },
    },
  },
  components: {
    AppDropdown,
  },
};
</script>

<style lang="less">
@import "../less/variables.less";

.search-filter {
  margin-bottom: 1em;
  &__buttons {
    display: flex;
    flex-wrap: wrap;
    .app-dropdown {
      margin-bottom: 0.5em;
      .mq-sm({
        margin-right: 1em;
      });
    }
  }
}
</style>
