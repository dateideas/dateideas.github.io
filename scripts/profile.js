comps.load('v-profile');
comps.update('v-profile', {
  data() {
    return { saves: [] };
  },
  created() {
    this.getSaves();
  },
  computed: Vuex.mapState(['user']),
  methods: {
    getSaves() {
      api.getSaves((msg) => {
        this.saves = msg.body;
      }, err => alert(err.message));
    },
  },
});
