const data = require('../../data');


const btnSaveMap = document.getElementById('btn-save-map');
const map = document.getElementById('map');

btnSaveMap.addEventListener('click', event => {
    // save map
    let mapWrapper = map.firstChild;
    if(mapWrapper) {
        let children = mapWrapper.childNodes;
        let map = {};
        data.getConfig().then(data => {
            map.config = data;
        });
        let sqMaps = [];
        for(let i = 0; i < children.length; i++) {
            let child = children[i];
            let src = child.firstChild.src;
            console.log(child)
            let sqMap = {
                id: child.id,
                s: child.style.h,
                square: src ? data.getSquares(src) : null
            };
            sqMaps.push(sqMap);
        }
        map.squares = sqMaps;
        data.saveMap(sqMaps);
    }
    
});