<template>
  <div class="item item--talk">

    <div class="item__inner shadow shadow--small">

      <div class="item__media">

        <talk-card
        :talk="item"
        :series="item.series"
        showSection/>

      </div>

      <tag-group class="fs-s"
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
