const data = require('../../data');


const btnSaveMap = document.getElementById('btn-save-map');
const map = document.getElementById('map');

btnSaveMap.addEventListener('click', event => {
    // save map
    let mapWrapper = map.firstChild;
    if (mapWrapper) {
        data.getConfig().then(config => {
            let children = mapWrapper.childNodes;
            let map = {
                config
            };
            let sqMaps = [];
            for (let i = 0; i < children.length; i++) {
                let child = children[i];
                let src = child.firstChild ? child.firstChild.src : null;
                console.log(child, child.firstChild, src)
                let sqMap = {
                    id: child.id,
                    src: src
                };
                sqMaps.push(sqMap);
            }
            map.squares = sqMaps;
            data.saveMap(map);
        });
    }

});