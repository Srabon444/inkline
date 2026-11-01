const text = document.getElementById('text');
const list = document.getElementById('list');

const render = () => {
  const value = text.value || 'Your subject line';
  list.replaceChildren(
    ...Inkline.STYLES.map((s) => {
      const li = document.createElement('li');
      const btn = document.createElement('button');
      btn.type = 'button';
      btn.title = `Copy ${s.name}`;
      const styled = Inkline.apply(s.id, value);
      const name = Object.assign(document.createElement('span'), { className: 'name', textContent: s.name });
      const out = Object.assign(document.createElement('span'), { className: 'out', textContent: styled });
      btn.append(name, out);
      btn.addEventListener('click', async () => {
        const ok = await navigator.clipboard.writeText(styled).then(() => true, () => false);
        btn.classList.toggle('copied', ok);
        name.textContent = ok ? 'Copied!' : 'Copy failed';
        setTimeout(() => {
          btn.classList.remove('copied');
          name.textContent = s.name;
        }, 1200);
      });
      li.append(btn);
      return li;
    }),
  );
};

text.addEventListener('input', render);
render();
