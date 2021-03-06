const jsonfile = require('jsonfile-promised');
const fs = require('fs');
const dnd = require('./app/js/dnd');
const ncp = require('ncp').ncp;

ncp.limit = 16;

const inSrcSquare = document.getElementById('input-src-square');
const selectGroups = document.getElementById('select-group');

const cbAllColisors = document.getElementById('check-all-colisors');
const cbUpColisors = document.getElementById('check-up-colisors');
const cbRightColisors = document.getElementById('check-rigth-colisors');
const cbDownColisors = document.getElementById('check-down-colisors');
const cbLeftColisors = document.getElementById('check-left-colisors');

const btnDoneProperty = document.getElementById('btn-done-property');

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

    saveMap(map) {
        let file = __dirname + '/temp/map.json';
        if (fs.existsSync(file)) {
            return this.add(file, map);
        } else {
            return this.create(file, []).then(() => {
                return this.add(file, map);
            })
        }
    },
    
    getMap() {
        let file = __dirname + '/temp/map.json';
        return jsonfile.readFile(file);
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
                                colisors: {
                                    up: false,
                                    right: false,
                                    down: false,
                                    left: false,
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

        this.getSquares().then(data => {
            data.forEach(s => {
                let imgSquare = document.createElement('img');
                imgSquare.src = assetsFolder + s.src;
                imgSquare.title = s.src;
                imgSquare.id = s.src;
                imgSquare.classList.add('img-square');
                imgSquare.draggable = true;
                if (assets) {
                    assets.appendChild(imgSquare);
                }
                imgSquare.addEventListener('dragstart', dnd.drag);

                imgSquare.addEventListener('click', event => {
                    inSrcSquare.value = s.src;


                    let selectGroupsEL = event => {
                        this.getSquares().then(data => {
                            data.filter(sq => sq.src == s.src).forEach(sqq => {
                                let selected = event.target.value;
                                let groups = sqq.groups.filter(g => g.title == selected);
                                cbUpColisors.disabled = false;
                                cbRightColisors.disabled = false;
                                cbDownColisors.disabled = false;
                                cbLeftColisors.disabled = false;

                                if (groups.length == 0) {
                                    groups.push({
                                        title: selected,
                                        colisors: {
                                            up: false,
                                            right: false,
                                            down: false,
                                            left: false,
                                        }
                                    });

                                    const group = groups[0];
                                    cbUpColisors.checked = group.colisors.up;
                                    cbUpColisors.addEventListener('change', e => {
                                        group.colisors.up = e.target.checked;
                                        sqq.groups.push(group);
                                        this.updateSquares(sqq);
                                    });

                                    cbRightColisors.checked = group.colisors.right;
                                    cbRightColisors.addEventListener('change', e => {
                                        group.colisors.right = e.target.checked;
                                        sqq.groups.push(group);
                                        this.updateSquares(sqq);
                                    });

                                    cbDownColisors.checked = group.colisors.down;
                                    cbDownColisors.addEventListener('change', e => {
                                        group.colisors.down = e.target.checked;
                                        sqq.groups.push(group);
                                        this.updateSquares(sqq);
                                    });

                                    cbLeftColisors.checked = group.colisors.left;
                                    cbLeftColisors.addEventListener('change', e => {
                                        group.colisors.left = e.target.checked;
                                        sqq.groups.push(group);
                                        this.updateSquares(sqq);
                                    });

                                } else if (groups.length > 0) {
                                    const group = groups[0];
                                    updateGroup = g => {
                                        if (g.title == group.title) {
                                            return group;
                                        } else {
                                            return g;
                                        }
                                    };
                                    cbUpColisors.checked = group.colisors.up;
                                    cbUpColisors.addEventListener('change', e => {
                                        group.colisors.up = e.target.checked;
                                        sqq.groups = sqq.groups.map(updateGroup);
                                        this.updateSquares(sqq);
                                    });

                                    cbRightColisors.checked = group.colisors.right;
                                    cbRightColisors.addEventListener('change', e => {
                                        group.colisors.right = e.target.checked;
                                        sqq.groups = sqq.groups.map(updateGroup);
                                        this.updateSquares(sqq);
                                    });

                                    cbDownColisors.checked = group.colisors.down;
                                    cbDownColisors.addEventListener('change', e => {
                                        group.colisors.down = e.target.checked;
                                        sqq.groups = sqq.groups.map(updateGroup);
                                        this.updateSquares(sqq);
                                    });

                                    cbLeftColisors.checked = group.colisors.left;
                                    cbLeftColisors.addEventListener('change', e => {
                                        group.colisors.left = e.target.checked;
                                        sqq.groups = sqq.groups.map(updateGroup);
                                        this.updateSquares(sqq);
                                    });

                                }
                            });
                        })
                        selectGroups.removeEventListener('change', selectGroupsEL);
                    };

                    selectGroups.addEventListener('change', selectGroupsEL);


                    this.getGroups().then(data => {
                        let options = '';
                        data.forEach(g => {
                            options += `<option value="${g}" ${g == 'default' ? 'selected' : ''}>
                                ${g}
                            </option>`;
                        });
                        selectGroups.innerHTML = options;
                    });
                    this.getSquares().then(data => {
                        data.filter(sq => sq.src == s.src).forEach(sqq => {
                            let groups = sqq.groups.filter(g => g.title == 'default');
                            cbUpColisors.disabled = false;
                            cbRightColisors.disabled = false;
                            cbDownColisors.disabled = false;
                            cbLeftColisors.disabled = false;
                            if (groups.length > 0) {
                                const group = groups[0];
                                updateGroup = g => {
                                    if (g.title = group.title) {
                                        return group;
                                    } else {
                                        return g;
                                    }
                                };
                                cbUpColisors.checked = group.colisors.up;
                                cbUpColisors.addEventListener('change', e => {
                                    group.colisors.up = e.target.checked;
                                    sqq.groups = sqq.groups.map(updateGroup);
                                    this.updateSquares(sqq);
                                });

                                cbRightColisors.checked = group.colisors.right;
                                cbRightColisors.addEventListener('change', e => {
                                    group.colisors.right = e.target.checked;
                                    sqq.groups = sqq.groups.map(updateGroup);
                                    this.updateSquares(sqq);
                                });

                                cbDownColisors.checked = group.colisors.down;
                                cbDownColisors.addEventListener('change', e => {
                                    group.colisors.down = e.target.checked;
                                    sqq.groups = sqq.groups.map(updateGroup);
                                    this.updateSquares(sqq);
                                });

                                cbLeftColisors.checked = group.colisors.left;
                                cbLeftColisors.addEventListener('change', e => {
                                    group.colisors.left = e.target.checked;
                                    sqq.groups = sqq.groups.map(updateGroup);
                                    this.updateSquares(sqq);
                                });

                            }
                        });
                    })

                });
            }, err => {
                console.log(err)
            });
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
            this.add(file, squares).then(showSquares);
        } else {
            this.create(file, []).then(() => {
                this.add(file, squares).then(showSquares);
            })
        }
    },

    getSquares() {
        let file = __dirname + '/temp/squares.json';
        return jsonfile.readFile(file);
    },

    getSquareBySrc(src) {
        if(!src) return null;
        return this.getSquares().then(ss => {
            return ss.filter(s => s.src == src)[0];
        });
    },

    saveGroup(group) {
        let file = __dirname + '/temp/groups.json';
        let groups = [group];
        if (fs.existsSync(file)) {
            this.getGroups().then(data => {
                data.forEach(g => {
                    if (!(g in groups)) {
                        groups.push(g);
                    }
                });
                this.add(file, groups);
            });
        } else {
            this.create(file, []).then(() => {
                this.getGroups().then(data => {
                    data.forEach(g => {
                        if (!(g in groups)) {
                            groups.push(g);
                        }
                    });
                    this.add(file, groups);
                });
            })
        }
    },

    removeGroup(group) {
        let file = __dirname + '/temp/groups.json';
        return this.getGroups().then(data => {
            let groups = data.filter(g => {
                return g != group;
            });
            return this.add(file, groups);
        });
    },

    getGroups() {
        let file = __dirname + '/temp/groups.json';
        return jsonfile.readFile(file);
    },

    updateSquares(square) {
        this.getSquares().then(data => {
            data = data.filter(s => {
                return s.src != square.src;
            })
            data.push(square);
            let file = __dirname + '/temp/squares.json';
            this.add(file, data);
        });

    },

    export(event) {
        let output = document.getElementById("listing");
        if (event.target.files.length > 0) {
            let value = event.target.files[0].path;
            let wsDir = __dirname + '/temp';
            console.log(wsDir, value, output)
            ncp(__dirname + '/temp', value, err => {
                if (err) {
                    return console.error(err);
                }
                alert('Exported');
                console.log('done!');
            });
            console.log(this)
            // copy(wsDir, value);
        }
    }

}