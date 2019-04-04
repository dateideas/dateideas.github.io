if (!window.router) {
  window.router = new VueRouter();
}

window.app = new Vue({
  el: '#app',
  store,
  router,

  created() {
    window.addEventListener('scroll', this.searchHidden);
    window.addEventListener('scroll', this.hideAutocomplete);
    window.addEventListener('popstate', this.searchHidden);
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
  },

  data: {
    isSearchShown: false,
    sms_num: '',
    sms_code: '',
    sms_usercode: '',
    searchTerm: '',
    auto_comp_open: false,
  },

  computed: {
    name: () => store.state.user.name,
    picture: () => store.state.user.picture,
    ...Vuex.mapState(['authenticated', 'showVerifyBox', 'loading', 'loadingText', 'searchAutoComplete']),
  },

  methods: {
    goHome: () => {
      router.push('/');
    },
    goProfile: () => {
      router.push('/profile');
    },

    hideAutocomplete() {
      this.auto_comp_open = false;
      this.searchTerm = '';
      let search = document.getElementById('search');
      let searchMobile = document.getElementById('search_mobile');
      search.className = 'hero__search__input';
      searchMobile.className = '';
      search.blur();
      searchMobile.blur();
    },
    searchHidden() {
      // To show nav search bar only when scrolled down
      this.hideAutocomplete();
      router.currentRoute.path === '/'
        ? this.isSearchShown = window.scrollY > (0.5 * window.innerHeight)
        : this.isSearchShown = true;
    },
    onClick() {
      this.auto_comp_open = !this.auto_comp_open;
      store.dispatch('setAutocomplete', []);
      this.searchTerm = '';
      if (this.auto_comp_open) {
        document.getElementById('search').className = 'hero__search__input--open';
        document.getElementById('search_mobile').className = 'header__search--open';
      } else {
        document.getElementById('search').className = 'hero__search__input';
        document.getElementById('search_mobile').className = '';
      }
    },
    onType() {
      if (this.searchTerm) {
        document.getElementById('search').className = 'hero__search__input--open';
        this.auto_comp_open = true;
        api.searchGetAutoComp(this.searchTerm,
          msg => store.dispatch('setAutocomplete', msg.split(/\r?\n/)),
          err => alert(err.message));
      } else {
        document.getElementById('search').className = 'hero__search__input';
        this.auto_comp_open = false;
      }
    },

    hideVerifyBox: () => {
      store.dispatch('setVerifyBox', false);
    },
    verifyNumber() {
      api.isNumValid(this.sms_num, (msg) => {
        msg.body
          ? api.sendSms(this.sms_num, (msg) => {
            this.sms_code = msg.body;
          }, msg => alert(msg.body))
          : alert('invalid number!');
      }, msg => alert(msg.body));
    },
    verifyCode() {
      api.sendCode(this.sms_code + this.sms_usercode, (msg) => {
        location.reload();
        alert('Account successfully verified!');
      }, msg => alert(msg.body));
    },
    resendCode() {
      api.resendSms((msg) => {
        this.sms_code = msg.body;
      }, msg => alert(msg.body));
    },
  },

  destroyed() {
    window.removeEventListener('scroll', this.searchHidden);
    window.removeEventListener('popstate', this.searchHidden);
    window.removeEventListener('scroll', this.hideAutocomplete);
  },
});
