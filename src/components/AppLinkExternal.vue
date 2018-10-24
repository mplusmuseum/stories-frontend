<template>
  <a :href="link" target="_blank">

    <slot/>

  </a>
</template>

<script>
export default {
  props: {
    link: {
      required: true,
    },
  },
};
</script>
