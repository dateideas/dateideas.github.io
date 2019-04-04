comps.load('v-search');
comps['v-search'].computed = Vuex.mapState(['search', 'searchTerm']);
