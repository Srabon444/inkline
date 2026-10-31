//* Adds the Inkline button inside Gmail's subject field.
(() => {
  const SUBJECT = 'input[name="subjectbox"]';
  let menu;
  let menuBtn;

  const closeMenu = () => {
    menu?.remove();
    menu = menuBtn = null;
  };

  //? Resolved on click, since Gmail may swap the input while keeping its parent.
  const inputOf = (btn) => btn.parentElement?.querySelector(SUBJECT);

  const openMenu = (btn, viaKeyboard) => {
    const same = menuBtn === btn;
    closeMenu();
    if (same) return;
    menuBtn = btn;
    menu = document.createElement('div');
    menu.className = 'inkline-menu';
    menu.setAttribute('role', 'menu');
    const items = [...Inkline.STYLES, { id: 'clear', name: 'Clear formatting' }];
    for (const s of items) {
      const item = document.createElement('button');
      item.type = 'button';
      item.className = 'inkline-item' + (s.id === 'clear' ? ' inkline-clear' : '');
      item.setAttribute('role', 'menuitem');
      item.title = s.name;
      item.textContent = s.id === 'clear' ? s.name : Inkline.apply(s.id, s.name);
      //! keep focus and selection in the subject field
      item.addEventListener('mousedown', (e) => e.preventDefault());
      item.addEventListener('click', () => {
        const input = inputOf(btn);
        closeMenu();
        if (input) Inkline.applyToField(s.id, input);
      });
      menu.append(item);
    }
    document.body.append(menu);
    const r = btn.getBoundingClientRect();
    const top = Math.min(r.bottom + 4, innerHeight - menu.offsetHeight - 8);
    menu.style.top = `${Math.max(8, top)}px`;
    menu.style.left = `${Math.max(8, r.right - menu.offsetWidth)}px`;
    menu.addEventListener('keydown', onMenuKey);
    if (viaKeyboard) menu.firstChild.focus();
  };

  const onMenuKey = (e) => {
    const items = [...menu.children];
    const i = items.indexOf(document.activeElement);
    if (e.key === 'ArrowDown' || e.key === 'ArrowUp') {
      e.preventDefault();
      items[(i + (e.key === 'ArrowDown' ? 1 : items.length - 1)) % items.length].focus();
    } else if (e.key === 'Tab') {
      e.preventDefault();
      const btn = menuBtn;
      closeMenu();
      btn.focus();
    }
  };

  const attach = (input) => {
    const host = input.parentElement;
    input.classList.add('inkline-input');
    if (!host || host.querySelector(':scope > .inkline-btn')) return;
    if (getComputedStyle(host).position === 'static') host.style.position = 'relative';
    const btn = document.createElement('button');
    btn.type = 'button';
    btn.className = 'inkline-btn';
    btn.title = 'Style subject (Inkline)';
    btn.setAttribute('aria-label', 'Style subject');
    btn.textContent = '𝐁';
    btn.addEventListener('mousedown', (e) => e.preventDefault());
    btn.addEventListener('click', (e) => {
      e.stopPropagation();
      openMenu(btn, e.detail === 0);
    });
    host.append(btn);
  };

  let queued = false;
  const scan = () => {
    queued = false;
    document.querySelectorAll(SUBJECT).forEach(attach);
  };
  //? Gmail builds compose windows on the fly; batch its frequent mutations into one scan per frame.
  new MutationObserver(() => queued || ((queued = true), requestAnimationFrame(scan))).observe(document.body, {
    childList: true,
    subtree: true,
  });
  scan();

  document.addEventListener('mousedown', (e) => menu && !e.target.closest?.('.inkline-menu, .inkline-btn') && closeMenu(), true);
  document.addEventListener(
    'keydown',
    (e) => {
      if (!menu || e.key !== 'Escape') return;
      e.stopPropagation(); //! otherwise Gmail also handles it and closes the compose window
      const input = inputOf(menuBtn);
      closeMenu();
      input?.focus();
    },
    true,
  );
  document.addEventListener('scroll', (e) => menu && !menu.contains(e.target) && closeMenu(), true);
  addEventListener('resize', closeMenu);
})();
