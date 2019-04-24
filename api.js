const api = {
  base: 'https://api.dateideassg.com',
  gothereurl: 'https://gothere.sg/a/otto?q=',
  gproxy: 'https://gproxy.glitch.me/go?q=',
  send(api, resolve, reject, body, tkn, isGothere) {
    const xhr = new XMLHttpRequest();
    if (!isGothere) {
      if (body) {
        xhr.open('POST', this.base + api);
        xhr.setRequestHeader('Content-Type', 'application/json');
      } else {
        xhr.open('GET', this.base + api);
      }
      if (tkn) {
        xhr.setRequestHeader('Authorization', `Bearer ${tkn}`);
      } else if (store.state.dideas_tkn) {
        xhr.setRequestHeader('Authorization', `Bearer ${store.state.dideas_tkn}`);
      }
    } else {
      xhr.open('GET', api);
    }

    xhr.onreadystatechange = function () {
      if (xhr.readyState === 4) {
        if (isGothere) {
          return this.response ? resolve(this.response)
            : reject(this.response);
        }
        const obj = JSON.parse(this.response);
        return obj.ok ? resolve(obj)
          : (reject || console.log)(obj);
      }
    };

    xhr.send(JSON.stringify(body));
  },

  // sms //
  isVerified(func) {
    this.send('/user/activated', func);
  },
  isNumValid(num, func, err) {
    this.send(`/user/valid?num=${num}`, func, err);
  },
  sendSms(num, func, err) {
    this.send(`/user/sms1?num=${num}`, func, err);
  },
  resendSms(func, err) {
    this.send('/user/sms1', func, err);
  },
  sendCode(code, func, err) {
    this.send(`/user/sms2?code=${code}`, func, err);
  },

  // dideas //
  getList(func, err) {
    this.send('/list', func, err);
  },
  getMore(time, func) {
    this.send(`/list?next=${time}`, func);
  },

  // saves //
  getSaved(pid, func) {
    this.send(`/saved?pid=${pid}`, func);
  },
  getSaves(func, err) {
    this.send('/saves', func, err);
  },
  setSave(state, pid, func, err) {
    this.send(`/save?state=${state}&pid=${pid}`, func, err);
  },

  // login //
  login(tkn, func) {
    this.send('/login', func, () => {}, null, tkn);
  },
  logout() {
    this.send('/logout', () => {}, msg => alert(msg.body));
  },

  // search //
  searchLocation(lon, lat, func, err) {
    this.send(`/near?lat=${lat}&lon=${lon}&range=5`, func, err);
  },
  searchLocationRange(lon, lat, range, func, err) {
    this.send(`/near?lat=${lat}&lon=${lon}&range=${range}`, func, err);
  },
  searchLocationTerm(term, func, err) {
    this.send(`/near?q=${encodeURIComponent(term)}&range=5`, func, err);
  },
  searchGetAutoComp(term, func, err) {
    const url = this.gproxy + encodeURIComponent(this.gothereurl + term);
    this.send(url, func, err, null, null, true);
  },

  // admin dideas info //
  isValid(id) {
    this.send(`/dideas/valid?id=${id}`);
  },
  getDrafts(func) {
    this.send('/dideas/drafts', func);
  },
  getPublished(func) {
    this.send('/dideas/list', func);
  },
  getSearch(id) {
    this.send(`/dideas/search?q=${id}`);
  },

  // admin update dideas details //
  addLocation(id, loc, func, err) {
    this.send(`/location/add?id=${id}&lon=${loc.lon}&lat=${
      loc.lat}&url=${loc.url}&text=${encodeURIComponent(loc.text)}`, func, err);
  },
  editLocation(loc, func, err) {
    this.send(`/location/edit?lid=${loc.lid}&lon=${loc.lon}&lat=${
      loc.lat}&url=${loc.url}&text=${encodeURIComponent(loc.text)}`, func, err);
  },
  removeLocation(lid, func, err) {
    this.send(`/location/rm?lid=${lid}`, func, err);
  },
  putDetails(func, err, body, override) {
    const query = (override ? `?override=${override}` : '');
    return this.send(`/dideas/new${query}`, func, err, body);
  },
  getDetails(id, func) {
    this.send(`/dideas/content?id=${id}`, func);
  },

  // admin editing state of pages //
  publish(id, func, err, unpublish) {
    this.send(`/dideas/publish?id=${id}${unpublish ? '&tstamp=null' : ''}`,
      func, err, { id });
  },
  deleteIdea(id, func, err) {
    this.send(`/dideas/delete?id=${id}`, func, err, { id });
  },

  // admin generate pages //
  updatePages(func, err) {
    this.send('/dideas/update', func, err);
  },
  updateAll(func, err) {
    this.send('/dideas/updateAll', func, err);
  },

  // admin user endpoints
  getAdmins(func, err) {
    this.send('/admin/list', func, err);
  },
  addAdmin(admin, func, err) {
    this.send(`/admin/add?uid=${admin.uid}&name=${admin.name}`, func, err);
  },
  removeAdmin(uid, func, err) {
    this.send(`/admin/rm?uid=${uid}`, func, err);
  },
  getVersion(func) {
    this.send('/admin/version', func);
  },
};
