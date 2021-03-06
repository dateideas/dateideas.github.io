if (!window.router) {
  window.router = new VueRouter();
}

function hideElement(ele) {
  if (ele && ele.length > 0) {
    ele.forEach(e => {
      e.className = e.className.split('--')[0];
      e.blur();
    });
  }
}

function showElement(ele) {
  if (ele && ele.length > 0) {
    ele.forEach(e => {
      e.className = `${e.className}--open`;
      e.focus();
    });
  }
}

window.app = new Vue({
  el: '#app',
  store,
  router,

  created() {
    window.addEventListener('scroll', () => {
      this.$emit('searchHidden');
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
        store.dispatch('setAutocomplete', []);
        store.state.searchAllLocations
          .map((loc) => [loc.substr(0, searchTerm.length).toUpperCase(), loc])
          .filter((loc) => loc[0] === searchTerm.toUpperCase())
          .forEach((loc) => {
            store.state.searchAutoComplete = store.state.searchAutoComplete.concat(loc[1]);
          });
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

    this.$on('hideSearchAutocomplete', () => {
      this.searchTerm = '';
      hideElement($$('hero__search__input--open'));
      hideElement($$('autocomplete-items--open'));
    });
  },

  data: {
    isSearchShown: false,
    searchTerm: ''
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
      window.location.assign('https://www.dateideassg.com/');
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
