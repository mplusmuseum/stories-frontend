<template>
  <form class="newsletter-block input-wrap"
  @submit.prevent="submit"
  enctype="multipart/form-data">

    <input type="hidden"
    name="lang"
    :value="lang">

    <label v-show="!email.length"
    :for="identifier"
    v-html="label"></label>

    <input v-model="email"
    :id="identifier"
    name="email"
    type="text"
    :aria-label="$tl('newsletter.placeholder')">

    <div class="button-wrap">
    
      <button v-html="button"
      :aria-label="$tl('accessibility.subscribe')"/>
      
    </div>

  </form>
</template>

<script>
import locales from '../locale';
import { asyncPost } from '../api';
import { validateEmail } from '../util/validation';

export default {
  props: {
    label: {
      required: true,
    },
    button: {
      default: 'Submit',
    },
    identifier: {
      required: true,
    },
  },
  data() {
    return {
      email: '',
      busy: false,
    };
  },
  computed: {
    lang() {
      return this.$store.state.lang === locales[1] ? 2 : 1;
    },
  },
  methods: {
    submit() {
      if (this.busy) return false;
      this.busy = true;

      if (!validateEmail(this.email)) {
        this.error();
        return false;
      }
      // eslint-disable-next-line no-undef
      const formData = new FormData(this.$el);
      return asyncPost('data/newsletter/', formData).then(({ data }) => {
        this.success(data);
      }).catch(({ data }) => {
        this.error(data.errors[0] || 'There was a network error. Please try again later');
      });
    },
    error(message) {
      this.$modal.show({
        message: message || this.$tl('newsletter.errorInvalid'),
        title: this.$tl('newsletter.errorTitle'),
      });
      this.busy = false;
    },
    success({ success }) {
      const title = success
        ? 'newsletter.successTitle'
        : 'newsletter.existingTitle';
      const message = success
        ? 'newsletter.successMessage'
        : 'newsletter.existingMessage';
      this.$modal.show({
        message: this.$tl(message),
        title: this.$tl(title),
      });
      this.email = '';
      this.busy = false;
    },
  },
};
</script>

