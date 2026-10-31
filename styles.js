//* Inkline style engine, shared by the content script, popup, service worker and injected scripts.
(() => {
  if (globalThis.Inkline) return; //! re-injection on every right-click must not redefine it

  const cp = (n) => String.fromCodePoint(n);
  const run = (from, count) => Array.from({ length: count }, (_, i) => cp(from + i));
  const UPPER = run(65, 26);
  const LOWER = run(97, 26);
  const DIGITS = run(48, 10);

  //* Builds a char map from Unicode block offsets; `lower` may equal `upper` for caps-only blocks.
  const block = ({ upper, lower, digits, extra = {} }) => {
    const map = {};
    if (upper) UPPER.forEach((c, i) => (map[c] = cp(upper + i)));
    if (lower) LOWER.forEach((c, i) => (map[c] = cp(lower + i)));
    if (typeof digits === 'number') DIGITS.forEach((c, i) => (map[c] = cp(digits + i)));
    else if (digits) DIGITS.forEach((c, i) => (map[c] = digits[i]));
    return Object.assign(map, extra);
  };

  const fromStrings = (pairs) => {
    const map = {};
    for (const [plain, styled] of pairs) Array.from(plain).forEach((c, i) => (map[c] = Array.from(styled)[i]));
    return map;
  };

  const STYLES = [
    { id: 'bold', name: 'Bold', map: block({ upper: 0x1d5d4, lower: 0x1d5ee, digits: 0x1d7ec }) },
    { id: 'italic', name: 'Italic', map: block({ upper: 0x1d608, lower: 0x1d622 }) },
    { id: 'boldItalic', name: 'Bold Italic', map: block({ upper: 0x1d63c, lower: 0x1d656, digits: 0x1d7ec }) },
    { id: 'underline', name: 'Underline', mark: '̲' },
    {
      id: 'doubleStruck',
      name: 'Double Struck',
      map: block({
        upper: 0x1d538,
        lower: 0x1d552,
        digits: 0x1d7d8,
        extra: { C: 'ℂ', H: 'ℍ', N: 'ℕ', P: 'ℙ', Q: 'ℚ', R: 'ℝ', Z: 'ℤ' },
      }),
    },
    { id: 'strike', name: 'Strikethrough', mark: '̶' },
    { id: 'whiteSquares', name: 'White Squares', map: block({ upper: 0x1f130, lower: 0x1f130 }) },
    { id: 'blackSquares', name: 'Black Squares', map: block({ upper: 0x1f170, lower: 0x1f170 }) },
    {
      id: 'whiteBubbles',
      name: 'White Bubbles',
      map: block({ upper: 0x24b6, lower: 0x24d0, digits: ['⓪', ...run(0x2460, 9)] }),
    },
    {
      id: 'blackBubbles',
      name: 'Black Bubbles',
      map: block({ upper: 0x1f150, lower: 0x1f150, digits: ['⓿', ...run(0x2776, 9)] }),
    },
    { id: 'serifBold', name: 'Serif Bold', map: block({ upper: 0x1d400, lower: 0x1d41a, digits: 0x1d7ce }) },
    { id: 'mono', name: 'Monospace', map: block({ upper: 0x1d670, lower: 0x1d68a, digits: 0x1d7f6 }) },
    {
      id: 'script',
      name: 'Script',
      map: block({
        upper: 0x1d49c,
        lower: 0x1d4b6,
        extra: { B: 'ℬ', E: 'ℰ', F: 'ℱ', H: 'ℋ', I: 'ℐ', L: 'ℒ', M: 'ℳ', R: 'ℛ', e: 'ℯ', g: 'ℊ', o: 'ℴ' },
      }),
    },
    { id: 'boldScript', name: 'Bold Script', map: block({ upper: 0x1d4d0, lower: 0x1d4ea }) },
    {
      id: 'fraktur',
      name: 'Fraktur',
      map: block({ upper: 0x1d504, lower: 0x1d51e, extra: { C: 'ℭ', H: 'ℌ', I: 'ℑ', R: 'ℜ', Z: 'ℨ' } }),
    },
    {
      id: 'smallCaps',
      name: 'Small Caps',
      //? q uses ǫ: the true small-cap q (U+A7AF) is missing from most system fonts and shows as a box.
      map: fromStrings([['abcdefghijklmnopqrstuvwxyz', 'ᴀʙᴄᴅᴇꜰɢʜɪᴊᴋʟᴍɴᴏᴘǫʀꜱᴛᴜᴠᴡxʏᴢ']]),
    },
    { id: 'fullwidth', name: 'Fullwidth', map: block({ upper: 0xff21, lower: 0xff41, digits: 0xff10 }) },
  ];

  const byId = Object.fromEntries(STYLES.map((s) => [s.id, s]));

  //* Reverse lookup for letters and digits only, so real punctuation like （，） is never rewritten.
  const plainOf = {};
  for (const s of STYLES)
    if (s.map)
      for (const [plain, styled] of Object.entries(s.map))
        if (plain !== styled && /^[A-Za-z0-9]$/.test(plain)) plainOf[styled] ??= plain;

  const MARKS = STYLES.filter((s) => s.mark).map((s) => s.mark);
  //? Grapheme clusters keep emoji sequences and Indic conjuncts (স্ক) whole.
  const segmenter = new Intl.Segmenter();
  const graphemes = (text) => Array.from(segmenter.segment(text), (g) => g.segment);
  //! Keycaps, ZWJ families, flags: restyling or marking them splits the emoji apart.
  const isEmoji = (g) =>
    !(Array.from(g)[0] in plainOf) && /[‍️⃣]|\p{Extended_Pictographic}|\p{Regional_Indicator}/u.test(g);
  const stripMarks = (g) => Array.from(g).filter((c) => !MARKS.includes(c)).join('');

  const clear = (text) =>
    graphemes(text)
      .map((g) => {
        if (isEmoji(g)) return g;
        const [base, ...rest] = Array.from(stripMarks(g));
        return base === undefined ? '' : (plainOf[base] ?? base) + rest.join('');
      })
      .join('');

  const withMark = (text, mark) => {
    const parts = graphemes(text);
    const visible = parts.filter((g) => !isEmoji(g) && !/^\s+$/u.test(g));
    if (!visible.length) return text;
    //? Applying the same line style twice toggles it off, like a word processor.
    const on = visible.every((g) => g.includes(mark));
    return parts.map((g) => (isEmoji(g) ? g : g.replaceAll(mark, '') + (on ? '' : mark))).join('');
  };

  const withMap = (text, map) =>
    graphemes(text)
      .map((g) => {
        if (isEmoji(g)) return g;
        const [base, ...rest] = Array.from(g);
        const plain = plainOf[base] ?? base;
        return (map[plain] ?? plain) + rest.join('');
      })
      .join('');

  const apply = (id, text) => {
    if (id === 'clear') return clear(text);
    const style = byId[id];
    if (!style) throw new Error(`Unknown style: ${id}`);
    if (style.mark) return withMark(text, style.mark);
    const out = withMap(text, style.map);
    //? Applying the same letter style twice toggles it off.
    return out === text ? withMap(text, {}) : out;
  };

  const deepActive = () => {
    let el = document.activeElement;
    while (el?.shadowRoot?.activeElement) el = el.shadowRoot.activeElement;
    return el;
  };

  //* Replaces the selection (or the whole value when nothing is selected) in the focused field.
  const applyToField = (id, el = deepActive()) => {
    if (!el) return false;
    if (el instanceof HTMLInputElement || el instanceof HTMLTextAreaElement) {
      if (el.type === 'password') return false; //! never rewrite a password
      el.focus();
      let { selectionStart: start, selectionEnd: end } = el;
      if (start == null) return false; //! input types like email/number have no selection API
      if (start === end) [start, end] = [0, el.value.length];
      const out = apply(id, el.value.slice(start, end));
      //! styled chars take 2 UTF-16 units; the browser would silently cut the end off
      if (el.maxLength > 0 && el.value.length - (end - start) + out.length > el.maxLength) return false;
      el.setSelectionRange(start, end);
      //? insertText keeps the browser undo stack and fires the input event the page listens to.
      if (!document.execCommand('insertText', false, out)) {
        el.setRangeText(out, start, end, 'end');
        el.dispatchEvent(new Event('input', { bubbles: true }));
      }
      el.setSelectionRange(start, start + out.length);
      return true;
    }
    if (el.isContentEditable) {
      const sel = getSelection();
      //! no select-all fallback here: insertText would flatten links, images and lists in a rich editor
      if (!sel.rangeCount || sel.isCollapsed) return false;
      return document.execCommand('insertText', false, apply(id, sel.toString()));
    }
    return false;
  };

  globalThis.Inkline = { STYLES, apply, applyToField };
})();
