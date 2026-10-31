importScripts('styles.js');

chrome.runtime.onInstalled.addListener(() => {
  chrome.contextMenus.removeAll(() => {
    const contexts = ['editable'];
    chrome.contextMenus.create({ id: 'inkline', title: 'Inkline style', contexts });
    for (const s of Inkline.STYLES) {
      chrome.contextMenus.create({ id: s.id, parentId: 'inkline', title: `${s.name}   ${Inkline.apply(s.id, 'Abc')}`, contexts });
    }
    chrome.contextMenus.create({ id: 'sep', parentId: 'inkline', type: 'separator', contexts });
    chrome.contextMenus.create({ id: 'clear', parentId: 'inkline', title: 'Clear formatting', contexts });
  });
});

chrome.contextMenus.onClicked.addListener(async (info, tab) => {
  if (!tab?.id) return;
  const target = { tabId: tab.id, frameIds: [info.frameId] };
  try {
    await chrome.scripting.executeScript({ target, files: ['styles.js'] });
    await chrome.scripting.executeScript({ target, func: (id) => Inkline.applyToField(id), args: [info.menuItemId] });
  } catch (err) {
    //? Browser pages (chrome://, the Web Store) block scripts; nothing to style there.
    console.warn('Inkline: cannot style this field', err);
  }
});
