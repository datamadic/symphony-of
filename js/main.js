
/*
  core symphony API
*/

window.SYM_API = {
  Notification: Notify,
  ScreenSnippet,

  setBadgeCount(number) {
    const win = fin.desktop.Window.getCurrent();
    if (number > 0) {
      const n = number > 9 ? '9+' : number;
      win.updateOptions({ icon: `${window.targetUrl}icon/icon${n}.png` }, () => { win.flash(); }, () => { console.log('update options failed'); });
    } else {
      win.updateOptions({ icon: `${window.targetUrl}icon/symphony.png` });
    }
  },
  activate(windowName) {
    window.popouts = JSON.parse(window.localStorage.getItem('wins')) || {};
    const mainApp = fin.desktop.Application.getCurrent();
    if (windowName === 'main') {
      const mainWin = mainApp.getWindow();
      window.winFocus(mainWin);
    }
    for (const pop of Object.keys(window.popouts)) {
      if (window.popouts[pop].symName === windowName) {
        const popWin = fin.desktop.Window.wrap(mainApp.uuid, window.popouts[pop].name);
        window.winFocus(popWin);
      }
    }
  },
  // undoced
  registerLogger() {
  },
  registerBoundsChange(cb) {
    // fin.desktop.Application.getCurrent().addEventListener("window-created", obj => {
    //     if(obj.name !== obj.uuid && !obj.name.includes('Notifications') && obj.name !== 'queueCounter') {
    //         fin.desktop.Window.wrap(obj.uuid, obj.name).addEventListener("bounds-changed", win => {
    //             for (let pop of Object.keys(window.popouts)) {
    //                 if(window.popouts[pop].name === obj.name) {
    //                     window.popouts[pop] = Object.assign(window.popouts[pop], win)
    //                     if(cb) {
    //                         // Does this callback do anything? In the symphony API spec... (need to be )
    //                         cb({x:win.left,
    //                             y:win.top,
    //                             width:win.width,
    //                             height:win.height,
    //                             windowName:window.popouts[pop].symName
    //                         });
    //                     }
    //                 }
    //             }
    //             window.localStorage.setItem('wins', JSON.stringify(window.popouts));
    //         })
    //     }
    // });
  },
  getVersionInfo() {
    return new Promise((resolve, reject) => {
      // Where to keep version information?
      const version = {
        containerIdentifier: 'SymphonyOpenFin',
        containerVer: '0.0.3',
        apiVer: '1.0.0',
      };
      resolve(version);
    });
  },
};

window.ssf = window.SYM_API;
