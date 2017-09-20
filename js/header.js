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