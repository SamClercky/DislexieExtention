var c = new Client();
var db = new Db();
var styleElements = [];
var settings = {};
var prefabStyle = {
    "font": '*, html, body, h1, h2, h3, h4, h5, h6, p, span, div, code{font-family: "OpenDyslexic" !important; line-height: 150%;} code,pre{font-family: OpenDyslexicMono !important;}',
    "color": 'p:hover, li:hover, span:hover, code:hover {background: {0} !important;}'
}

init();

function init() {
    if (db.ready) {
        console.log("Db started, init layout");

        c.onRespons(onNewData);

        initLayout();
    } else {
        setTimeout(init, 250);
    }
}
function onNewData(data) {
    changeLayoutItem(data.name, data.value);
}
function initLayout() {

    for (var i in db.settings) {
        if (i.startsWith("_")) continue;

        db.Get(i, function (obj) {
            var data = {};
            var item = {};
            for (item in obj) {
                data = obj[item];
            }

            createLayoutItem(item, data.value);
        })
    }
}

function createLayoutItem(name, value) {
    if (prefabStyle[name] != undefined) {
        var style = document.createElement("style");
        style.setAttribute("data", name);
        document.head.appendChild(style);
        styleElements.push(style);
    }
    changeLayoutItem(name, value)
}

function changeLayoutItem(name, value) {
    settings[name] = value;

    switch (name) {
        case "dyslexic":
            if (!toBool(value)) {
                for (var item in styleElements) {
                    styleElements[item].disabled = true;
                }
            } else {
                for (var item in styleElements) {
                    if (!settings["screen"] && styleElements[item].getAttribute("data") == "color") {
                         styleElements[item].disabled = true;
                         continue;
                    }
                    if (!settings["font"] && styleElements[item].getAttribute("data") == "font") {
                         styleElements[item].disabled = true;
                         continue;
                    }
                    styleElements[item].disabled = false;
                }
            }
            break;
        case "font":
            for (var item in styleElements) {
                if (styleElements[item].getAttribute("data") == "font") {
                    var entry = document.createTextNode(prefabStyle["font"]);
                    if (styleElements[item].childNodes[0])
                        styleElements[item].removeChild(styleElements[item].childNodes[0]);
                    styleElements[item].appendChild(entry);

                    // check if dyslexic is enabled
                    if (!settings["dyslexic"]) {
                        styleElements[item].disabled = true;
                        break;
                    }
                    // otherwise
                    if (toBool(value) == false) {
                        styleElements[item].disabled = true;
                    } else {
                        styleElements[item].disabled = false;
                    }
                    break;
                }
            }
            break;
        case "screen":
            if (!toBool(value)) {
                for (var item in styleElements) {
                    if (styleElements[item].getAttribute("data") == "color") {
                        styleElements[item].disabled = true;
                        break;
                    }
                }
            } else {
                for (var item in styleElements) {
                    if ( settings["dyslexic"] && styleElements[item].getAttribute("data") == "color") {
                        styleElements[item].disabled = false;
                        break;
                    }
                }
            }
            break;
        case "color":
            for (var item in styleElements) {
                if (styleElements[item].getAttribute("data") == "color") {
                    var entry = document.createTextNode(prefabStyle["color"].format([value]));
                    if (styleElements[item].childNodes[0])
                        styleElements[item].removeChild(styleElements[item].childNodes[0]);
                    styleElements[item].appendChild(entry);
                    if (!settings["screen"] || !settings["dyslexic"])
                        styleElements[item].disabled = true;
                    break;
                }
            }
    }
}
function toBool(b) {
    switch (b) {
        case "true":
            return true;
        case "false":
            return false;
        case false:
            return false;
        case true:
            return true;
        default:
            return false;
    }
}

// code from: https://www.codeproject.com/Tips/201899/String-Format-in-JavaScript
String.prototype.format = function (args) {
    var str = this;
    return str.replace(String.prototype.format.regex, function (item) {
        var intVal = parseInt(item.substring(1, item.length - 1));
        var replace;
        if (intVal >= 0) {
            replace = args[intVal];
        } else if (intVal === -1) {
            replace = "{";
        } else if (intVal === -2) {
            replace = "}";
        } else {
            replace = "";
        }
        return replace;
    });
};
String.prototype.format.regex = new RegExp("{-?[0-9]+}", "g");