comps.load('v-card');
comps['v-card'].props = {
  page: Object,
};
comps['v-card'].computed = {
  saved() {
    const p = store.state.saves[this.page.id];
    return p || false;
  },
  savable() {
    return store.state.authenticated && store.state.verified;
  },
};
comps['v-card'].methods = {
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
};
Vue.component('v_card', comps['v-card']);
