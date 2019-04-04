const page = new Vue({
  el: '#v-page',
  data: {
    id: '',
    saved: false,
  },

  computed: {
    savable() {
      return store.state.authenticated && store.state.verified;
    },
  },

  methods: {
    save() {
      this.saved = true;
      store.dispatch('save', this.id);
    },

    unsave() {
      this.saved = false;
      store.dispatch('unsave', this.id);
    },
  },
});
