# Chrome Web Store listing: copy-paste fields

## Store listing tab

**Name** (from manifest): Inkline: Styled Email Subjects

**Summary** (from manifest, max 132 chars):
Make email subject lines stand out with bold, italic, underline, strikethrough, bubbles and more. Free, no account.

**Category:** Communication (alternative: Tools)

**Language:** English

**Description:**

```
Make your emails the ones people open.

Inkline lets you style email subject lines with 𝗯𝗼𝗹𝗱, 𝘪𝘵𝘢𝘭𝘪𝘤, u̲n̲d̲e̲r̲l̲i̲n̲e̲, s̶t̶r̶i̶k̶e̶t̶h̶r̶o̶u̶g̶h̶, ⓑⓤⓑⓑⓛⓔⓢ and more, right inside Gmail. Every feature is free. No account, no sign-up, no tracking.

★ HOW IT WORKS
1. Open a new email in Gmail.
2. Select the words you want to style in the subject line.
3. Click the 𝐁 button on the right side of the subject field.
4. Pick a style. Done.

Nothing selected? Inkline styles the whole subject. Pick the same style again to switch it off, or choose "Clear formatting" to go back to plain text. Ctrl+Z undoes any change.

★ 17 STYLES
• 𝗕𝗼𝗹𝗱
• 𝘐𝘵𝘢𝘭𝘪𝘤
• 𝘽𝙤𝙡𝙙 𝙄𝙩𝙖𝙡𝙞𝙘
• U̲n̲d̲e̲r̲l̲i̲n̲e̲
• 𝔻𝕠𝕦𝕓𝕝𝕖 𝕊𝕥𝕣𝕦𝕔𝕜
• S̶t̶r̶i̶k̶e̶t̶h̶r̶o̶u̶g̶h̶
• 🅆🄷🄸🅃🄴 🅂🅀🅄🄰🅁🄴🅂
• 🅱🅻🅰🅲🅺 🆂🆀🆄🅰🆁🅴🆂
• Ⓦⓗⓘⓣⓔ Ⓑⓤⓑⓑⓛⓔⓢ
• 🅑🅛🅐🅒🅚 🅑🅤🅑🅑🅛🅔🅢
• 𝐒𝐞𝐫𝐢𝐟 𝐁𝐨𝐥𝐝
• 𝙼𝚘𝚗𝚘𝚜𝚙𝚊𝚌𝚎
• 𝒮𝒸𝓇𝒾𝓅𝓉
• 𝓑𝓸𝓵𝓭 𝓢𝓬𝓻𝓲𝓹𝓽
• 𝔉𝔯𝔞𝔨𝔱𝔲𝔯
• Sᴍᴀʟʟ Cᴀᴘꜱ
• Ｆｕｌｌｗｉｄｔｈ

Mix them: make a word bold and strike through a price, like "Holiday gift (was $2̶0̶0̶, now $𝟭𝟬)".

★ WORKS BEYOND GMAIL
Select text in any text box on any website, right-click and choose "Inkline style". Great for other webmail, social posts and forms.

★ QUICK COPY FROM THE TOOLBAR
Click the Inkline icon, type your text, and see it in every style. Click one to copy it, then paste it anywhere.

★ GREAT FOR
• Sales follow-ups that need a reply
• Newsletters and promotions
• Urgent requests and deadlines
• Anyone who wants their email noticed

★ PRIVATE BY DESIGN
Inkline runs entirely in your browser. It has no servers, collects no data and never sends your text anywhere.

Good to know: styled text uses Unicode characters, so it shows up everywhere without any extra software. Some screen readers read these characters letter by letter, so keep key information in plain text too.

Gmail is a trademark of Google LLC. Inkline is not affiliated with or endorsed by Google.
```

**Graphic assets** (all in `store/`):
- Store icon: `icons/icon128.png`
- Screenshots (1280x800): `store/screenshot-1.png`, `store/screenshot-2.png`, `store/screenshot-3.png`
- Small promo tile (440x280): `store/promo-small-440x280.png`

**Official URL:** none
**Homepage URL:** https://github.com/Srabon444/inkline
**Support URL:** https://github.com/Srabon444/inkline/issues

## Privacy practices tab

**Single purpose description:**

```
Inkline styles the text of email subject lines and other text fields (bold, italic, underline, strikethrough and similar) by replacing letters with Unicode characters, so the text keeps its style wherever it is shown.
```

**Permission justifications:**

| Permission | Justification |
|---|---|
| contextMenus | Adds an "Inkline style" item to the right-click menu of editable text fields so users can style text outside Gmail. |
| activeTab | When the user picks a style from the right-click menu, Inkline needs temporary access to that tab to restyle the selected text in the field the user clicked. |
| scripting | Injects the styling code into the text field the user right-clicked, only after the user picks a style. |
| Host permission (https://mail.google.com/*) | A content script adds the style button to the subject field of the Gmail compose window. It reads and changes only the subject text the user chooses to style. |

**Remote code:** No, I am not using remote code. (All code is in the package.)

**Data usage:** Google counts on-device processing as handling data, so tick these two types:
- **Personal communications**: the Gmail subject text the user chooses to style is read and rewritten on the device.
- **Website content**: the text the user selects in a text box on other sites is read and rewritten on the device.

Leave every other type unticked. Then tick all three certifications:
- I do not sell or transfer user data to third parties, outside of the approved use cases
- I do not use or transfer user data for purposes that are unrelated to my item's single purpose
- I do not use or transfer user data to determine creditworthiness or for lending purposes

**Privacy policy URL:** https://srabon444.github.io/inkline/

## Distribution tab

- Trader status (Account tab): Non-trader
- Pricing: Free
- Visibility: Public
- Regions: All regions
