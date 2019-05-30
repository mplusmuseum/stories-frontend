<template>
  <router-link class="talk-card"
  :to="{ name: 'talk', params: { talk: talk.name } }">

    <div class="talk-card__wrap">

      <div class="talk-card__inner">

        <div class="talk-card__media" v-if="talk.card">

          <img v-if="talk.card.type === 'image'"
          class="lazy"
          :src="imgObj.loading"
          v-lazy="imgObj"
          :alt="$t(talk.card.content.alt)">

          <video v-else-if="talk.card.type === 'video'"
          :src="talk.card.content.src"
          autoplay muted loop></video>

        </div>

        <div class="talk-card__info">

          <app-section-label v-if="showSection !== false"
          type="episode"/>

          <h4 class="talk-card__title fs-m">
            <span v-for="(author, i) in parseAuthors(talk.authors)"
            :key="i">
              <template v-if="i !== 0">, </template>
              <app-title wrap="span"
              :title="author"/>
            </span>
          </h4>

          <div class="talk-card__meta fs-s">

            <h5 class="talk-card__subtitle fs-s">{{ $t(talk.title) }}</h5>
            
            <template v-if="talk.categories && talk.categories.length">
              <img src="../assets/img/play.svg"
              :alt="$tl('accessibility.categories')">&thinsp;<span v-for="(category, i) in talk.categories"
              :key="i">
                <template v-if="i !== 0">, </template>
                <span v-html="$t(category.title)"></span>
              </span>&ensp;
            </template>

            <template v-if="series && series !== false">
              <img src="../assets/img/play.svg"
              :alt="$tl('accessibility.series')">&thinsp;<span v-html="$t(series.title)"></span>&ensp;
            </template>

            <img src="../assets/img/clock.svg"
            :alt="$tl('accessibility.duration')">&thinsp;<span v-html="$t(talk.duration)"></span>

          </div>

        </div>

      </div>

    </div>

  </router-link>
</template>

<script>
export default {
  props: {
    talk: {
      required: true,
    },
    series: {
      default: false,
    },
    showSection: {
      default: false,
    },
  },
  computed: {
    imgObj() {
      const { content } = this.talk.card;
      return {
        src: content.src,
        loading: this.$placeholder.generate(content.dim, 'loading', 'black', 'white'),
      };
    },
  },
  methods: {
    parseAuthors(ids) {
      if (!ids || !ids.length) return false;
      const authors = ids.map((id) => {
        const author = this.$store.state.site.authors[id];
        return author.title;
      });
      return authors;
    },
  },
};
</script>

<style lang="less">
@import "../less/variables.less";

.talk-card {
  display: block;
  color: @white;
  &__wrap {
    position: relative;
    padding-top: 72.5%;
  }
  &__inner {
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
  }
  &__media {
    position: relative;
    background: @black;
    width: 100%;
    height: 100%;
    overflow: hidden;
    transition: 0.25s ease opacity;
    img, video {
      display: block;
      width: 100%;
      height: 100%;
      object-position: 50% 50%;
      object-fit: cover;
      font-family: 'object-fit: cover;';
    }
  }
  &__info {
    position: absolute;
    left: 0;
    bottom: 0;
    height: 100%;
    width: 100%;
    z-index: 2;
    display: flex;
    justify-content: flex-end;
    flex-direction: column;
    padding: 1em;
    background-image: linear-gradient(to top, rgba(0, 0, 0, 1), rgba(0, 0, 0, 0) 90%);
  }
  &__meta {
    margin-top: 0.4em;
    img {
      height: 0.75em;
      width: 0.75em;
    }
  }
  &__subtitle {
    margin-bottom: 0.2em;
    font-weight: @fontNormal;
  }
  &__overlay {
    position: absolute;
    bottom: 0;
    left: 0;
    padding: 0.5em;
    line-height: 1;
  }
  &:hover, &:focus {
    outline: none;
    .talk-card__media {
      opacity: 1 / 3 * 2;
    }
  }
}
</style>
