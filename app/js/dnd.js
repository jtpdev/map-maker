
module.exports = {
    allowDrop(ev) {
        ev.preventDefault();
    },
    drag(ev) {
        ev.dataTransfer.setData("text", ev.target.id);
    },
    drop(ev) {
        ev.preventDefault();
        var data = ev.dataTransfer.getData("text");
        var imgSrc = document.getElementById(data);
        var img = this.clone(imgSrc);
        img.id = `img_${ev.target.id}`;
        img.style.height = ev.target.style.height;
        img.style.width = ev.target.style.width;
        ev.target.appendChild(img);
    },
    clone(obj) {
        if (null == obj || "object" != typeof obj) return obj;
        var copy = document.createElement('img');
        copy.src = obj.src;
        copy.title = obj.title;
        return copy;
    }
}