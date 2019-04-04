const webAuth = new auth0.WebAuth({
  domain: 'ongspxm.auth0.com',
  clientID: 'U5LYZTWEZGOIoIwng2byGTSB7KeVFzQK',
  responseType: 'token id_token',
  audience: 'https://ongspxm.auth0.com/userinfo',
  scope: 'openid profile',
  redirectUri: window.location.href,
});

function auth0_login() {
  webAuth.authorize();
}

function auth0_handle() {
  webAuth.parseHash((err, authResult) => {
    if (authResult && authResult.accessToken && authResult.idToken) {
      webAuth.client.userInfo(authResult.accessToken, (err, user) => {
        store.dispatch('setUser', { user, atkn: authResult.idToken });
      });
    } else if (err) {
      console.warn(err);
    }
    router.push('/');
  });
}

function auth0_logout() {
  if (confirm('Are you sure you want to logout?')) {
    api.logout();
    store.dispatch('clearUser');
    router.replace('/');
  }
}
