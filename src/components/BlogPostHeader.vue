<template>
  <div class="blog-post__header">
    <component class="blog-post__hero block--no-margin"
      v-if="post.hero"
      :is="post.hero.type"
      :content="post.hero.content"
      :share="share"
      :caption="false"></component>
    <h1 class="blog-post__title fs-l"><dynamic-title :title="post.title"></dynamic-title></h1>
    <div class="blog-post__meta">
      <byline :authorId="post.author"
      :date="post.date"
      :categoryId="post.category"></byline>
      <tags-inline v-if="post.tags.length"
      :tagIds="post.tags"></tags-inline>
    </div>
  </div>
</template>

<script>
import Brightcove from './Brightcove.vue';
import Byline from './Byline.vue';
import DynamicTitle from './DynamicTitle.vue';
import ImageBlock from './ImageBlock.vue';
import TagsInline from './TagsInline.vue';
import Vimeo from './Vimeo.vue';
import Youku from './Youku.vue';
import Youtube from './YouTube.vue';

export default {
  props: {
    post: {
      required: true,
    },
    share: {
      default: false,
    },
  },
  components: {
    Brightcove,
    Byline,
    DynamicTitle,
    ImageBlock,
    TagsInline,
    Vimeo,
    Youku,
    Youtube,
  },
};
</script>
