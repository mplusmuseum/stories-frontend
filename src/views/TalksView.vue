<template>
  <main class="talks">

    <div class="header-push"></div>

    <div class="wrap wrap--wide">

      <div class="talks__content">
        
        <slot/>
        
      </div>

    </div>

  </main>
</template>

<script>
</script>

<style lang="less">
@import "../less/variables.less";

.talks {
  padding-top: 1em;
  &__overview {
    padding-bottom: 1em;
    overflow: hidden;
    .heading {
      text-align: center;
    }
  }
  &__loading {
    margin: 1em;
    text-align: center;
  }
  &__button {
    display: block;
    margin: 3em 0;
  }
  &__marquee {
    margin-top: 0.25em;
    font-style: italic;
    text-transform: uppercase;
  }
  &__category {
    display: inline-block;
    color: @grey;
    padding: 0.25em 0.5em;
    border: 1px solid @grey;
    border-radius: 0.25em;
    margin-right: 0.5em;
    margin-bottom: 0.5em;
    &:focus, &:hover {
      color: @black;
      border-color: @black;
    }
    &.talks__category--active {
      color: @accent;
      border-color: @accent;
    }
  }
}

.talks-series {
  margin-bottom: 3em;
  &__header {
    position: relative;
    padding: 1em;
    background: @white;
    .mq-sm({
      padding: 1.5em;
    });
  }
  &__title {
    .mq-sm({
      padding-right: 2.5em;
    });
  }
  &__desc-toggle-wrap {
    text-align: right;
  }
  .banner {
    box-shadow: @shadowStyle;
    max-height: 580px;
  }
}
</style>
