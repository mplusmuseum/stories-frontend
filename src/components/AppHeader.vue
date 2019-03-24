<template>
  <header class="header">

    <div class="header__wrap">

      <div class="header__bar shadow">

        <div class="header__section header__section--left">

          <router-link :to="{ name: 'home' }">

            <img class="hide--desktop"
            src="../assets/img/stories-logo-stack.svg"
            :alt="$tl('accessibility.homepage')"
            @click="logoClick">

            <img class="hide--mobile"
            src="../assets/img/stories-logo-line.svg"
            :alt="$tl('accessibility.homepage')"
            @click="logoClick">

          </router-link>

        </div>

        <div class="header__section header__section--middle fs-b"
        aria-hidden="true">

          <transition name="swoop" mode="out-in">

            <div v-if="notice"
            :key="notice.id"
            class="header__notice hide--mobile"
            :class="{ 'header__notice--title' : notice.isTitle }">

              <router-link v-if="notice.link"
              :to="$link(notice.link)"
              v-html="notice.value"/>

              <button v-else
              @click="scrollTo(notice.scroll)"
              v-html="notice.value"/>

            </div>

          </transition>

        </div>

        <div class="header__section header__section--right header__icons">

          <button class="header__icon"
          @click="toggleDropdown"
          :aria-label="$tl('accessibility.btnNav')"
          :data-prevent="prevent.dropdown">

            <img v-show="panel !== 'dropdown'"
            src="../assets/img/menu.svg"
            alt=""
            :data-prevent="prevent.dropdown">

            <img v-show="panel === 'dropdown'"
            src="../assets/img/cross.svg"
            alt=""
            :data-prevent="prevent.dropdown">

          </button>

          <button class="header__icon"
          @click="changeLanguage"
          :aria-label="$tl('accessibility.btnLang')">

            <img v-if="lang === 'en'"
            src="../assets/img/tc.svg"
            alt="">

            <img v-else
            src="../assets/img/en.svg"
            alt="">

          </button>

          <button class="header__icon"
          v-if="searchEnabled"
          @click="toggleSearch"
          :aria-label="$tl('accessibility.btnSearch')"
          :data-prevent="prevent.search">

            <img v-show="panel !== 'search'"
            src="../assets/img/search.svg"
            alt=""
            :data-prevent="prevent.search">

            <img v-show="panel === 'search'"
            src="../assets/img/cross.svg"
            alt=""
            :data-prevent="prevent.search">

          </button>

        </div>

      </div>

      <transition name="drop">

        <app-header-dropdown v-if="panel === 'dropdown'"
        key="dropdown"
        :items="menuItems"
        :mplusItem="mplusItem"
        :active.sync="panel"
        :prevent="prevent.dropdown"/>

        <app-header-search v-if="panel === 'search'"
        key="search"
        :active.sync="panel"
        :prevent="prevent.search"/>

      </transition>

    </div>

  </header>
</template>

<script>
import { mapState } from 'vuex';
import _ from 'lodash';
import locales from '../locale';
import AppHeaderDropdown from './AppHeaderDropdown.vue';
import AppHeaderSearch from './AppHeaderSearch.vue';
import BlockNewsletter from './BlockNewsletter.vue';

export default {
  data() {
    return {
      panel: false,
      prevent: {
        dropdown: 'dropdown',
        search: 'search',
      },
    };
  },
  computed: {
    ...mapState({
      lang: s => s.lang,
      routeQuery: s => s.route.query,
      menuItems: s => s.site.links.menu_universal,
      mplusItem: s => s.site.links.mplus,
      notice: s => s.header.notice,
    }),
    searchEnabled() {
      return _.find(this.$router.options.routes, { name: 'search' });
    },
  },
  methods: {
    scrollTo(scroll = 0) {
      window.scrollTo(0, scroll);
    },
    logoClick() {
      const homeRouteName = 'home';
      if (this.$store.state.route.name === homeRouteName) this.scrollTo();
    },
    changeLanguage() {
      const lang = (this.lang === locales[0]) ? locales[1] : locales[0];
      // Maintain query
      this.$router.push({ params: { lang }, query: this.routeQuery });
    },
    toggleDropdown() {
      this.panel = (this.panel === 'dropdown')
        ? false
        : 'dropdown';
      this.toggleBlurredContent();
    },
    toggleSearch() {
      this.panel = (this.panel === 'search' || this.$store.state.route.name === 'search')
        ? false
        : 'search';
      this.toggleBlurredContent();
    },
    toggleBlurredContent() {
      this.$store.commit('header/updateBlurredContent', this.panel);
    },
  },
  components: {
    AppHeaderDropdown,
    AppHeaderSearch,
    BlockNewsletter,
  },
};
</script>

<style lang="less">
@import "../less/variables.less";

.header {
  position: fixed;
  z-index: 101;
  width: 100%;
  top: 0;
  left: 0;
  a {
    color: @white;
  }
  &__wrap {
    position: relative;
    z-index: 20;
    width: 100%;
    color: @white;
  }
  &__bar {
    position: relative;
    z-index: 10;
    background: @accent;
    width: 100%;
    display: flex;
    align-items: center;
    justify-content: space-between;
  }
  &__section {
    position: relative;
    &--left {
      flex-grow: 0;
      flex-shrink: 0;
      z-index: 11;
      a {
        display: block;
        >img, >span {
          vertical-align: middle;
          display: inline-block;
        }
      }
    }
    &--middle {
      flex-grow: 1;
      overflow: hidden;
    }
    &--right {
      flex-grow: 0;
      flex-shrink: 0;
      justify-content: flex-end;
    }
  }
  &__query {
    color: @white;
    height: 100%;
    position: relative;
    .query-input {
      position: relative;
      z-index: 5;
      border: none;
      margin: 0;
      width: 100%;
      height: 100%;
      background: none;
      display: block;
      padding: 0 0.5em;
    }
    .query-placeholder {
      position: absolute;
      z-index: -1;
      pointer-events: none;
      top: 0;
      left: 0;
      line-height: 2em;
      padding: 0 0.5em;
      height: 100%;
    }
  }
  &__notice {
    font-weight: @fontBold;
    text-align: right;
    line-height: 2em;
    display: block;
    white-space: nowrap;
    width: 100%;
    overflow: hidden;
    text-overflow: ellipsis;
    padding: 0;
    border: none;
    background: none;
    button {
      background: none;
      border: none;
      margin: 0;
      padding: 0;
    }
    span {
      font-weight: @fontNormal;
    }
  }
  &__icons {
    display: flex;
  }
  &__icon {
    background: none;
    border: none;
    padding: 0;
    display: block;
    img {
      height: 100%;
      display: block;
    }
    transition: .15s ease transform;
    &:hover, &:focus {
      transform: scale(1.1);
    }
  }
  .dropdown {
    position: absolute;
    right: 0;
    will-change: transform;
  }
  .dropdown-list {
    margin: 0;
    padding: 0;
    list-style: none;
  }
  .dropdown-list-item {
    display: block;
    margin-top: 0.2em;
    display: flex;
    flex-direction: column;
    align-items: flex-end;
  }
  .dropdown-link {
    display: block;
    padding: 0.15em 0.4em 0.05em 0.4em;
    background: @white;
    color: @accent;
    border-bottom: 3px solid transparent;
    transition: .125s ease border-color;
    &:hover, &:focus {
      border-color: @accent;
    }
    &.small {
      background: @accent;
      color: @white;
      border: none;
      padding: 0.3em 0.4em;
      font-weight: @fontBold;
      transition: .15s ease transform;
      .mq-md({
        padding: 0.4em 0.5em;
      });
      &:hover, &:focus {
        outline: none;
        transform: scale(1.1);
      }
    }
    &--parent {
      padding: 0.1em 0.4em 0.1em 0.4em;
      font-family: "DTLProkyonSTBold", "PLUS", Helvetica, Arial, "PingFang HK", "蘋方-港", "HanHei TC", "Heiti TC", "STHeiti", "Microsoft JhengHei UI", "Microsoft JhengHei", "微软雅黑", STXihei, "华文细黑", sans-serif;
    }
    &--child {
      background: @accent;
      color: @white;
      &:hover, &:focus {
        border-bottom-color: @white;
      }
      &.small {
        background: @lightgrey;
        color: @accent;
      }
    }
    &--external {
      span {
        &:after {
          background-image: url('../assets/img/external-blue.svg');
          display: inline-block;
          width: 0.6em;
          height: 0.6em;
          vertical-align: top;
          content: '',
        }
      }
    }
  }
  .dropdown-social-links {
    a {
      margin-right: 0;
      box-shadow: @shadowStyle;
      background: @lightgrey;
      padding: 0.2em 0.3em;
      width: 2.9em;
      height: 2.9em;
      .mq-md({
        width: 2em;
        height: 2em;
      });
    }
    svg g {
      fill: @accent;
    }
  }
}

// Sizing rules
.header {
  padding: @hSm * 1;
  .mq-sm({ padding: @hMd * 1; });
  .mq-lg({ padding: @hLg * 1; });
  &__bar {
    height: @hSm * 10;
    .mq-sm({ height: @hMd * 10; });
    .mq-lg({ height: @hLg * 10; });
  }
  &__bar, &__section {
    padding: @hSm;
    .mq-sm({ padding: @hMd; });
    .mq-lg({ padding: @hLg; });
  }
  &__icon, &__section img {
    height: @hSm * 6;
    .mq-sm({ height: @hMd * 6; });
    .mq-lg({ height: @hLg * 6; });
  }
  &__section {
    &--middle {
      padding-top: 0;
      padding-bottom: 0;
      padding-right: 0.75em;
      padding-left: 0.75em;
      height: 100%;
    }
  }
  &__icon {
    margin-left: @hSm * 3;
    .mq-sm({ margin-left: @hMd * 3; });
    .mq-lg({ margin-left: @hLg * 3; });
    &:first-child {
      margin-left: 0;
    }
  }
  &-push {
    height: @hSm * 11;
    .mq-sm({ height: @hMd * 11; });
    .mq-lg({ height: @hLg * 11; });
  }
}

.infopanel {
  position: absolute;
  right: 0;
  color: @black;
  background: fade(@lightgrey, 95%);
  width: 100%;
  max-width: 100% / 5;
  max-width: 24em;
  margin-left: auto;
  padding: 0.5em;
  &__header {
    margin-bottom: 0.5em;
  }
  &__section {
    padding: 0.5em;
  }
  hr {
    background: @black;
  }
  .social-links {
    a {
      margin-left: 0;
      margin-right: 0.5em;
    }
    .svg-icon {
      fill: @accent;
    }
  }
  &--search {
    max-width: 100%;
    input, label {
      text-align: center;
    }
  }
}

</style>
