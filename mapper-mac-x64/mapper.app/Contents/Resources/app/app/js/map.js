const data = require('../../data');

const btnSaveMap = document.getElementById('btn-save-map');
const inPath = document.getElementById('in-path');
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
                let sqMap = {
                    id: child.id,
                    src: src
                };
                sqMaps.push(sqMap);
            }
            map.squares = sqMaps;
            data.saveMap(map).then(() => {
                alert('Map was saved!')
            });
        });
    }

});

inPath.addEventListener("change", event => data.export(event), false);

let copy = (srcDir, dstDir) => {
    let results = [];
    let list = fs.readdirSync(srcDir);
	let src, dst;
    list.forEach(function(file) {
        src = srcDir + '/' + file;
		dst = dstDir + '/' + file;
		//console.log(src);
        let stat = fs.statSync(src);
        if (stat && stat.isDirectory()) {
			try {
				console.log('creating dir: ' + dst);
				fs.mkdirSync(dst);
			} catch(e) {
				console.log('directory already exists: ' + dst);
			}
			results = results.concat(copy(src, dst));
		} else {
			try {
				console.log('copying file: ' + dst);
				//fs.createReadStream(src).pipe(fs.createWriteStream(dst));
				fs.writeFileSync(dst, fs.readFileSync(src));
			} catch(e) {
				console.log('could\'t copy file: ' + dst);
			}
			results.push(src);
		}
    });
    return results;
}
