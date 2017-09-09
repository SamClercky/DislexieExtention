// creates and manages a colored screen

function CScreen() {
    this.id = this._genId();
    this._object = null;
    this.X = 0;
    this.Y = 0;
    this.width = 0;
    this.height = 0;

    this.build();
}

CScreen.prototype.build = function () {
    this._object = document.createElement("div");
    this._object.setAttribute("id", this.id);

    this.setVisible(true);
    this._object.style.position = "absolute";
    this.resetPos();

    // cache this
    var $this = this;
    this._object.onclick = function (e) {
        $this.setVisible(false, $this);

        document.elementFromPoint(e.clientX, e.clientY).click();

        $this.setVisible(true, $this);
    }

    this.add();
}

CScreen.prototype.add = function () {
    document.getElementsByTagName("body")[0].appendChild(this._object);
}

CScreen.prototype._genId = function () {
    let id;
    do {
        id = "uid" + (new Date()).getMilliseconds() + Math.floor(Math.random() * 1000);
    } while (document.getElementById(id));

    return id;
}
CScreen.prototype.resetPos = function () {
    this._object.style.left = this.X + "px";
    this._object.style.top = this.Y + "px";
    this._object.style.width = this.width + "px";
    this._object.style.height = this.height + "px";
}

CScreen.prototype.setVisible = function (visible, context) {
    var $this = (context) ? context : this;
    if ($this._object == null) return;

    if (visible) {
        $this._object.style.display = "block";
    } else {
        $this._object.style.display = "none";
    }
}