# Inkline: Styled Email Subjects

Chrome extension that styles email subject lines (and any text box) with Unicode: bold, italic, underline, strikethrough, double struck, squares, bubbles, script, fraktur, small caps, monospace, fullwidth. 17 styles, all free, no data collected.

## Features

- **Gmail subject button**: a 𝐁 button inside the subject field of every compose window. Select text, click, pick a style. No selection styles the whole subject.
- **Toggle and clear**: picking the same style again removes it; "Clear formatting" turns any styled text back to plain. Ctrl+Z works.
- **Mix styles**: underline and strikethrough stack on top of letter styles (bold + strikethrough).
- **Right-click menu everywhere**: select text in any text box on any site, right-click → "Inkline style". Password fields are skipped; in rich editors only the selected text changes.
- **Toolbar popup**: type text, see all 17 styles, click to copy.

## Files

| File | Role |
|---|---|
| `manifest.json` | MV3 manifest |
| `styles.js` | Style engine (character maps, apply, toggle, clear, field replace). Shared by every part |
| `content.js`, `content.css` | Gmail subject button and style menu |
| `background.js` | Right-click menu |
| `popup.html`, `popup.js`, `popup.css` | Toolbar popup |
| `icons/` | Extension icons (made by `tools/make_icons.py`) |
| `store/` | Store screenshots and promo tile (made by `tools/store-shots.js`) |
| `test/styles.test.js` | Engine tests |
| `PRIVACY.md` | Privacy policy to host publicly |
| `STORE_LISTING.md` | Every field of the Web Store form, ready to paste |

## Try it locally

1. Open `chrome://extensions`, turn on **Developer mode**.
2. **Load unpacked** → pick this folder.
3. Open Gmail, click **Compose**, type a subject, select a word, click the 𝐁 button.

## Test and build

```bash
node test/styles.test.js   # engine tests
./build.sh                 # runs the tests, then writes dist/inkline-<version>.zip
```

Regenerate assets (only if you change the design):

```bash
python3 tools/make_icons.py                       # needs Pillow
npm i -D playwright && node tools/store-shots.js  # screenshots + promo tile
```

## Publish to the Chrome Web Store

1. **Developer account**: register at https://chrome.google.com/webstore/devconsole (one-time USD 5 fee paid to Google). Verify your contact email in **Account**.
2. **Privacy policy**: hosted with GitHub Pages from the `gh-pages` branch at https://srabon444.github.io/inkline/. When `PRIVACY.md` changes, update `index.html` on `gh-pages` to match.
3. **Build**: `./build.sh` → `dist/inkline-1.0.0.zip`.
4. **Upload**: Developer Dashboard → **New item** → upload the zip.
5. **Fill the form** from `STORE_LISTING.md`: Store listing, Privacy practices (single purpose, permission justifications, data usage, privacy policy URL), Distribution.
6. **Upload images** from `icons/icon128.png` and `store/`.
7. **Submit for review**. Review usually takes a few days. Host permissions can lengthen it slightly.

### Updating later

Bump `version` in `manifest.json`, run `./build.sh`, upload the new zip on the item's **Package** tab, submit.

## Support

Open an issue at https://github.com/Srabon444/inkline/issues or email srabon444@gmail.com.

## License

[MIT](LICENSE) © 2026 MD Ashraful Islam

## Limits

- Styled text is Unicode, not real formatting: some screen readers read it letter by letter, and search inside the recipient's mailbox will not match the plain word. Keep key words plain where it matters.
- Not every letter style has digits (italic, script, fraktur, squares). Those characters stay plain.
- The right-click menu does nothing on password, email and number fields, when there is no selection in a rich editor, or when the result would exceed the field's length limit. This is on purpose; it shows no message.
- Squares and black bubbles have uppercase only; lowercase letters become uppercase. On some devices 🅰 🅱 🅾 🅿 show as colour emoji.
- The Gmail button relies on Gmail's `input[name="subjectbox"]`. If Gmail changes it, the right-click menu and popup still work.
