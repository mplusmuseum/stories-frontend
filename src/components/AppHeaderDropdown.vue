<template>
  <nav class="dropdown fs-m" @click="close">

    <ul class="dropdown-list dropdown-list--parent">

      <li v-if="mplusItem.link"
      class="dropdown-list-item">

        <a :href="mplusItem.link"
        target="_blank"
        class="dropdown-link dropdown-link--mplus shadow small fs-s">

          ← <span class="lang-primary"
          v-html="$t(mplusItem.title)"/>

        </a>

      </li>

      <li v-for="(item, i) of items"
        :key="i"
        class="dropdown-list-item"
        @mouseenter="isMobile || !item.subitems ? null : addDropdown(i)">

        <a :href="item.link"
        :target="linkTarget(item.link_type)"
        class="dropdown-link dropdown-link--parent shadow"
        :class="{ 'dropdown-link--external' : item.link_type === 'external' }">

          <span class="lang-primary"
          v-html="$t(item.title)"/>

        </a>

        <ul v-if="item.subitems"
        key="dropdown"
        class="dropdown-list dropdown-list--children">

          <li v-for="(subitem, i) of item.subitems"
          :key="i"
          class="dropdown-list-item">

            <router-link class="dropdown-link dropdown-link--child shadow"
            v-if="subitem.type ==='page' && validate(subitem.link)"
            :to="$link(subitem.link)">

              <app-title class="app-title--same-size"
              :title="subitem.title"/>

            </router-link>

            <a v-else
            :href="subitem.link"
            class="dropdown-link dropdown-link--child shadow"
            :class="{ 'small fs-s' : subitem.link_type === 'external' }">

              <span v-if="subitem.link_type === 'external'"
              v-html="$t(subitem.title)"/>

              <app-title v-else
              class="app-title--same-size"
              :title="subitem.title"/>

            </a>

          </li>

        </ul>

      </li>

      <li class="dropdown-list-item">

        <social-links class="dropdown-social-links fs-xs"/>

      </li>        

    </ul>

  </nav>
</template>

<script>
import _ from 'lodash';
import AppTitle from './AppTitle.vue';
import SocialLinks from './SocialLinks.vue';

export default {
  data() {
    return {
      panels: [],
      isMobile: false,
    };
  },
  props: {
    items: {
      type: Array,
      required: true,
    },
    mplusItem: {
      type: Object,
      required: true,
    },
    active: {
      required: true,
    },
    prevent: {
      type: String,
      default: 'dropdown',
    },
  },
  components: {
    AppTitle,
    SocialLinks,
  },
  mounted() {
    window.addEventListener('keydown', this.keyHandler);
    window.addEventListener('mousedown', this.clickHandler);
    this.mq();
    window.addEventListener('resize', this.mq);
  },
  destroyed() {
    window.removeEventListener('keydown', this.keyHandler);
    window.removeEventListener('mousedown', this.clickHandler);
    window.removeEventListener('resize', this.mq);
  },
  methods: {
    mq() {
      this.isMobile = window.matchMedia('(max-width: 992px)').matches;
    },
    validate({ name }) {
      if (_.find(this.$router.options.routes, { name })) return true;
      return false;
    },
    keyHandler(e) {
      if (e.keyCode === 27) this.close();
    },
    clickHandler(e) {
      if (e.target.dataset.prevent !== this.prevent
      && e.target !== this.$el
      && !this.$el.contains(e.target)) {
        this.close();
      }
    },
    linkTarget(type) {
      return type === 'external'
        ? '_blank'
        : '_self';
    },
    close() {
      this.$emit('update:active', false);
    },
    addDropdown(index) {
      if (this.panels.indexOf(index) === -1) this.panels.push(index);
    },
  },
};
</script>
