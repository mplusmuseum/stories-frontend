<template>
  <div class="newsletter-block block">

    <app-newsletter class="input-wrap--shadow"
    :label="$tl('newsletter.placeholder')"
    button="&rarr;"
    :identifier="content.identifier"/>

  </div>
</template>

<script>
import AppNewsletter from './AppNewsletter.vue';

export default {
  props: {
    index: {
      type: Number,
      required: false,
    },
    content: {
      default: {
        identifier: 'block-newsletter',
      },
    },
  },
  components: {
    AppNewsletter,
  },
};
</script>
