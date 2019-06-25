comps.load('v-card');
comps.update('v-card', {
  props: {
    page: Object,
  },
  computed: {
    saved() {
      const p = store.state.saves[this.page.id];
      return p || false;
    },
    savable() {
      return store.state.authenticated;
    },
  },
  methods: {
    visitPage() {
      window.location.assign(`//dateideas.github.io/pages/${this.page.id}`);
    },

    save(event) {
      event.stopPropagation(); // prevent overlapping clicks from triggering at once
      store.dispatch('save', this.page.id);
    },

    unsave(event) {
      event.stopPropagation();
      store.dispatch('unsave', this.page.id);
    },
  },
});

Vue.component('v_card', comps['v-card']);
