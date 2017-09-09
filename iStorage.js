function Db() {
    this.settings = {
        dyslexic: {
            value: true,
            type: "checkbox",
            label: "Activate dyslexic extension",
            help: "Activate or desactivate all functions",
            spacer: 0
        },
        font: {
            value: true,
            type: "checkbox",
            label: "Activate OpenDyslexic",
            help: "Activate the OpenDyslexic font",
            spacer: 1
        },
        screen: {
            value: true,
            type: "checkbox",
            label: "Activate backgroundcolor",
            help: "Activate special background help",
            spacer: 1
        },
        color: {
            value: "#00ecff",
            type: "color",
            label: "Choose backgroundcolor",
            help: "Color of special background",
            spacer: 2
        },
        opacity: {
            value: 0.5,
            type: "range",
            label: "Opacity",
            help: "Sets the opacity of the special background",
            spacer: 2
        },
        _firstRunPassed: {
            value: false,
            type: "checkbox",
            label: "",
            help: "",
            spacer: 0
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
