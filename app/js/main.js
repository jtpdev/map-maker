var btnHideExplorer = document.getElementById('btn-hide-explorer');
var btnHideProperties = document.getElementById('btn-hide-properties');
var btnShowExplorer = document.getElementById('btn-show-explorer');
var btnShowProperties = document.getElementById('btn-show-properties');

var explorer = document.getElementById('explorer');
var hexplorer = document.getElementById('h-explorer');
var properties = document.getElementById('properties');
var hproperties = document.getElementById('h-properties');
var map = document.getElementById('map');

btnHideExplorer.addEventListener('click', event => {
    explorer.style.display = "none";
    hexplorer.style.display = "block";
    map.style.width = `${map.offsetWidth + 150}px`;
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
    map.style.width = `${map.offsetWidth + 150}px`;
});

btnShowProperties.addEventListener('click', event => {
    properties.style.display = "block";
    hproperties.style.display = "none";
    map.style.width = `${map.offsetWidth - 150}px`;
});