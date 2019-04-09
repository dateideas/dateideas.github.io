const page = new Vue({
  el: '#v-page',
  data: {
    id: '',
  },

  computed: {
    saved() {
      const p = store.state.saves[this.id];
      return p || false;
    },
    savable() {
      return store.state.authenticated && store.state.verified;
    },
  },

  methods: {
    save() {
      store.dispatch('save', this.id);
    },

    unsave() {
      store.dispatch('unsave', this.id);
    },
  },
});
