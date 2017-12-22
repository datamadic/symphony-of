/* override window.open to fix name issue */
const originalOpen = window.open;
window.popouts = JSON.parse(window.localStorage.getItem('wins')) || {};

window.open = (...args) => {
  window.popouts = JSON.parse(window.localStorage.getItem('wins')) || {};
  const w = originalOpen.apply(this, args);
  // Try catch for cross domain safeguard
  if (!w.name.includes('Notifications') && w.name !== 'queueCounter' && args[1] !== 'main') {
    const stream = args[0].split('&')[1];
    if (stream) {
      const startIdx = stream.indexOf('=') + 1;
      const streamId = (startIdx > 5) ? stream.slice(startIdx) : 'inbox';
      const uuid = fin.desktop.Application.getCurrent().uuid;
      const namesObj = {
        name: w.name, symName: args[1], hide: false, uuid,
      };
      window.popouts[streamId] = window.popouts[streamId] ? Object.assign(window.popouts[streamId], namesObj) : namesObj;
      window.localStorage.setItem('wins', JSON.stringify(window.popouts));
    }

    try {
      w.name = args[1];
    } catch (e) {
      console.log(e);
    }
  }

  return w;
};

window.winFocus = (ofWin) => {
  ofWin.getState((state) => {
    if (state === 'minimized') {
      ofWin.restore(() => { ofWin.setAsForeground(); }, e => console.log(e));
    } else {
      ofWin.setAsForeground();
    }
  });
};
