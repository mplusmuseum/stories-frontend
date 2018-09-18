<template>
  <div class="content-blocks">

    <component v-for="item of items"
    :key="item.id"
    :is="`block-${item.type}`"
    :content="item.content"/>

  </div>
</template>

<script>
import BlockBrightcove from './BlockBrightcove.vue';
import BlockEndnote from './BlockEndnote.vue';
import BlockFootnotes from './BlockFootnotes.vue';
import BlockImage from './BlockImage.vue';
import BlockInstagram from './BlockInstagram.vue';
import BlockNewsletter from './BlockNewsletter.vue';
import BlockQuotation from './BlockQuotation.vue';
import BlockTweet from './BlockTweet.vue';
import BlockVimeo from './BlockVimeo.vue';
import BlockYouku from './BlockYouku.vue';
import BlockYoutube from './BlockYoutube.vue';

export default {
  props: {
    items: {
      type: Array,
      required: true,
    },
  },
  components: {
    BlockBrightcove,
    BlockEndnote,
    BlockFootnotes,
    BlockImage,
    BlockImagePosition: BlockImage,
    BlockInstagram,
    BlockNewsletter,
    BlockQuotation,
    BlockTweet,
    BlockVimeo,
    BlockYouku,
    BlockYoutube,
  },
};
</script>
