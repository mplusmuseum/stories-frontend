<template>
  <div class="talk-list-item">

    <div class="talk-list-item__inner shadow">

      <div class="talk-list-item__media">

        <talk-card
        :talk="item"
        :series="item.series"/>

      </div>

      <tag-group class="fs-b"
      :tagIds="item.tags"/>

    </div>

  </div>
</template>

<script>
import TalkCard from './TalkCard.vue';

export default {
  props: {
    item: {
      required: true,
    },
  },
  components: {
    TalkCard,
  },
};
</script>

<style lang="less">
@import "../less/variables.less";

.talk-list-item {
  &__inner {
    background: @black;
  }
  &__media {
    position: relative;
  }
  .tags--inline {
    position: relative;
    z-index: 10;
    margin: -0.75em -0.25em 0;
    padding: 0 1em 1em;
  }
}
</style>