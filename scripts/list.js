comps.load('v-list');
comps.update('v-list', {
  data() {
    return {
      searchTerm: '',
    };
  },
  computed: Vuex.mapState(['list', 'list_more', 'lists', 'loading', 'searchAutoComplete']),
  created() {
    this.$on('searchType', (searchTerm) => {
      if (searchTerm.length > 0) {
        app.$emit('searchType', searchTerm);
      }
    });

    this.$on('searchClick', () => {
      this.searchTerm = '';
      store.dispatch('setAutocomplete', []);

      if ($$('autocomplete-items').length > 0) {
        showElement($$('hero__search__input'));
        showElement($$('autocomplete-items'));
      } else {
        hideElement($$('hero__search__input--open'));
        hideElement($$('autocomplete-items--open'));
      }
    });
  },

  methods: {
    authenticated() {
      return !!store.state.user;
    },
    showMore() {
      return store.dispatch('getListMore');
    },
  },
});
