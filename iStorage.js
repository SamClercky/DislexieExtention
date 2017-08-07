function Db() {
    this.settings = {
        dyslexic: {
            value: true,
            type: "checkbox",
            label: "Enable corrections"
        },
        font: {
            value: true,
            type: "checkbox",
            label: "Enable OpenDyslexic"
        },
        screen: {
            value: true,
            type: "checkbox",
            label: "Enable special screen background"
        },
        color: {
            value: "#0000ff",
            type: "color",
            label: "Backgroundcolor"
        },
        _opacity: {
            value: 0.5,
            type: "number",
            label: ""
        },
        _firstRunPassed: {
            value: false,
            type: "checkbox",
            label: ""
        }
    };
    this._dataName = "settings";
    this.ready = false;

    this._init();
}
Db.prototype._dataExists = function (name) {
    for (var i in this.settings) {
        if (this.settings[name]) {
            return true;
        }
    }

    return false;
}
Db.prototype._init = function() {
    // check if first run
    // cache this
    var $this = this;
    this.Get("_firstRunPassed", function(obj) {
        if (obj["_firstRunPassed"] || obj["_firstRunPassed"].value) {
            $this.ready = true;
            return false;
        }
        for (var i in $this.settings){
            var result = {};
            result[i] = $this.settings[i];
            $this.Insert(result);
        }
        $this.ready = true;
        $this.Set("_firstRunPassed", true);
    })
}
Db.prototype.Insert = function(data) {
    //chrome.storage.local.set({"settings": data});
    chrome.storage.local.set(data);
}
Db.prototype.Get = function(name, cb) {
    // cb(obj)
    chrome.storage.local.get(name, cb);
}
Db.prototype.Set = function(name, value) {
    // cb()
    if (!this._dataExists(name)) return false;    
    
    var result = {};
    result[name] = this.settings[name];
    result[name].value = value;

    this.Insert(result);
}