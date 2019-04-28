<template>
  <snippet-translate class="byline"
  :snippet="this.snippet"
  :data="{ author, authors, categories, talkcategories, date }"
  :parsers="{
    author: parseAuthor,
    authors: parseAuthors,
    categories: parseCategories,
    talkcategories: parseTalkCategories,
    date: parseDate,
  }"/>
</template>

<script>
import _ from 'lodash';
import SnippetTranslate from './SnippetTranslate.vue';

export default {
  props: {
    snippet: {
      required: true,
    },
    categories: {
      type: Array,
      default: () => [],
    },
    talkcategories: {
      type: Array,
      default: () => [],
    },
    date: {
      type: Object,
    },
    author: {
      type: Number,
    },
    authors: {
      type: Array,
    },
    link: {
      default: true,
    },
  },
  methods: {
    naturalList(items) {
      const separator = this.$t({ en: ', ', tc: '、' });
      const conjunction = this.$t({ en: ' and ', tc: '及' });
      const conjunctionOxford = this.$t({ en: ', and ', tc: '及' });

      return items.reverse().reduce((arr, auth, index) => {
        if (index === 1) {
          if (items.length > 2) {
            arr.push(conjunctionOxford);
          } else {
            arr.push(conjunction);
          }
        }
        if (index > 1) arr.push(separator);
        arr.push(auth);
        return arr;
      }, []).reverse();
    },
    parseAuthor(id, h) {
      if (!id) return false;
      const author = this.$store.state.site.authors[id];
      return this.link ? h(
        'router-link',
        {
          props: {
            to: {
              name: 'search',
              query: {
                q: this.$t(author.title),
              },
            },
          },
        },
        this.$t(author.title),
      ) : h('span', {}, this.$t(author.title));
    },
    parseAuthors(ids, h) {
      if (!ids || !ids.length) return false;
      const el = this.link ? 'router-link' : 'span';
      const authors = ids.map((id) => {
        const author = this.$store.state.site.authors[id];
        const opts = this.link ? {
          props: {
            to: {
              name: 'search',
              query: {
                q: this.$t(author.title),
              },
            },
          },
        } : {};
        return h(el, opts, this.$t(author.title));
      });

      return this.naturalList(authors);
    },
    // Blog only
    parseCategories(categories, h) {
      if (!categories.length) return false;
      const seperator = { en: ', ', tc: '，' };
      return _.reduce(categories, (arr, category, index) => {
        const content = this.$t(category.title);
        if (this.link) {
          const data = { props: { to: { name: 'blog', query: { category: category.name } } } };
          arr.push(h('router-link', data, content));
        } else {
          arr.push(content);
        }
        // Add separator between list elements
        if (index < categories.length - 1) arr.push(this.$t(seperator));
        return arr;
      }, []);
    },
    // Talks only
    parseTalkCategories(talkcategories, h) {
      if (!talkcategories.length) return false;
      const seperator = { en: ', ', tc: '，' };
      return _.reduce(talkcategories, (arr, category, index) => {
        const content = this.$t(category.title);
        if (this.link) {
          const data = { props: { to: { name: 'talks', query: { category: category.name } } } };
          arr.push(h('router-link', data, content));
        } else {
          arr.push(content);
        }
        // Add separator between list elements
        if (index < talkcategories.length - 1) arr.push(this.$t(seperator));
        return arr;
      }, []);
    },
    parseDate(date, h) {
      if (!date) return false;
      return h(
        'span',
        {},
        this.$t(date),
      );
    },
  },
  components: {
    SnippetTranslate,
  },
};
</script>

<style lang="less">
@import '../less/variables.less';

.byline {
  margin: 0.5em 0;
  a {
    font-weight: @fontBold;
  }
  &:last-child {
    margin-bottom: 0;
  }
}
</style>
