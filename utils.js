$ = x => document.getElementById(x);
$$ = (x, e) => [...(e || document).getElementsByClassName(x)];
_ = (e) => {
  e.$$ = x => $$(x, e);
  return e;
};

autoNav = l => $$('header__link')
  .filter(e => e.href.endsWith(l))
  .forEach((t) => {
    const activeClass = ' header__link--active';
    $$('header__link').forEach((o) => {
      o.className = o.className.replace(activeClass, '');
    });
    t.className += activeClass;
  });

toggleMenu = (show = true) => {
  const id = 'header__content';
  const div = $$(id)[0];

  if (div.className.indexOf(`${id}--active`) == -1 && show) {
    div.className += ` ${id}--active`;
  } else {
    div.className = div.className.replace(`${id}--active`, '');
  }
};

comps = {
  load: (x) => {
    if (!comps[x]) {
      comps[x] = {};
    }
    comps[x].template = `<div id="${x}">${$(x).innerHTML}</div>`;
  },

  update: (x, obj) => {
    if (!comps[x]) {
      comps[x] = obj;
    } else {
      Object.keys(obj).forEach(key => {
        comps[x][key] = obj[key];
      });
    }
  },
};

const ga = {
  'v': '1',
  't': 'pageview',
  'tid': 'UA-93698015-3'
};

function sendGa(url) {
  let req = 'https://www.google-analytics.com/collect?';
  ga['cid'] = ga['uid'];

  Object.keys(ga).forEach(key => {
    req += `${key}=${encodeURIComponent(ga[key])}&`
  });
  req += `dp=${encodeURIComponent(url)}`;

  // NOTE: backup in case adblocks
  let req2 = `//gproxy.glitch.me/go?tid=${ga.tid}&q=${encodeURIComponent(req)}`;

  if (window.fetch) {
    fetch(req).catch(() => fetch(req2));
  } else {
    let xhr = new XMLHttpRequest();
    xhr.onreadystatechange = () => {
      if (xhr.readyState == 4 && xhr.status != 200) {
        let xhr2 = new XMLHttpRequest();
        xhr2.open(req2); xhr2.send();
      }
    };
    xhr.open('GET', req); xhr.send();
  }
}

document.onload = () => {
  [].slice.call(document.querySelectorAll('#v-page a'))
    .forEach(x => {
      x.onclick = () => sendGa(x.href);
    });

  sendGa(window.location.pathname);
};
