const store = new Vuex.Store({
  state: {
    dideas_tkn: undefined,
    user: undefined,
    loading: false,
    loadingText: '',

    list: [],
    list_more: [],
    pages: {},
    saves: {},

    searchAllLocations: ['Tuas Link', 'Tuas West Road', 'Tuas Crescent', 'Gul Circle', 'Joo Koon',
      'Pioneer', 'Boon Lay', 'Lakeside', 'Chinese Garden', 'Jurong East', 'Clementi', 'Dover',
      'Buona Vista', 'Commonwealth', 'Queenstown', 'Redhill', 'Tiong Bahru', 'Outram Park', 'Tanjong Pagar',
      'Raffles Place', 'City Hall', 'Bugis', 'Lavender', 'Kallang', 'Aljunied', 'Paya Lebar', 'Eunos',
      'Kembangan', 'Bedok', 'Tanah Merah', 'Simei', 'Tampines', 'Pasir Ris', 'Expo', 'Changi Airport',
      'Bukit Batok', 'Bukit Gombak', 'Choa Chu Kang', 'Yew Tee', 'Kranji', 'Marsiling', 'Woodlands',
      'Admiralty', 'Sembawang', 'Yishun', 'Khatib', 'Yio Chu Kang', 'Ang Mo Kio', 'Bishan', 'Braddell',
      'Toa Payoh', 'Novena', 'Newton', 'Orchard', 'Somerset', 'Dhoby Ghaut', 'Marina Bay', 'Marina South Pier',
      'Harbourfront', 'Chinatown', 'Clarke Quay', 'Little India', 'Farrer Park', 'Boon Keng', 'Potong Pasir',
      'Woodleigh', 'Serangoon', 'Kovan', 'Hougang', 'Buangkok', 'Sengkang', 'Punggol', 'Bras Basah',
      'Esplanade', 'Promenade', 'Nicoll Highway', 'Stadium', 'Mountbatten', 'Dakota', 'MacPherson',
      'Tai Seng', 'Bartley', 'Lorong Chuan', 'Marymount', 'Caldecott', 'Botanic Gardens', 'Farrer Road',
      'Holland Village', 'one-north', 'Kent Ridge', 'Haw Par Villa', 'Pasir Panjang', 'Labrador Park',
      'Telok Blangah', 'Bayfront', 'Bukit Panjang', 'Cashew', 'Hillview', 'Beauty World', 'King Albert Park',
      'Sixth Avenue', 'Tan Kah Kee', 'Stevens', 'Rochor', 'Downtown', 'Telok Ayer', 'Fort Canning',
      'Bencoolen', 'Jalan Besar', 'Bendemeer', 'Geylang Bahru', 'Mattar', 'Ubi', 'Kaki Bukit',
      'Bedok North', 'Bedok Reservoir', 'Tampines West', 'Tampines East', 'Upper Changi', 'Sentosa'],
    search: [],
    searchAutoComplete: [],
    searchTerm: '',

    authenticated: false,
    verified: true,
    showVerifyBox: false,
  },
  getters: {
    page: state => id => state.pages[id],
  },
  mutations: {
    setDideasTkn(state, tkn) {
      state.dideas_tkn = tkn;
      return tkn
        ? localStorage.setItem('accessToken', tkn)
        : localStorage.removeItem('accessToken');
    },
    setUser(state, user) {
      state.user = user;
      state.authenticated = !!user;
      return user
        ? localStorage.setItem('user', JSON.stringify(user))
        : localStorage.removeItem('user');
    },
    setLoading(state, loader) {
      state.loading = loader.bool;
      state.loadingText = loader.text;
    },

    setSave(state, id) {
      Vue.set(state.saves, id, true);
    },
    setUnsave(state, id) {
      Vue.set(state.saves, id, false);
    },

    setList(state, list) {
      state.list = list;
    },
    setListMore(state, list) {
      state.list_more = list;
    },
    updateListMore(state, list) {
      state.list_more = state.list_more.concat(list);
    },

    setSearch(state, results) {
      state.search = results;
    },
    setSearchTerm(state, term) {
      state.searchTerm = term;
    },
    setAutocomplete(state, results) {
      state.searchAutoComplete = results;
    },

    setVerified(state, bool) {
      state.verified = bool;
    },
    setVerifyBox(state, bool) {
      state.showVerifyBox = bool;
    },
  },
  actions: {
    setUser(store, item) {
      const { user, atkn, dtkn } = item;
      store.commit('setUser', user);
      return dtkn
        ? store.dispatch('reLogin', dtkn)
        : api.login(atkn, (res) => {
          store.commit('setDideasTkn', res.body);
          store.dispatch('getList');
          /* Uncomment to enable sms verification
          api.isVerified((res) => {
            if (!res.body) {
              store.commit('setVerifyBox',
                confirm('Account not verified, some features unavailable. Verify account?'));
            }
            store.commit('setVerified', res.body);
          }); */
        });
    },
    clearUser(store) {
      store.commit('setDideasTkn', null);
      store.commit('setUser', null);
      store.commit('setSaves', {});
    },
    reLogin(store, tkn) {
      store.commit('setDideasTkn', tkn);
      // store.dispatch('verifyUser');
    },
    setLoading(store, loader) {
      store.commit('setLoading', loader);
    },

    setVerifyBox(store, bool) {
      store.commit('setVerifyBox', bool);
    },
    verifyUser(store) {
      api.isVerified((msg) => {
        if (!msg.body) {
          store.commit('setVerifyBox',
            confirm('Account not verified, some features unavailable. Verify account?'));
        }
        store.commit('setVerified', msg.body);
        store.dispatch('getList');
      });
    },

    getList(store) {
      api.getList((data) => {
        store.commit('setList', data.body);
        store.commit('setListMore', []);
        store.dispatch('getListMore');
        if (store.state.authenticated) {
          store.dispatch('checkSaved');
        }
      }, msg => alert(msg.body));
    },
    getListMore(store) {
      const func = (msg) => {
        store.commit('updateListMore', msg.body);
        if (store.state.authenticated) {
          store.dispatch('checkSaved');
        }
      };
      store.state.list_more.length === 0
        ? store.state.list.length === 0
          ? alert('Unable to load ideas. Please log out and try again.')
          : api.getMore(store.state.list.slice(-1)[0].published, func)
        : api.getMore(store.state.list_more.slice(-1)[0].published, func);
    },

    // --- saves implemented for responsive purposes
    save(store, id) {
      api.setSave('save', id, () => {
        store.commit('setSave', id);
        let snackbar = document.getElementById('snackbar');
        snackbar.className = 'show';
        setTimeout(function () {
          snackbar.className = snackbar.className.replace('show', '');
        }, 2000);
      }, msg => alert(msg.body));
    },
    unsave(store, id) {
      api.setSave('unsave', id, () => store.commit('setUnsave', id), msg => alert(msg.body));
    },
    checkSaved(store) {
      const callback = idea => api.getSaved(idea.id,
        msg => msg.body
          ? store.commit('setSave', idea.id)
          : store.commit('setUnsave', idea.id),
        err => alert(err.message));
      store.state.list.forEach(callback);
      store.state.list_more.forEach(callback);
    },

    // location search
    searchLocation(store, coords) {
      store.commit('setSearchTerm', 'your area');
      api.searchLocation(coords.lon, coords.lat,
        msg => {
          store.commit('setSearch', msg.body);
          store.dispatch('setLoading', { bool: false, text: '' });
          router.push('/search');
        },
        () => {
          alert('Please Login!');
          store.dispatch('setLoading', { bool: false, text: '' });
        });
    },
    searchLocationTerm(store, term) {
      store.commit('setSearchTerm', term);
      api.searchLocationTerm(term,
        msg => {
          store.commit('setSearch', msg.body);
          store.dispatch('setLoading', { bool: false, text: '' });
          router.push('/search');
        },
        () => {
          alert('Please Login!');
          store.dispatch('setLoading', { bool: false, text: '' });
        });
    },
    setAutocomplete(store, arr) {
      store.commit('setAutocomplete', arr);
    },
  },
});

(function () {
  store.dispatch('getList');
  const dtkn = localStorage.getItem('accessToken');
  const user = JSON.parse(localStorage.getItem('user'));

  return (dtkn && user)
    ? store.dispatch('setUser', { user, dtkn })
    : store.dispatch('clearUser');
}());
