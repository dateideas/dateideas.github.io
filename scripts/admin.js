window.admin = new Vue({
  el: '#v-admin',

  data: {
    state: '', // drafts, new, edit, admin
    authorized: false,
    version: '',

    admins: [],
    drafts: [],
    list: [],
    locs: [],
    locsrm: [],

    maincats: ['food', 'event', 'shopping', 'photos'],
    subcats: {
      food: ['dessert', 'drinks', 'meal', 'halal'],
      event: ['music', 'art', 'sports', 'lifestyle', 'movie', 'carnival', 'workshop', 'food'],
      shopping: ['clothes', 'beauty', 'gifts'],
      photos: ['nature', 'decoration', 'exhibition'],
    },

    sample: {
      id: 'example-id',
      img: 'https://placekitten.com/200/300',
      text: ['##### Sample Title',
        'Tue - Monster Popcorn Ice Cream Junior @ $2 per pax (U.P. $4)', '',
        'Wed - Monster Shake @ $3 per pax (U.P $6)', '',
        'Thur - Belgium Waffle & Ice Cream Junior Set @ $2.75 per pax (U.P. $5.50)', '',
        'Fri - Monster Popcorn in a box @ $2.50 per pax (U.P. $5)', '',
        '___',
        '##### Estimated Duration',
        '1 Hour',
        '___',
        '##### Dates',
        '23 to 26th Oct, 12pm to 5pm',
        '___',
        '##### About Shop',
        'Sweet Monster is a upcoming trendy snack stall '
        + 'which focuses on bringing you unique flavours '
        + 'to your regular snacks such as popcorn.'].join('\n'),
      title: 'Sweet Monster First Anniversary',

      important: 'Flash this poster and inform the staff you heard about this promotion from DateIdeas!',

      expiry: '2019-12-31',
      price: '$10',
      place: 'Hillion Mall outlet only',
      time: '23 to 26 Oct 12pm to 5pm',
      info: 'Dress-up for the Halloween Party and Catch the Spooky Night VR Game!',
    },

    details: {
      id: '',
      img: '',
      text: '',
      title: '',

      cat1: '',
      cat2: '',
      weblink: '',
      maplink: '',
      important: '',
      special: false,

      expiry: '',
      price: '',
      place: '',
      time: '',
      info: '',
    },

    adetails: undefined,
  },

  created() {
    api.getAdmins((msg) => {
      this.authorized = true;
      this.admins = msg.body;

      this.getDrafts();
      this.getList();
      this.getVersion();
    }, err => alert('not an admin'));
  },

  methods: {
    getList() { api.getPublished((msg) => { this.list = msg.body; }); },
    getDrafts() { api.getDrafts((msg) => { this.drafts = msg.body; }); },
    getVersion() { api.getVersion((msg) => { this.version = msg.body; }); },
    updatePages() {
      confirm('This is an intensive backend operation, only proceed after adding/editing all the necessary ideas')
        ? api.updatePages(() => {}, err => alert(err.body))
        : () => {};
    },

    showNew() {
      this.state = 'new';
      this.details = {
        id: '',
        img: '',
        text: '',
        title: '',

        cat1: '',
        cat2: '',
        weblink: '',
        maplink: '',
        important: '',
        special: false,

        expiry: '',
        price: '',
        place: '',
        time: '',
        info: '',
      };
      this.locs = [];
    },

    showAdmin() {
      this.state = 'admin';
      this.adetails = {
        uid: '',
        name: '',
      };
    },

    updateDetails(id, newState) {
      return api.getDetails(id, (msg) => {
        this.locs = msg.body.locs;
        delete msg.body.locs;
        this.details = msg.body;
        this.state = newState;
      });
    },

    newLocation() {
      this.locs.push({ lon: '', lat: '', text: '' });
    },

    removeLocation() {
      const removed = this.locs.pop();
      removed.lid
        ? this.locsrm.push(removed)
        : () => {};
    },

    updateLocations() {
      this.locs.forEach((location) => {
        location.lid
          ? api.editLocation(location, () => {}, msg => alert(msg.body))
          : api.addLocation(this.details.id, location, () => {}, msg => alert(msg.body));
      });
      this.locsrm.forEach((location) => {
        api.removeLocation(location.lid, () => {}, msg => alert(msg.body));
      });
    },

    save(callback) {
      return api.putDetails(() => {
        const func = callback
          ? callback()
          : this.state === 'edit'
            ? this.getList()
            : this.getDrafts();
        this.updateLocations();
        this.state = '';
      }, msg => alert(msg.body), this.details, (this.state !== 'new'));
    },

    publish(unpublish) {
      return this.save(() => api.publish(this.details.id, () => {
        this.getList();
        this.getDrafts();
      }, msg => alert(msg.body), unpublish));
    },

    deleteIdea(idea) {
      event.stopPropagation();
      return confirm(`Delete ${idea ? idea.title : this.details.title}?`)
        ? api.deleteIdea(idea ? idea.id : this.details.id, () => {
          this.getList();
          this.getDrafts();
          this.state = '';
        }, msg => alert(msg.body))
        : alert(idea ? idea.title : `${this.details.title} is spared`);
    },

    addAdmin() {
      return api.addAdmin(this.adetails, () => {
        api.getAdmins((msg) => {
          this.admins = msg.body;
          this.state = '';
        }, msg => alert(msg.body));
      }, msg => alert(msg.body));
    },

    removeAdmin(admin) {
      return confirm(`Remove ${admin.name}`)
        ? api.removeAdmin(admin.id, () => {
          api.getAdmins((msg) => {
            this.admins = msg.body;
            this.state = '';
          }, msg => alert(msg.body));
        }, msg => alert(msg.body))
        : alert(`${admin.name} is spared`);
    },
  },
});
