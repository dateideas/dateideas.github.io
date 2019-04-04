comps.load('v-profile');
comps['v-profile'].data = function () {
  return {
    saves: [],
  };
};
comps['v-profile'].created = function () {
  this.getSaves();
};
comps['v-profile'].computed = Vuex.mapState(['user']);
comps['v-profile'].methods = {
  getSaves() {
    api.getSaves(msg => this.saves = msg.body, err => alert(err.message));
  },
};
