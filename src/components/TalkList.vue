<template>
  <div class="talk-list cf">

    <talk-list-item v-for="talk of talks"
    :key="talk.id"
    :item="talk"/>

  </div>
</template>

<script>
import TalkListItem from './TalkListItem.vue';

export default {
  props: {
    content: {
      required: true,
    },
    limit: {
      default: false,
    },
  },
  computed: {
    talks() {
      return this.limit ? this.content.slice(0, this.limit) : this.content;
    },
  },
  components: {
    TalkListItem,
  },
};
</script>

<style lang="less">
@import "../less/variables.less";

.talk-list {
  display: flex;
  flex-wrap: wrap;
  justify-content: flex-start;
  .talk-list-item {
    flex-shrink: 0;
    width: 100%;
    .mq-sm({ width: 100% / 2; });
  }
}
</style>
