comps.load('v-list');
comps.update('v-list', {
  data() {
    return {
      searchTerm: '',
      searchAutocompleteOpen: false,
    };
  },
  computed: Vuex.mapState(['list', 'list_more', 'loading', 'searchAutoComplete']),
  created() {
    window.addEventListener('scroll', () => app.$emit('hideSearchAutocomplete'));

    this.$on('searchType', (searchTerm) => {
      this.searchAutocompleteOpen = searchTerm.length > 0;

      if (this.searchAutocompleteOpen) {
        app.$emit('searchType', searchTerm);
      }
    });

    this.$on('searchClick', () => {
      this.searchTerm = '';
      this.searchAutocompleteOpen = !this.searchAutocompleteOpen;
      app.$emit('searchClick');
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
