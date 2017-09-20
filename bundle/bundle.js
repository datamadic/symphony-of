/* override window.open to fix name issue */
var originalOpen = window.open;
window.open = (...args) => {
   let w = originalOpen.apply(this, args);
    //Try catch for cross domain safeguard
    try {
       w.name = args[1];
     } catch (e) {
        console.log(e)
     }

     return w;
}
/*
* Class representing a Symphony notification
*/

class Notify {

    constructor(title,options){
        console.log("SSF Notify " + JSON.stringify(title) + JSON.stringify(options));
        let msg = options;
        msg.title =  title;
        let app = fin.desktop.Application.getCurrent();
        this.eventListeners = [];
        this.notification = new window.fin.desktop.Notification({
            url: "http://localhost:8080/notification.html",
            message: msg,
            onClick: () => {
                app.window.setAsForeground();
            }
        });
        this._data = options.data || null;
    }

    static get permission(){
        return "granted";
    }

    get data(){
        return this.data;
    }

    close(cb) {
        // This gets called immediately on a new notification...so commented out for now. 
        // this.notification.close(cb)
    }

    addEventListener(event, cb) {
        console.log('SSF Notify Event Listener', event, cb);
        // Utilize the OF notification object to accomplish
        this.eventListeners.push(event)

        if(event === 'click') {
            // this.notification.noteWin.onClick = cb
        } else if(event === 'close') {
            this.notification.noteWin.onClose = cb
        } else if(event === 'error') {
            this.notification.noteWin.onError = cb
            console.log(this.notification.noteWin.onError)
        }
    }

    removeEventListener(event, cb){
        console.log('SSF Notify Event Listener Removed', event, cb);
        if(event === 'click') {
            this.notification.noteWin.onClick = () => {};
        } else if(event === 'close') {
            this.notification.noteWin.onClose = () => {};
        } else if(event === 'error') {
            this.notification.noteWin.onError = () => {};
        }
    }

    removeAllEvents(){
        while(this.eventListeners.length) {
            removeEventListener(this.eventListeners.pop());
        }
    }

    destroy(){
        // How is this different from close?
    }
}/*
* Class representing a Symphony screen snippet
*/

let holdChrome = chrome;

class ScreenSnippet {
    constructor() {
        this.id = Math.floor(Math.random()*10000);
        this.snippetData = new Promise(resolve => {
            fin.desktop.InterApplicationBus.subscribe('*', 'snippet' + this.id, msg => {
                resolve(msg);
            });
        });
    }

    capture() {             
        function getPort() {
            return new Promise((resolve, reject) => {
                holdChrome.desktop.getDetails(d => resolve(d.port));
            });
        }

        function launchSnippetTool(port, id) {
            return new Promise((resolve, reject) => {
                fin.desktop.System.launchExternalProcess({
                    alias: 'ScreenSnippet',
                    arguments: port + ' OpenFin-Symphony-udbrf2z9sehilik9 snippet' + id,
                    lifetime: 'window'
                }, () => {
                    resolve()
                }, (reason, error) => reject(reason, error));
            });
        };

        return getPort()
        .then(port => launchSnippetTool(port, this.id))
        .then(() => this.snippetData)
        .then(data => {
            return { type: 'image/jpg;base64', data }
        })
        .catch((reason, err) => console.log(reason, err));
    }
}
/* document.addEventListener("DOMContentLoaded", event => {
    
    // SET BODY MARGIN OR TOP
    // document.body.style.setProperty('margin-top', '25px', 'important')
    // setTimeout(()=> {
    //     if(document.getElementById('authentication')) {
    //         document.body.style.setProperty('margin-top', '25px', 'important')
    //     } else {
    //         setTimeout(()=> {
    //             document.body.style.setProperty('margin-top', '25px', 'important')
    //         }, 3000)
    //         // setInterval(()=> {
    //         //     document.body.style['margin-top'] = null;
    //         //     document.body.style['margin-top'] = '25px';
    //         // }, 3000)
    //     }
    // }, 2000)

    

    // // PUT IN CONTAINER
    // let topMargin = document.createElement('div')
    // topMargin.style.position = 'relative';
    // document.body.insertBefore(topMargin, document.body.firstChild);
    // setInterval(()=> {
    //     while (document.body.children[2]) {
    //         topMargin.appendChild(document.body.children[2])
    //     }
    // },2000)



    // ADD PIXELS TO EACH ELEMENT
    // let container = document.createElement('div');
    // document.body.insertBefore(container, document.body.firstChild);

    // setInterval(()=> {
    //     while (document.body.children[2]) {
    //         let node = document.body.children[2];
    //         if(node.style && node.style.top) {
    //             let pixels = +node.style.top.slice(0,-2) + 25;
    //             console.log('changinge top pix of this id:', node.id, ' to this px', pixels)
    //             node.style.top = pixels + 'px'
    //         }
    //         container.appendChild(node)
    //     }
    // }, 2000)



 
    // // CREATE CHILD WINDOW HEADER
    // const createheader = (bounds) => {

    //     console.log('bounds', bounds);

    //     var header = new fin.desktop.Window({
    //         name: 'OF-Symphony-Header',
    //         url: 'http://localhost:8080/header.html',
    //         defaultWidth: bounds.width,
    //         minWidth: bounds.width,
    //         defaultHeight: 25,
    //         maxHeight: 25,
    //         defaultLeft: bounds.left,
    //         defaultTop: bounds.top - 25,
    //         frame: false,
    //         resize: true,
    //         windowState: 'normal',
    //         autoShow: true,
    //         saveWindowState: false,
    //     }, function() {
    //         header.joinGroup(parent)
    //     });
    //     return header;
    // }

    // let parent = fin.desktop.Window.getCurrent();
    // let bounds; 
    // setTimeout(() => {
    //     parent.getBounds(b => {
    //         createheader(b);
    //      });
    // },2000)



    // PRELOAD HEADER
    let header = document.createElement('div')
    header.id = 'shadowHeader'
    // HOW TO USE SHADOWDOM?
    , root = header.createShadowRoot() 
    , div = document.createElement('div')
    , head = document.head
    , style = document.createElement('style')
    // , font = document.createElement('script')
    // , font = document.createElement('link')
    , jsFunctions = document.createElement('script');

    // IMPORT AWESOMEFONT ICONS
    // font.src = "https://use.fontawesome.com/009740555a.js";
    // font.href = "https://use.fontawesome.com/009740555a.js";
    // font.rel = 'stylesheet';
    // font.type='text/css';
    
    // SETUP HEADER CSS
    style.innerHTML = `
        .header {
            width: 100%;
            height: 25px;
            min-height: 25px;
            display: flex;
            align-content: center;
            vertical-align: middle;
            background: #DEE3E8;
            background-position: 6px 1px;
            -webkit-app-region: drag;
        }
        .header-title{
            padding: 0px 4px;
            vertical-align: middle;
            -webkit-app-region: no-drag
        }
        .openfin-chrome__header-controls-container {
            -webkit-app-region: drag;        
        }
        .openfin-chrome__header-controls {
            -webkit-app-region: no-drag;
            list-style: none;
            position: absolute;
            right: 8px;
            padding-left: 0;
            margin: 6px 0;
        }
        .openfin-chrome__header-control {
            display: inline-block;
            cursor: pointer;
            line-height: 25px;
            padding: 0 4px;
        }
        .icon{
            color: #3B3C3A;
            font-size: 14px;
        }
        #minus {
            font-family: FontAwesome;
            content: "\f024";
        }
    `
    // SETUP HEADER HTML
    div.innerHTML= // FOR SHADOW RENAME TO div (else header)
    `        
        <div class="header">
            <span class="header-title">
                <img src="http://localhost:8080/symphony.png" height="25">
            </span>
            <div class="openfin-chrome__header-controls-container">
                <ul class="openfin-chrome__header-controls">
                    <li class="openfin-chrome__header-control">
                        <a onclick="fin.desktop.Window.getCurrent().minimize()"><img src="http://localhost:8080/icon/minimize.png" height="14px"></a>
                    </li>
                    <li class="openfin-chrome__header-control">
                        <a id="maxOrRestore" onclick="maximizeOrRestore(this)"><img src="http://localhost:8080/icon/maximize.png" height="14px"></a>
                    </li>
                    <li class="openfin-chrome__header-control openfin-chrome__header-control--close">
                        <a onclick="fin.desktop.Application.getCurrent().close()"><img src="http://localhost:8080/icon/close.png" height="14px"></a>
                    </li>
                </ul>
            </div>
        </div>

    `
    
    // SETUP JAVASCRIPT FOR HEADER
    jsFunctions.innerHTML = `
        let win = fin.desktop.Window.getCurrent();
        let app = fin.desktop.Application.getCurrent();
        let maximized = false;
        setTimeout(()=> {win.getState(state => {
            console.log(state)
            if (state === 'maximized') {
                let iconToChange = document.getElementById('shadowHeader').shadowRoot.querySelector('#maxOrRestore');            
                iconToChange.innerHTML = '<img src="http://localhost:8080/icon/restore.png" height="14px">'
                maximized = true;
            }
        })},1000) 
        const maximizeOrRestore = iconToChange => {
            let max = false; 
            win.getState(state => {
                console.log(state)
                if (state === 'maximized') {
                    max = true
                }
                console.log('max', max);
                max ? win.restore() : win.maximize();
                iconToChange.innerHTML = max ? '<img src="http://localhost:8080/icon/maximize.png" height="14px">' : '<img src="http://localhost:8080/icon/restore.png" height="14px">'
            })
        }    
    `
    
    // INJECT INTO THE PAGE
    // root.appendChild(font);
    root.appendChild(style);
    root.appendChild(jsFunctions);
    root.appendChild(div);
    document.body.insertBefore(header, document.body.firstChild);
}); */
/*
  core symphony API
*/
// document.addEventListener("DOMContentLoaded", event => {
//     console.log("DOM fully loaded and parsed");
//     let header = document.createElement('link');
//     header.rel = 'import';
//     header.href = 'http://localhost:8080/header.html';
//     document.body.insertBefore(header, document.body.firstChild);
// });

// document.addEventListener("DOMContentLoaded", event => {
//     console.log("DOM fully loaded and parsed");
//     let header = document.createElement('div');
//     header.innerHTML='<object type="text/html" data="http://localhost:8080/header.html" ></object>'
//     document.body.insertBefore(header, document.body.firstChild);
// });


// document.addEventListener("DOMContentLoaded", event => {
//     console.log("DOM fully loaded and parsed");
//     let iFrame = document.getElementById('iFrame');
//     iFrame.src = 'https://my.symphony.com';
// });


window.SYM_API = {
    Notification:Notify,
    ScreenSnippet,
    
    setBadgeCount:function(number) {
        console.log("SSF Badgecount " + number);
        let win = fin.desktop.Window.getCurrent();      
        if (number > 0) {
            number = number > 9 ? '9+' : number;            
            win.updateOptions({ icon: 'http://localhost:8080/icon/icon' + number + '.png' });
            win.flash();
        } else {
            win.updateOptions({ icon: 'http://localhost:8080/symphony-symbol.png' });            
        };
    },
    activate:function() {
        console.log("SSF Activate!");
        fin.desktop.Window.getCurrent().bringToFront();
    },
    //undoced
    registerLogger:function() {
        console.log("SSF registerLogger!!");
    },
    registerBoundsChange:function(callback) {
        console.log("SSF boundschange!")
        let cb = callback;
        fin.desktop.Window.getCurrent().addEventListener("bounds-changed", obj => {
        cb({x:obj.left,
            y:obj.top,
            width:obj.width,
            height:obj.height,
            windowName:obj.name});
        })
    },
    getVersionInfo: function() {
        return new Promise((resolve, reject) => {
            // Where to keep version information?
            let version = {
                containerIdentifier: "SymphonyOpenFin",
                containerVer: "0.0.1",
                apiVer: "1.0.0"
            }
            resolve(version)
        })
    }
}

window.ssf = window.SYM_API;
window.ssf.activate();
