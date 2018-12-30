<script>
import _ from 'lodash';
import BlogPost from './BlogPost.vue';
import InteractiveWaypoints from './InteractiveWaypoints.vue';
import NoticeConnect from '../components/NoticeConnect.vue';

export default {
  props: {
    posts: {
      required: true,
    },
    notices: {
      default: false,
    },
    showing: {
      required: true,
    },
  },
  components: {
    BlogPost,
    InteractiveWaypoints,
    NoticeConnect,
  },
  methods: {
    updateURL(name = false) {
      let url = window.location.origin;
      const { route } = this.$store.state;
      if (name) {
        const path = route.path.replace(/\/$/, '');
        url += `${path}/${name}/`;
      } else {
        url += route.fullPath;
      }
      window.history.replaceState(undefined, undefined, url);
    },
    updateNotice(post = false, el = false) {
      const blogTitle = this.$t(this.$store.state.site.sections.blog);
      const notice = {};
      if (post) {
        let scroll = 0;
        if (el) {
          const { top } = el.getBoundingClientRect();
          const scrollTop = window.pageYOffset || document.documentElement.scrollTop;
          scroll = (top + scrollTop) + 1;
        }
        notice.id = post.name;
        notice.value = `${blogTitle}: <span>${this.$t(post.title)}</span>`;
        notice.isTitle = false;
        notice.scroll = scroll;
      } else {
        notice.id = 'blog';
        notice.value = blogTitle;
        notice.isTitle = true;
      }
      this.$store.commit('header/updateNotice', notice);
    },
    trigger(index) {
      const items = this.$refs.waypoints.$children;
      const item = items[index];
      if (index < 0) {
        this.updateURL();
        this.updateNotice();
      } else if (item && item.post && item.post.name) {
        this.updateURL(item.post.name);
        this.updateNotice(item.post, item.$el);
      }
    },
    createNotice(h) {
      return h('aside', {
        class: 'blog-item blog-item--notice',
      }, [
        h('notice-connect'),
      ]);
    },
    createBlogPost(h, post, index) {
      return h('blog-post', {
        class: 'list-complete-item',
        key: `${this.showing}-${post.name}`,
        ref: `post-${index}`,
        props: {
          post,
        },
      });
    },
    createContentList(h) {
      const content = _.reduce(this.posts, (items, post, index) => {
        if (typeof this.notices === 'object'
        && this.showing === 'unfiltered'
        && this.notices[index]) {
          items.push(this.createNotice(h));
        }
        items.push(this.createBlogPost(h, post));
        return items;
      }, []);
      return content;
    },
  },
  render(h) {
    const posts = this.createContentList(h);

    return h('interactive-waypoints', {
      props: {
        trigger: this.trigger,
      },
      ref: 'waypoints',
    }, posts);
  },
};
</script>
