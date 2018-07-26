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

const inSrcSquare = document.getElementById('input-src-square');
const selectGroups = document.getElementById('select-group');

const cbAllColisors = document.getElementById('check-all-colisors');
const cbUpColisors = document.getElementById('check-up-colisors');
const cbRightColisors = document.getElementById('check-rigth-colisors');
const cbDownColisors = document.getElementById('check-down-colisors');
const cbLeftColisors = document.getElementById('check-left-colisors');

const btnDoneProperty = document.getElementById('btn-done-property');

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

    let mapHtml = `<div class="map-html" style="width: ${w + 5}px; height:${h + 5}px" >`
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