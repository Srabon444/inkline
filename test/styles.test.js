//* Run: node test/styles.test.js
const assert = require('node:assert/strict');
require('../styles.js');
const { STYLES, apply } = globalThis.Inkline;

const cases = {
  bold: ['2ND REQUEST', '𝟮𝗡𝗗 𝗥𝗘𝗤𝗨𝗘𝗦𝗧'],
  italic: ['Hi there', '𝘏𝘪 𝘵𝘩𝘦𝘳𝘦'],
  boldItalic: ['Sale', '𝙎𝙖𝙡𝙚'],
  underline: ['ab', 'a̲b̲'],
  doubleStruck: ['CHQ 1', 'ℂℍℚ 𝟙'],
  strike: ['$200', '$̶2̶0̶0̶'],
  whiteSquares: ['Ab', '🄰🄱'],
  blackSquares: ['Ok', '🅾🅺'],
  whiteBubbles: ['a1 0', 'ⓐ① ⓪'],
  blackBubbles: ['A9', '🅐❾'],
  serifBold: ['Go', '𝐆𝐨'],
  mono: ['id 7', '𝚒𝚍 𝟽'],
  script: ['Hello', 'ℋℯ𝓁𝓁ℴ'],
  boldScript: ['Hi', '𝓗𝓲'],
  fraktur: ['Rich', 'ℜ𝔦𝔠𝔥'],
  smallCaps: ['Hi box quiz', 'Hɪ ʙᴏx ǫᴜɪᴢ'],
  fullwidth: ['Hi 5!', 'Ｈｉ ５!'],
};

assert.equal(Object.keys(cases).length, STYLES.length, 'every style has a case');
for (const [id, [input, expected]] of Object.entries(cases)) {
  const out = apply(id, input);
  assert.equal(out, expected, `${id} applies`);
  assert.equal(apply('clear', out), input.replace(/[a-z]/g, (c) => (['whiteSquares', 'blackSquares', 'blackBubbles'].includes(id) ? c.toUpperCase() : c)), `${id} clears`);
}

//* Same style again toggles it off.
assert.equal(apply('bold', apply('bold', 'Deal 50')), 'Deal 50');
assert.equal(apply('underline', apply('underline', 'a b')), 'a b');
//* Switching letter style converts the letters instead of stacking styles.
assert.equal(apply('italic', apply('bold', 'Hey')), '𝘏𝘦𝘺');
//* Line styles stack on letter styles and survive a letter-style switch.
const boldStruck = apply('strike', apply('bold', 'Hi'));
assert.equal(boldStruck, '𝗛̶𝗶̶');
assert.equal(apply('italic', boldStruck), '𝘏̶𝘪̶');
assert.equal(apply('clear', apply('underline', boldStruck)), 'Hi');
//* Untouched: non-Latin text, emoji, empty input.
assert.equal(apply('bold', 'নমস্কার 👋'), 'নমস্কার 👋');
assert.equal(apply('bold', ''), '');
assert.throws(() => apply('nope', 'x'));
//* Real-world text the user did not style stays untouched.
assert.equal(apply('bold', '（株）重要，OK'), '（株）重要，𝗢𝗞');
assert.equal(apply('clear', '（株）'), '（株）');
//* Emoji sequences are never split.
assert.equal(apply('underline', 'Hi 👨‍👩‍👧'), 'H\u0332i\u0332 \u0332👨‍👩‍👧');
assert.equal(apply('bold', '1️⃣ tip'), '1️⃣ 𝘁𝗶𝗽');
assert.equal(apply('clear', apply('underline', '🇧🇩 go')), '🇧🇩 go');
//* Line marks go after a whole conjunct, not inside it.
assert.equal(apply('underline', 'স্কা'), 'স্কা\u0332');
//* Whitespace-only selection is left alone.
assert.equal(apply('underline', '   '), '   ');

console.log(`ok: ${STYLES.length} styles`);
