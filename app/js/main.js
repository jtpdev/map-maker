const data = require('../../data');
const dnd = require('./dnd');

const btnHideExplorer = document.getElementById('btn-hide-explorer');
const btnHideProperties = document.getElementById('btn-hide-properties');
const btnShowExplorer = document.getElementById('btn-show-explorer');
const btnShowProperties = document.getElementById('btn-show-properties');

const explorer = document.getElementById('explorer');
const hexplorer = document.getElementById('h-explorer');
const properties = document.getElementById('properties');
const hproperties = document.getElementById('h-properties');

const btnDoneConfig = document.getElementById('btn-done-config');
const cConfig = document.getElementById('c-config');
const rConfig = document.getElementById('r-config');
const sConfig = document.getElementById('size-config');

const map = document.getElementById('map');

const inImportAssets = document.getElementById('in-import-assets');

const assets = document.getElementById('assets');

const inGroupName = document.getElementById('group-name');
const btnAddGroup = document.getElementById('btn-add-group');
const ulGroups = document.getElementById('ul-groups');

window.onload = () => {
    data.getConfig()
        .then((data) => {
            if (data) {
                cConfig.value = data.c;
                rConfig.value = data.r;
                sConfig.value = data.s;
            } else {
                cConfig.value = 10;
                rConfig.value = 10;
                sConfig.value = 64;
            }
        }, err => {
            cConfig.value = 10;
            rConfig.value = 10;
            sConfig.value = 64;
        });
    data.showSquares(assets);
    data.getGroups().then(data => {
        data.forEach(g => {
            addGroup(g);
        });
    }, err => {
        data.saveGroup('default');
        console.log('No groups');
    });
    data.getMap().then(data => {
        // create squares by saved map;
        let config = data.config;
        let s = config.s
        let r = config.r;
        let c = config.c;
        let h = r * s;
        let w = c * s;

        let mapHtml = `<div class="map-html" id="map-wrapper" style="width: ${w + 5}px; height:${h + 5}px" >`
        for (let i = 0; i < r; i++) {
            for (let j = 0; j < c; j++) {
                let id = `m_${i}_${j}`;
                let square =
                    `<span style="width: ${s - 1}px; height:${s - 1}px; ${(i + 1) == r ? 'border-bottom: 1px solid;' : ''}${(j + 1) == c ? 'border-right: 1px solid;' : ''}" class="map-square" id="${id}">
                
            </span>`;
                mapHtml += square;
            }
        }
        mapHtml += '</div>';
        map.innerHTML = mapHtml;
        let maps = document.getElementsByClassName('map-square');
        for (let k = 0; k < maps.length; k++) {
            let m = maps[k];
            m.addEventListener('drop', event => dnd.drop(event));
            m.addEventListener('dragover', dnd.allowDrop);
            let sqImage = data.squares.filter(sq => sq.id == m.id)[0];
            if (sqImage.src) {
                m.innerHTML = '';
                var img = document.createElement('img');
                img.id = `img_${m.id}`;
                img.style.height = m.style.height;
                img.style.width = m.style.width;
                img.classList.add('img-on-square');
                img.title = sqImage.src;
                img.src = sqImage.src;
                img.draggable = true;
                img.addEventListener('dragstart', dnd.drag);
                m.appendChild(img);
            }
        }
    }, err => {
        console.log('No map');
    });
}

btnHideExplorer.addEventListener('click', event => {
    explorer.style.display = "none";
    hexplorer.style.display = "block";
    map.style.width = `${map.offsetWidth + 146}px`;
    map.style.left = '50px';
});

btnShowExplorer.addEventListener('click', event => {
    explorer.style.display = "block";
    hexplorer.style.display = "none";
    map.style.width = `${map.offsetWidth - 150}px`;
    map.style.left = '200px';
});

btnHideProperties.addEventListener('click', event => {
    properties.style.display = "none";
    hproperties.style.display = "block";
    map.style.width = `${map.offsetWidth + 146}px`;
});

btnShowProperties.addEventListener('click', event => {
    properties.style.display = "block";
    hproperties.style.display = "none";
    map.style.width = `${map.offsetWidth - 150}px`;
});

btnDoneConfig.addEventListener('click', event => {

    let c = Math.abs(cConfig.value);
    let r = Math.abs(rConfig.value);
    let s = Math.abs(Number(sConfig.value));
    s = s > 20 ? s : 20;

    // save config
    let config = {
        c,
        r,
        s
    };

    data.saveConfig(config);

    let h = r * s;
    let w = c * s;

    let mapHtml = `<div class="map-html" id="map-wrapper" style="width: ${w + 5}px; height:${h + 5}px" >`
    for (let i = 0; i < r; i++) {
        for (let j = 0; j < c; j++) {
            let id = `m_${i}_${j}`;
            let square =
                `<span style="width: ${s - 1}px; height:${s - 1}px; ${(i + 1) == r ? 'border-bottom: 1px solid;' : ''}${(j + 1) == c ? 'border-right: 1px solid;' : ''}" class="map-square" id="${id}">
                
            </span>`;
            mapHtml += square;
        }
    }
    mapHtml += '</div>';
    map.innerHTML = mapHtml;
    let maps = document.getElementsByClassName('map-square');
    for (let k = 0; k < maps.length; k++) {
        let m = maps[k];
        m.addEventListener('drop', event => dnd.drop(event));
        m.addEventListener('dragover', dnd.allowDrop);
    }
});

inImportAssets.addEventListener('change', event => {
    let squares = data.importAssets(inImportAssets.files, assets);
});

btnAddGroup.addEventListener('click', event => {
    let groupName = inGroupName.value;
    inGroupName.value = '';
    addGroup(groupName);
    data.saveGroup(groupName);
});

addGroup = groupName => {
    let li = document.createElement('li');

    let inp = document.createElement('input');
    inp.type = 'text';
    inp.value = groupName;
    inp.classList.add('in-group');

    inp.addEventListener('keyup', event => {
        if (event.key == 'd'
            && event.ctrlKey
            && event.target.value != 'default') {
            data.removeGroup(event.target.value);
            ulGroups.removeChild(li);
        }
        if (event.key == 's' && event.ctrlKey) {
            data.removeGroup(groupName).then(() => {
                data.saveGroup(event.target.value);
                groupName = event.target.value;
            });
        }
    });

    li.appendChild(inp);
    let children = ulGroups.childNodes;
    let hasGroup;
    for (let i = 0; i < children.length; i++) {
        if (children[i].innerText == groupName) {
            hasGroup = true;
        }
    }
    if (!hasGroup) {
        ulGroups.appendChild(li);
    }
}