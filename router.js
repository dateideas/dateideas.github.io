const v_callback = {
  template: '<div></div>',
  created: () => {
    if (window.location.hash.startsWith('#/access_token')) {
      auth0_handle();
    } else {
      router.push('/');
    }
  },
};

const router = new VueRouter({
  routes: [{
    path: '/',
    component: comps['v-list'],
  }, {
    path: '/contrib',
    component: comps['v-contrib'],
  }, {
    path: '/about',
    component: comps['v-info'],
  }, {
    path: '/contact',
    component: comps['v-contact'],
  }, {
    path: '/profile',
    component: comps['v-profile'],
  }, {
    path: '/search',
    component: comps['v-search'],
  }, {
    path: '*',
    component: v_callback,
  }],
});

router.afterEach((to, from) => {
  sendGa(to.fullPath);

  toggleMenu(false);
  autoNav(to.path);
  window.scrollTo(0, 0);
});
