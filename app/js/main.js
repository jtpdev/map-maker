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
    // save config
    let c = Math.abs(cConfig.value);
    let r = Math.abs(rConfig.value);
    let s = Math.abs(Number(sConfig.value));
    s = s > 20 ? s : 20;
    let h = r * s;
    let w = c * s;

    let mapHtml = `<div class="map-html" style="width: ${w+5}px; height:${h+5}px" >`
    for(let i = 0; i < r; i++) {
        for(let j = 0; j < c; j++) {
            let id = `m_${i}_${j}`;
            let square =
            `<span style="width: ${s-1}px; height:${s-1}px; ${(i+1) == r ? 'border-bottom: 1px solid;' : ''}${(j+1) == c ? 'border-right: 1px solid;' : ''}" class="map-square" id="${id}">
                
            </span>`;
            mapHtml += square;
        }
    }
    mapHtml += '</div>';
    map.innerHTML = mapHtml;
});