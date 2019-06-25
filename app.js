if (!window.router) {
  window.router = new VueRouter();
}

function hideElement(ele) {
  if (ele) {
    ele.className = 'hero__search__input';
    ele.blur();
  }
}

function showElement(ele) {
  if (ele) {
    ele.className = 'hero__search__input--open';
    ele.focus();
  }
}

window.app = new Vue({
  el: '#app',
  store,
  router,

  created() {
    window.addEventListener('scroll', () => {
      this.$emit('searchHidden');
      this.$emit('hideSearchAutocomplete');
    });
    window.addEventListener('popstate', () => this.$emit('searchHidden'));

    this.$on('search', (term) => {
      store.dispatch('setLoading',
        {
          bool: true,
          text: `searching for ideas near ${term ? term : 'your area'}`,
        });
      if (!term) {
        if (navigator.geolocation) {
          navigator.geolocation.getCurrentPosition(pos => {
            let lon = pos.coords.longitude;
            let lat = pos.coords.latitude;
            store.dispatch('searchLocation', { lon, lat });
          });
        } else {
          alert('unable to get GPS location');
        }
      } else store.dispatch('searchLocationTerm', term);
    });

    this.$on('searchType', (searchTerm) => {
      this.searchTerm = searchTerm;

      if (searchTerm) {
        $('search').className = 'hero__search__input--open';
        this.searchAutocompleteOpen = true;

        store.dispatch('setAutocomplete', []);
        store.state.searchAllLocations
          .map((loc) => [loc.substr(0, searchTerm.length).toUpperCase(), loc])
          .filter((loc) => loc[0] === searchTerm.toUpperCase())
          .forEach((loc) => {
            store.state.searchAutoComplete = store.state.searchAutoComplete.concat(loc[1]);
          });
      } else {
        $('search').className = 'hero__search__input';
        this.searchAutocompleteOpen = false;
      }
    });

    this.$on('searchClick', () => {
      this.searchTerm = '';
      this.searchAutocompleteOpen = !this.searchAutocompleteOpen;
      store.dispatch('setAutocomplete', []);

      if (this.searchAutocompleteOpen) {
        showElement($('search'));
        showElement($('search_mobile'));
      } else {
        hideElement($('search'));
        hideElement($('search_mobile'));
      }
    });

    this.$on('hideSearchAutocomplete', () => {
      this.searchAutocompleteOpen = false;
      this.searchTerm = '';
      hideElement($('search'));
      hideElement($('search_mobile'));
    });
  },

  data: {
    isSearchShown: false,
    searchTerm: '',
    searchAutocompleteOpen: false
  },

  computed: {
    name: () => store.state.user.name,
    picture: () => store.state.user.picture,
    ...Vuex.mapState(['authenticated',
        'showVerifyBox', 'loading', 'loadingText',
        'searchAutoComplete']),
  },

  methods: {
    goHome: () => {
      router.push('/');
    },
    goProfile: () => {
      router.push('/profile');
    },

    searchHidden() {
      // To show nav search bar only when scrolled down
      this.$emit('hideSearchAutocomplete');
      router.currentRoute.path === '/'
        ? this.isSearchShown = window.scrollY > (0.5 * window.innerHeight)
        : this.isSearchShown = true;
    }
  },
});
