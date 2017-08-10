function Db() {
    this.settings = {
        dyslexic: {
            value: true,
            type: "checkbox",
            label: "Enable corrections",
            help: "Toggle to activate or desactivate all"
        },
        font: {
            value: true,
            type: "checkbox",
            label: "Enable OpenDyslexic",
            help: "Toggles the OpenDyslexic font"
        },
        screen: {
            value: true,
            type: "checkbox",
            label: "Enable special screen background",
            help: "Toggles special background help"
        },
        color: {
            value: "#00ecff",
            type: "color",
            label: "Backgroundcolor",
            help: "Color of the special background"
        },
        _opacity: {
            value: 0.5,
            type: "number",
            label: "",
            help: ""
        },
        _firstRunPassed: {
            value: false,
            type: "checkbox",
            label: "",
            help: ""
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
        if (obj["_firstRunPassed"] != undefined) {
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
