
module.exports = {
    allowDrop(ev) {
        ev.preventDefault();
    },
    drag(ev) {
        ev.dataTransfer.setData("text", ev.target.id);
    },
    drop(ev) {
        ev.preventDefault();
        let el = ev.target;
        if(el.src) {
            el = el.parentNode;
        }
        el.innerHTML = '';
        var data = ev.dataTransfer.getData("text");
        var imgSrc = document.getElementById(data);
        var img = this.clone(imgSrc);
        if(img) {
            img.id = `img_${el.id}`;
            img.style.height = el.style.height;
            img.style.width = el.style.width;
            img.classList.add('img-on-square');
            img.title = imgSrc.title;
            img.draggable = true;
            img.addEventListener('dragstart', this.drag);
            el.appendChild(img);
        }
    },
    clone(obj) {
        if (null == obj || "object" != typeof obj) return obj;
        var copy = document.createElement('img');
        copy.src = obj.src;
        copy.title = obj.title;
        return copy;
    }
}