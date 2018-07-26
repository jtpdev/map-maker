const jsonfile = require('jsonfile-promised');
const fs = require('fs');

module.exports = {
    saveConfig(config) {
        let file = __dirname + '/temp/config.json';
        if (fs.existsSync(file)) {
            this.add(file, config);
        } else {
            this.create(file, {
                c: 10,
                r: 10,
                s: 64
            }).then(() => {
                this.add(file, config);
            })
        }
    },

    add(file, data) {
       return jsonfile.writeFile(file, data, { spaces: 2 })
            .then(() => {
                console.log('added');
            }).catch((err) => {
                console.log(err);
            });
    },

    create(file, conteudoArquivo) {
        return jsonfile.writeFile(file, conteudoArquivo)
            .then(() => {
                console.log('created');
            }).catch((err) => {
                console.log(err);
            });
    },

    getConfig() {
        let file = __dirname + '/temp/config.json';
        return jsonfile.readFile(file);
    },

    importAssets(images, assets) {
        let assetsFolder = __dirname + '/temp/assets/';
        let wrs = [];
        for (let i = 0; i < images.length; i++) {
            let img = images[i];
            let newFile = assetsFolder + img.name;
            let wr = fs.createReadStream(img.path)
                .pipe(fs.createWriteStream(newFile));
            wrs.push(wr);
        }
        setTimeout(() => {
            fs.readdir(assetsFolder, (err, files) => {
                let lAssets = [];
                files.forEach(file => {
                    let asset = {
                        src: file,
                        groups: [
                            {
                                title: "default",
                                colisor: {
                                    up: true,
                                    right: true,
                                    down: true,
                                    left: true,
                                }
                            }
                        ]
                    }
                    lAssets.push(asset);
                });
                this.saveSquares(lAssets, assets);
            })
        }, 1000 * images.length);
    },
    showSquares(assets) {
        let assetsFolder = __dirname + '/temp/assets/';
        let htmlSquares = '';
        this.getSquares().then(data => {
            data.forEach(s => {
                htmlSquares += `<img class="img-square" src="${assetsFolder + s.src}" title="${s.src}" id="${s.src}"/>`;
            }, err => {
                console.log(err)
            });
            assets.innerHTML = htmlSquares;
        }, err => {
            console.log('No file to read!')
        });
    },
    saveSquares(squares, assets) {
        let showSquares = () => {
            this.showSquares(assets);
        };
        let file = __dirname + '/temp/squares.json';
        if (fs.existsSync(file)) {
            this.add(file, squares).then(showSquares) ;
        } else {
            this.create(file, []).then(() => {
                this.add(file, squares).then(showSquares);
            })
        }
    },
    getSquares() {
        let file = __dirname + '/temp/squares.json';
        return jsonfile.readFile(file);
    }

}