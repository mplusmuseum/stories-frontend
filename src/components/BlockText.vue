<template>
  <div class="text-block block" v-html="html"></div>
</template>

<script>
import _eachRight from 'lodash/eachRight';

export default {
  props: {
    content: {
      required: true,
    },
  },
  computed: {
    html() {
      let html = this.$t(this.content.html);
      if (!this.content.footnotes) return html;
      const footnotes = this.$t(this.content.footnotes);
      if (!footnotes) return html;
      _eachRight(footnotes, (footnote) => {
        html = `${html.substr(0, footnote.offset)}<sup class="footnote"><span class="anchor" id="fnref-${footnote.id}"></span><a href="#fn-${footnote.id}"></a></sup>${html.substr(footnote.offset)}`;
      });
      return html;
    },
  },
};
</script>

<style lang="less">
@import '../less/variables.less';

.text-block {
  margin-bottom: 1em;
  line-height: 1.4;

  h1, h2, h3, h4, h5, h6 {
    margin-bottom: 1em;
  }

  ul, ol {
    margin-top: 0;
    margin-bottom: 1em;
    padding: 0 0 0 1.5em;
    &:last-child {
      margin-bottom: 0;
    }
  }

  pre {
    margin-top: 0;
  }

  blockquote {
    color: @grey;
    margin: 0 2em 1em 2em;
    padding: 0;
  }

  iframe {
    width: 100%;
    margin: 0 0 2em 0;
  }

  hr {
    height: 1px;
    border: none;
    background-color: @black;
    margin: 1em 0;
  }

  table {
    margin: 2em 0;
  }
  
  tr {
    &:nth-child(2n) {
      background: lighten(@lightgrey, 3%);
    }
  }

  th {
    font-weight: @fontBold;
  }

  th, td {
    border: 1px solid darken(@lightgrey, 3%);
    padding: 0.5em 1em;
  }

  .footnote {
    cursor: pointer;
    font-weight: @fontBold;
    color: @accent;
    position: relative;
    a:after {
      counter-increment: footnotes;
      content: counter(footnotes);
    }
    .anchor {
      display: inline-block;
    }
    &__pop {
      position: absolute;
      line-height: 1.2;
      left: 0;
      top: 0;
      width: 10em;
      >span {
        position: absolute;
        display: inline-block;
        background: @white;
        box-shadow: @shadowStyleSmall;
        padding: 1em;
        max-width: 100%;
      }
    }
  }

  &:last-of-type {
    margin-bottom: 0;
  }
}
</style>