
/*
  core symphony API
*/

window.SYM_API = {
    Notification: Notify,
    ScreenSnippet,

    setBadgeCount:function(number) {
        let win = fin.desktop.Window.getCurrent();
        if (number > 0) {
            let n = number > 9 ? '9+' : number;
            win.updateOptions({ icon: `${window.targetUrl}icon/icon${n}.png` },() => {win.flash();},() => {console.log("update options failed");});
        } else {
            win.updateOptions({ icon: `${window.targetUrl}icon/symphony.png` });
        };
    },
    activate:function(windowName) {
        window.popouts = JSON.parse(window.localStorage.getItem('wins')) || {};        
        let mainApp = fin.desktop.Application.getCurrent();
        if(windowName === 'main') {
            let mainWin = mainApp.getWindow();
            window.winFocus(mainWin);
        }
        for (let pop of Object.keys(window.popouts)) {
            if(window.popouts[pop].symName === windowName) {
                let popWin = fin.desktop.Window.wrap(mainApp.uuid, window.popouts[pop].name);
                window.winFocus(popWin);
            }
        }
    },
    //undoced
    registerLogger:function() {
    },
    registerBoundsChange:function(cb) {
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
    getVersionInfo: function() {
        return new Promise((resolve, reject) => {
            // Where to keep version information?
            let version = {
                containerIdentifier: "SymphonyOpenFin",
                containerVer: window.symphonyOpenFinVersion,
                apiVer: "1.0.0"
            }
            resolve(version)
        })
    },
    registerProtocolHandler: function (protocolHandler) {
        // alert('mother fucker', typeof protocolHandler === 'function');
        if (typeof protocolHandler === 'function') {

            window.processProtocolAction = (...args) => {
                console.log('this was called', args);
                debugger;
                protocolHandler.apply(null, args);
            };
        }
    }
}

window.ssf = window.SYM_API;
window.get = function (url) {
    const req = new XMLHttpRequest();
    req.open('GET', url);
    req.addEventListener('load', res => {
        console.log(res.target.responseText);
    });
    req.send();
};

window.post = function (url, dta='') {
    const req = new XMLHttpRequest();
    req.open('POST', url);
    req.addEventListener('load', res => {
        console.log(res.target.responseText);
    });
    req.send(dta);
};

// get('https://openfin.symphony.com/pod/v2/sessioninfo') // this includes id
// get('https://openfin.symphony.com/pod/v2/user/presence')
// post('https://openfin.symphony.com/pod/v1/streams/list')


// jQuery21408167458558731262

// show user profile... processProtocolAction('symphony:?streamId=qACkrIadA&streamType=chatroom&userId=84524956385329')
// https://openfin.symphony.com/webcontroller/maestro/RoomManager?action=adduser&threadid=qACkrIadA%3D%3D%3D&userids=84524956385329


// opened external chat!!
// processProtocolAction('symphony:?streamId=nhYkv343RGvP1TBisje1Bn///p/3A6yvdA==&streamType=im&')


// get the popout element
// window.document.querySelectorAll('a.enhanced-pop-out')[0]