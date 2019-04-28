<template>
  <aside class="talk-suggested">

    <template v-if="items.length">

      <div class="heading">

        <h2 v-html="$tl('talks.more')"></h2>

      </div>

      <transition-group name="fade"
      tag="div"
      class="talk-suggested__items">

        <router-link class="talk-suggested__item"
        v-for="item in items"
        :key="item.id"
        :to="item.link">

          <img class="lazy"
          :src="$placeholder.generate(item.card.content.dim, 'loading', 'transparent', '#aaa')"
          v-lazy="{
            src: item.card.content.src,
            loading: $placeholder.generate(item.card.content.dim, 'loading', 'transparent', '#aaa'),
          }"
          :alt="$t(item.card.content.alt)">

          <div class="talk-suggested__item-text">

            <app-title class="fs-b" :title="item.title"/>

          </div>

        </router-link>

      </transition-group>

    </template>

  </aside>
</template>

<script>
import AppMarquee from './AppMarquee.vue';
import { asyncGet } from '../api';

export default {
  components: {
    AppMarquee,
  },
  props: {
    talk: {
      required: true,
    },
  },
  data() {
    return {
      items: [],
    };
  },
  mounted() {
    this.getItems();
  },
  methods: {
    getItems() {
      asyncGet('data/related/', {
        id: this.talk.id,
        min: 1,
        max: 3,
        types: ['talk'],
      }).then(({ data: { items } }) => {
        this.items = items;
      }).catch(() => {
        // Fail silently
      });
    },
  },
};
</script>


<style lang="less">
@import "../less/variables.less";

.padControlBar() {
  padding-bottom: 16px * 3;
  @media only screen and (max-width: 1280px) { padding-bottom: 14px * 3; }
  @media only screen and (max-width: 992px) { padding-bottom: 12px * 3; }
  @media only screen and (max-width: 768px) { padding-bottom: 10px * 3; }
}

.talk-suggested {
  width: 100%;
  height: 100%;
  background: rgba(0,0,0,0.9);
  color: @white;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  .padControlBar();
  h2 {
    text-align: center;
  }
  &__items {
    width: 100%;
    overflow: hidden;
    display: flex;
    justify-content: center;
    margin: 0 -0.25em;
  }
  &__item {
    padding: 0 0.25em;
    width: 100% / 3;
    overflow: hidden;
    position: relative;
    .mq-sm-under({
      width: 100% / 2;
      &:nth-child(1n + 3) {
        display: none;
      }
    });
    &-text {
      color: @white;
      transition: 0.25s ease opacity;
      opacity: 0;
      position: absolute;
      top: 0;
      left: 0;
      width: 100%;
      height: 100%;
      padding: 1em;
      background: rgba(0, 0, 0, 0.9);
      display: flex;
      justify-content: center;
      align-items: center;
      text-align: center;
    }
    img {
      width: 100%;
      height: 100%;
      object-fit: cover;
      font-family: 'object-fit: cover;';
      transition: 0.25s ease transform;
    }
    &:hover {
      .talk-suggested__item-text {
        opacity: 1;
      }
      img {
        transform: scale(1.05);
      }
    }
  }
}
</style>
