<template>
  <main class="document" :class="{ 'document--no-contents' : !page.contents }">

    <div class="header-push"></div>

    <div class="document__items wrap">

      <app-panel class="document-item document-item__contents">

        <div slot="header" class="anchor" id="contents"></div>

        <div class="panel__inner" slot="content">

          <div class="document__title">

            <app-title-link class="fs-l"
            :wrap="'h1'"
            :title="page.title"/>

          </div>

          <div class="document__tags">
            <tag-group class="fs-s fs-b-sm" :tagIds="page.tags"/>
          </div>

          <div v-if="page.contents" class="document__contents">

            <div class="document-item__header">

              <h2 v-html="$tl('site.tableOfContents')"></h2>

            </div>

            <div class="text-block">

              <component :is="page.contents">

                <li v-for="section of page.content" :key="section.name"><a :href="`#${section.name}`" v-html="$t(section.title)"></a></li>

              </component>

            </div>

          </div>

        </div>

      </app-panel>

      <app-panel class="document-item"
      v-for="section of page.content"
      :key="section.name">

        <div slot="header" class="anchor" :id="section.name"></div>

        <div class="panel__inner" slot="content">

          <div class="document-item__header">

            <a v-if="page.contents"
            href="#contents"
            class="document-item__back"><img src="../assets/img/caret-up.svg"
            :alt="$tl('accessibility.contentsReturn')"></a>

            <h2 class="fs-m" v-html="$t(section.title)"></h2>

          </div>

          <content-blocks class="document-item__content"
          :items="section.list"/>

        </div>

      </app-panel>

    </div>

  </main>
</template>

<script>
import ContentBlocks from '../components/ContentBlocks.vue';

export default {
  props: {
    page: {
      required: true,
    },
  },
  components: {
    ContentBlocks,
  },
};
</script>


<style lang="less">
@import "../less/variables.less";

.document {
  padding: 1em 0;
  .mq-sm({ padding: 1.5em 0; });
  &__contents {
    margin-top: 1em;
  }
  &__tags {
    margin-top: 0.5em;
  }
}

.document-item {
  &__header {
    margin-bottom: 1em;
  }
  &__back {
    width: 2.5rem;
    display: block;
    float: right;
    img {
      width: 100%;
      transition: transform 0.25s ease;
    }
    &:hover {
      img {
        transform: translateY(-25%);
      }
    }
  }
}

</style>
