comps.load('v-list');
comps['v-list'].data = function () {
  return {
    searchTerm: '',
    auto_comp_open: false,
  };
};
comps['v-list'].created = function () {
  window.addEventListener('scroll', this.hideAutocomplete);
};
comps['v-list'].computed = Vuex.mapState(['list', 'list_more', 'loading', 'searchAutoComplete',
  'searchAllLocations']);
comps['v-list'].methods = {
  authenticated() {
    return !!store.state.user;
  },
  showMore() {
    return store.dispatch('getListMore');
  },

  hideAutocomplete() {
    event.stopPropagation();
    this.auto_comp_open = false;
    this.searchTerm = '';
    let search = document.getElementById('search');
    search.className = 'hero__search__input';
    search.blur();
  },
  searchLocation(term) {
    this.$router.app.$emit('search', term);
  },
  onClick() {
    event.stopPropagation();
    this.auto_comp_open = !this.auto_comp_open;
    store.dispatch('setAutocomplete', []);
    this.searchTerm = '';
    this.auto_comp_open
      ? document.getElementById('search').className = 'hero__search__input--open'
      : document.getElementById('search').className = 'hero__search__input';
  },
  onType() {
    if (this.searchTerm) {
      document.getElementById('search').className = 'hero__search__input--open';
      this.auto_comp_open = true;
      this.$router.app.$emit('type', this.searchTerm);
      /*
      api.searchGetAutoComp(this.searchTerm,
        msg => store.dispatch('setAutocomplete', msg.split(/\r?\n/)),
        err => alert(err.message));
        */
    } else {
      document.getElementById('search').className = 'hero__search__input';
      this.auto_comp_open = false;
    }
  },
};
comps['v-list'].destroyed = function () {
  window.removeEventListener('scroll', this.hideAutocomplete);
};
