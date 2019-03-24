import _ from 'lodash';
import VideoFrame from '../components/VideoFrame.vue';

export const videoFrameMixin = {
  props: {
    content: {
      required: true,
    },
  },
  components: {
    VideoFrame,
  },
};

export const blockMixin = {
  props: {
    index: {
      type: Number,
      required: false,
    },
  },
  computed: {
    modifierClass() {
      return this.content && this.content.modifier
        ? `block--${this.content.modifier}`
        : false;
    },
  },
};

export const titleMixin = {
  props: {
    title: {
      type: Object,
      required: true,
    },
    wrap: {
      default: 'span',
    },
    block: {
      default: false,
    },
  },
};

export const lightboxMixin = {
  created() {
    window.addEventListener('keydown', this.keyHandler);
  },
  destroyed() {
    window.removeEventListener('keydown', this.keyHandler);
  },
  methods: {
    keyHandler(e) {
      if (e.keyCode === 27) this.close();
    },
    close() {
      // empty
    },
  },
};

export const labelMixin = {
  methods: {
    labelType(item) {
      if (item.type === 'issue') {
        return {
          fn: this.issueWithNumber,
          data: {
            number: item.number,
          },
        };
      }
      return item.type;
    },
    issueWithNumber(data) {
      const snippet = this.$tl('journal.issueWithTitle');
      if (snippet) {
        return snippet.map((match) => {
          if (match.type === 'str') {
            return match.str;
          } else if (match.type === 'fn') {
            const prop = data[match.fn];
            if (prop) return prop;
          }
          return false;
        }).join('');
      }
      return this.$tl('content.issue').one;
    },
  },
};

export const itemMixin = {
  computed: {
    image() {
      const { content: { src, dim } } = this.item.card;
      const loading = this.$placeholder.generate(dim, 'loading', 'black', 'white');
      const padding = (dim.height / dim.width) * 100;
      const wrapperStyle = `padding-top: ${padding}%;'`;
      return { src, loading, wrapperStyle };
    },
  },
};

export const footnoteMixin = name => ({
  computed: {
    footnotes() {
      if (!this[name].content) return [];
      const { sections } = _.reduceRight(this[name].content.list, (data, block, index) => {
        if (block.type === 'footnotes') {
          data.currentIndex += 1;
          data.sections.push({ index, footnotes: [] });
        } else if (block.content.footnotes && data.currentIndex >= 0) {
          const newLocaled = this.$t(block.content.footnotes);
          data.sections[data.currentIndex].footnotes.unshift(...newLocaled);
        }
        return data;
      }, {
        currentIndex: -1,
        sections: [],
      });
      return _.reverse(sections);
    },
    modifiers() {
      if (!this[name].content) return null;
      const footnoteBlock = _.find(this[name].content.list, block => block.type === 'footnotes');
      return footnoteBlock ? `footnotes--${this.$t(footnoteBlock.content.style)}` : null;
    },
  },
});
