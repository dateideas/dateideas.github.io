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
};
