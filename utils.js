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

(function(i,s,o,g,r,a,m){i['GoogleAnalyticsObject']=r;i[r]=i[r]||function(){(i[r].q=i[r].q||[]).push(arguments)},i[r].l=1*new Date();a=s.createElement(o),m=s.getElementsByTagName(o)[0];a.async=1;a.src=g;m.parentNode.insertBefore(a,m)})(window,document,'script','https://www.google-analytics.com/analytics.js','ga');

ga('create', 'UA-93698015-3', 'auto');

function sendGa(url) {
  ga('set', 'page', url);
  ga('send', 'pageview');
}
