<template>
  <footer class="footer fs-s">

    <div class="footer__content">

      <div class="footer__body footer__section">

        <a :href="`http://www.westkowloon.hk/${$store.state.lang}/`" target="_blank">
        
          <img src="../assets/img/wk-logo.svg"
          :alt="`${$tl('accessibility.externalLink')} ${$tl('accessibility.westKowloon')}`">
          
        </a>

        <router-link v-for="(item, i) of $store.state.site.links.footer"
        :key="i"
        :to="$link(item.link)"
        v-html="$t(item.title)"/>

      </div>

      <social-links class="footer__social footer__section"/>

    </div>

  </footer>
</template>

<script>
import SocialLinks from './SocialLinks.vue';

export default {
  components: {
    SocialLinks,
  },
};
</script>


<style lang="less">
@import "../less/variables.less";

.footer {
  position: relative;
  z-index: 10;
  background: @white;
  &__content {
    background: @accent;
    color: @white;
    width: 100%;
    padding: 1.5rem 1rem;
    display: flex;
    align-items: center;
    justify-content: space-between;
    flex-direction: column;
    .mq-sm({
      flex-direction: row;
    });
  }
  a {
    display: block;
    color: inherit;
  }
  &__section {
    display: flex;
    align-items: center;
  }
  &__body {
    flex-direction: column;
    .mq-sm({
      flex-direction: row;
    });
    a {
      margin: 0 0 1rem;
      .mq-sm({
        margin: 0 1rem;
      });
    }
  }
  &__social {
    a {
      margin-left: 0;
      margin-right: 0.5em;
    }
  }
}
</style>
