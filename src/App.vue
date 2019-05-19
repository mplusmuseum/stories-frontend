<template>
  <div id="app" class="fs-b" :class="`app--${key}`">

    <app-header/>

    <router-view class="view"
    :class="{ 'blur-filter' : blurred }"/>

    <app-footer/>

    <transition name="fade" mode="out-in">

      <app-lightbox v-if="$store.state.lightbox.active"/>

    </transition>

    <transition name="spin" mode="out-in">

      <app-lightbox-qr v-if="$store.state.lightbox.qr"/>

    </transition>

  </div>
</template>

<script>
import { mapState } from 'vuex';
import AppFooter from './components/AppFooter.vue';
import AppHeader from './components/AppHeader.vue';
import AppLightbox from './components/AppLightbox.vue';
import AppLightboxQr from './components/AppLightboxQr.vue';

export default {
  computed: {
    ...mapState({
      blurred: s => s.header.blurredContent,
    }),
    key() {
      const { route } = this.$store.state;
      const key = route.name;
      return key;
    },
  },
  components: {
    AppFooter,
    AppHeader,
    AppLightbox,
    AppLightboxQr,
  },
};
</script>

<style lang="less">
@import "./less/normalize.less";
@import "./less/typography.less";
@import "./less/columns.less";
@import "./less/variables.less";

html {
  font-size: 10px;
  font-weight: @fontNormal;
  color: @black;
  font-family: "PLUS", Helvetica, Arial, "PingFang HK", "蘋方-港", "HanHei TC", "Heiti TC", "STHeiti", "Microsoft JhengHei UI", "Microsoft JhengHei", "微软雅黑", STXihei, "华文细黑", sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-rendering: optimizeLegibility;
  font-feature-settings: "kern" 1, "dlig" 1;
  background: @lightgrey;
}

body {
  background: @lightgrey;
  &.modal-active {
    overflow: hidden;
  }
}

#app {
  min-height: 100vh;
}

.view {
  min-height: 100vh;
  margin: 0 auto;
  position: relative;
}

.wrap {
  max-width: @widthSmall;
  margin-left: auto;
  margin-right: auto;
  padding-left: 1em;
  padding-right: 1em;
  &--wide {
    max-width: @widthMedium;
    .mq-lg({
      max-width: @widthMedium + 100px;
    });
  }
  &--x-wide {
    max-width: @widthMedium;
    .mq-lg({
      max-width: @widthMedium + 200px;
    });
    @media only screen and (min-width: 1350px) {
      max-width: 95%;
    }
  }
  &--full {
    max-width: 100%;
    .mq-lg({
      padding-left: 1.5em;
      padding-right: 1.5em;
    });
  }
}

.heading {
  margin-bottom: 0.75em;
  &--double {
    margin-bottom: 1.5em;
  }
}

.over {
  position: relative;
  z-index: 1;
  &__content {
    background: @lightgrey;
  }
  &--white {
    .over__content {
      background: @white;
    }
  }
  &__fade {
    height: 2rem;
    background-image: linear-gradient(to top, white, rgba(0, 0, 0, 0));
    width: 100%;
  }
}

.block {
  margin-bottom: 1em;
  &.text-block {
    margin-bottom: 1em;
  }
  &:first-child {
    margin-top: 0;
  }
  &:last-child {
    margin-bottom: 0;
  }
  &--no-margin {
    margin-top: 0;
    margin-bottom: 0;
  }
}

.blur {
  .view {
    filter: blur(20px);
  }
}

strong {
  font-weight: @fontBold;
}

a {
  color: @accent;
  text-decoration: none;
  &:focus {
    outline: none;
  }
}

img {
  &.lazy, &[lazy=loading], &[lazy=loaded] {
    transition: 1s ease opacity;
  } 
  &.lazy, &[lazy=loading] {
    opacity: 0.5;
  }
  &[lazy=loaded], &[lazy=error] {
    opacity: 1;
  }
}

pre {
  background: @lightgrey;
  background: lighten(@lightgrey, 3%);
  padding: 1em;
  line-height: 1.5;
  font-size: 80%;
}

hr {
  height: 1px;
  border: none;
  background-color: @black;
  opacity: 0.3;
  margin: 0.5em 0;
}

.lang-primary {
  font-weight: @fontBold;
}

.lang-secondary {
  font-weight: @fontNormal;
  font-size: 70%;
  &--same {
    font-size: 100%;
  }
}

a.lang-secondary {
  color: @accent;
}

.anchor {
  display: block;
  top: -6em;
  position: relative;
  visibility: hidden;
}

.button {
  display: inline-block;
  cursor: pointer;
  text-align: center;
  min-width: 5rem;
  background-color: @white;
  color: @accent;
  border: none;
  padding: 0.4em 0.6em;
  font-weight: @fontBold;
  text-shadow: none;
  .shadow--small;
  &:hover, &:focus {
    background: @lightgrey;
    color: @accent;
    outline: none;
  }
  &--invert {
    background: @lightgrey;
    color: @midgrey;
    &:hover, &:focus {
      background-color: @accent;
      color: @white;
    }
  }
  &--accent {
    background-color: @accent;
    color: @white;
  }
  &--inactive {
    color: @grey;
    &:hover, &:focus {
      background: @white;
      color: @grey;
    }
  }
  &--active {
    background: @accent;
    color: @white;
    &:hover, &:focus {
      background: @accent;
      color: @white;
    }
  }
  &--flat {
    background: none;
    box-shadow: none;
  }
  &--wide {
    width: 100%;
  }
  &--outline {
    border: 1px solid @grey;
    color: @accent;
    background-color: transparent;
    &:hover, &:focus {
      color: @white;
      border-color: @accent;
      background-color: @accent;
    }
  }
  &--reset {
    padding: 0;
    background: none;
    border: none;
    color: @accent;
    font-weight: @fontBold;
  }
}

.tag {
  font-weight: @fontBold;
  display: inline-block;
  vertical-align: middle;
  padding: 0.2em 0.3em;
  line-height: 1em;
  border: none;
  background-color: @white;
  color: @accent;
  margin: 0.125em;
  box-shadow: inset 0 0 0 1px @accent, 0 1px 0.1em 0 @shadow;
  .mq-sm({
    box-shadow: inset 0 0 0 0.0666em @accent, 0 1px 0.1em 0 @shadow;
  });
  &--selected {
    color: @white;
    background-color: @accent;
    box-shadow: inset 0 0 0 0.05em @accent, 0 2px 0.33em 0 @shadow;
  }
  &--active {
    color: @white;
    background-color: @accent;
    &:after {
      content: '\00d7';
      position: relative;
      top: -0.05em;
      opacity: 0.66;
      margin-left: 0.25em;
      height: 0.15em;
      line-height: 0;
      font-size: 85%;
    }
  }
}
a.tag {
  transition: .25s ease color, .25s ease background-color, .15s ease box-shadow;
  transition: .15s ease box-shadow;
  &:hover, &:focus {
    outline: none;
    box-shadow: inset 0 0 0 1px @accent, 0 2px 0.33em 0 @shadow;
    .mq-sm({
      box-shadow: inset 0 0 0 0.0666em @accent, 0 2px 0.33em 0 @shadow;
    });
  }
}

.input-wrap {
  position: relative;
  background: @white;
  label, input {
    color: @black;
    width: 100%;
    text-align: left;
    height: 2em;
    padding: 0.25em 0.5em;
    line-height: 1.5;
  }
  label {
    position: absolute;
    z-index: 1;
    left: 0;
    top: 0;
    opacity: 0.75;
  }
  input {
    color: @accent;
    position: relative;
    z-index: 2;
    border: none;
    background: none;
  }
  .button-wrap {
    z-index: 2;
    position: absolute;
    right: 0;
    top: 0;
    height: 100%;
  }
  button {
    height: 100%;
    border: none;
    font-weight: @fontBold;
    background: @accent;
    color: @white;
    padding: 0 0.5em;
  }
  &--shadow {
    box-shadow: @shadowStyleSmall;
  }
  &--inline {
    background: none;
    border-bottom: 1px solid @accent;
    padding-bottom: 0.125em;
    label, input {
      height: 1.5em;
      padding: 0;
      line-height: 1.5;
    }
    input {
      border-top: none;
      border-right: none;
      border-left: none;
    }
    button {
      position: absolute;
      right: 0;
      padding: 0 0 0 0.5em;
      color: @accent;
      background: none;
    }
  }
}

.app-title {
  &--same-size {
    .lang-secondary {
      font-size: 100%;
    }
  }
  &--same {
    .lang-secondary {
      color: inherit;
    }
  }
  &--block {
    span, a {
      display: block;
    }
  }
}

.banner {
  height: 50vh;
  background: @black;
  min-height: 300px;
  .mq-sm({
    min-height: 450px;
    height: 60vh;
  });
  .mq-md({
    height: 70vh;
  });
  &__inner {
    position: relative;
    height: 100%;
    width: 100%;
  }
  &__content {
    color: @white;
    position: absolute;
    display: flex;
    justify-content: center;
    align-items: center;
    flex-direction: column;
    z-index: 2;
    top: 0;
    left: 0;
    height: 0;
    width: 100%;
    height: 100%;
    padding: 1em 0;
    text-align: center;
  }
  &__flex {
    width: 100%;
    flex-grow: 1;
    display: flex;
    justify-content: center;
    align-items: center;
    flex-direction: column;
  }
  &__subtitle {
    margin-bottom: 0.2em;
    font-weight: @fontNormal;
  }
  a.banner__flex {
    color: inherit;
    &:hover {
      .banner__box {
        text-shadow: 0 0 0.35em rgba(0,0,0,0.75);
      }
    }
  }
  &__box {
    text-shadow: 0 0 0.25em rgba(0,0,0,0.5);
    transition: 0.25s ease text-shadow;
  }
  .banner__image {
    position: relative;
    width: 100%;
    height: 100%;
    margin: 0;
    &__caption {
      display: none;
      position: absolute;
      bottom: 0;
      left: 0;
      padding: 0.25em;
      margin: 0;
      background: fade(@black, 50%);
      color: @white;
    }
    img {
      height: 100%;
      width: 100%;
      object-fit: cover;
      font-family: 'object-fit: cover;';
    }
  }
  &--hasContent {
    .banner__media {
      opacity: 0.7;
    }
  }
  .banner__video {
    width: 100%;
    height: 100%;
    overflow: hidden;
    video {
      height: 100%;
      width: 100%;
      object-fit: cover;
      font-family: 'object-fit: cover;';
    }
  }
  &__meta {
    margin-top: 0.4em;
    img, svg {
      height: 0.75em;
      width: 0.75em;
    }
    .button {
      margin: 0.25em
    }

  }
  video::-webkit-media-controls-start-playback-button {
    display: none !important;
    -webkit-appearance: none;
  }
}

.social-links {
  a, button {
    background: none;
    border: none;
    padding: 0;
    display: inline-block;
    vertical-align: top;
    margin-top: 0;
    margin-bottom: 0;
    margin-left: 0.5em;
    margin-right: 0.5em;
    width: 2em;
    height: 2em;
    transition: .15s ease transform;
    &:hover, &:focus {
      outline: none;
      transform: scale(1.1);
    }
  }
  img, svg {
    width: 100%;
    height: 100%;
    display: block;
  }
}

.pinned {
  position: absolute;
  left: 0.5em;
  top: 0.5em;
  z-index: 5;
  text-align: center;
  padding: 0.5em;
  background: @black;
  color: @white;
  line-height: 1;
  img {
    display: inline-block;
    vertical-align: top;
    height: 1em;
  }
}

.section-label {
  line-height: 1;
  font-weight: @fontBold;
  text-transform: uppercase;
  margin-bottom: 0.5em;
  letter-spacing: 0.025em;
  color: inherit;
  &.section-label--light {
    color: @white;
  }
}

/* GLOBALS */

.shadow {
  box-shadow: @shadowStyle;
  &--inner {
    box-shadow: @shadowStyleInner;
  }
  &--dark {
    box-shadow: @shadowStyleDark;
  }
}

.shadow--small {
  box-shadow: @shadowStyleSmall;
}

.hide {
  &--mobile {
    .mq-sm-under({
      display: none !important;
    });
  }
  &--desktop {
    .mq-sm({
      display: none !important;
    });
  }
}

.cf {
  &:after {
    content: "";
    display: table;
    clear: both;
  }
}

.blur-filter {
  filter: blur(8px);
  transition: filter .35s ease;
  backface-visibility: hidden;
  .mq-md({
    filter: none;
  });
}

/* TRANSITIONS */

// Fade
.fade-enter-active, .fade-leave-active {
  transition-property: opacity;
  transition-duration: 200ms;
  transition-timing-function: cubic-bezier(0.24, 0, 0.64, 1);
}

.fade-enter, .fade-leave-to {
  opacity: 0.0001;
}

// Swoop
.swoop-enter-active, .swoop-leave-active {
  transition-property: transform, opacity;
  transition-duration: 200ms;
  transition-timing-function: cubic-bezier(0.24, 0, 0.64, 1);
}

.swoop-enter {
  transform: translateY(-20%);
  opacity: 0.0001;
}

.swoop-leave-to {
  transform: translateY(20%);
  opacity: 0.0001;
}

// Swoop up
.swoop-up-enter-active, .swoop-up-leave-active {
  transition-property: transform, opacity;
  transition-duration: 500ms;
  transition-timing-function: cubic-bezier(0.24, 0, 0.64, 1);
}

.swoop-up-enter {
  transform: translateY(20%);
  opacity: 0.0001;
}

.swoop-up-leave-to {
  transform: translateY(-20%);
  opacity: 0.0001;
}

// Spin
.spin-enter-active, .spin-leave-active {
  transition-property: transform, opacity;
  transition-duration: 250ms;
  transition-timing-function: cubic-bezier(0.24, 0, 0.64, 1);
}

.spin-enter {
  transform: translateY(-25%) rotateZ(-90deg);
  opacity: 0.0001;
}

.spin-leave-to {
  transform: translateY(25%) rotateZ(90deg);
  opacity: 0.0001;
}

// Drop
.drop-enter-active, .drop-leave-active {
  transition: transform .35s ease, opacity 0.25s ease;
  transform-origin: 100% 0;
}

.drop-enter, .drop-leave-to {
  opacity: 0;
  transform: translateY(-10%);
}

/* ACCESSIBILITY */

.sr-only {
  position: absolute !important;
  width: 1px !important;
  height: 1px !important;
  margin: -1px !important;
  padding: 0 !important;
  overflow: hidden !important;
  clip: rect(0, 0, 0, 0) !important;
  border: 0 !important;
}

.footnotes {
  counter-reset: footnotesinline;
  &--lower-roman {
    .text-block .footnote a:after { content: counter(footnotesinline, lower-roman); }
    .footnotes-block li:before { content: counter(footnotesblock, lower-roman) " "; }
  }
  &--lower-latin {
    .text-block .footnote a:after { content: counter(footnotesinline, lower-latin); }
    .footnotes-block li:before { content: counter(footnotesblock, lower-latin) " "; }
  }
}

</style>
