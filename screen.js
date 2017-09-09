var c = new Client();
var db = new Db();
var styleElements = [];
var settings = {};
var cscreen = new CScreen();
var enableBackground = false;
var prefabStyle = {
    "font": '*, html, body, h1, h2, h3, h4, h5, h6, p, span, div, code{font-family: "OpenDyslexic" !important; line-height: 150%;} code,pre{font-family: OpenDyslexicMono !important;}',
    "color": "#" + cscreen.id + ' {background: {0} !important;}',
    "opacity": "#" + cscreen.id + ' {opacity: {0} !important;}',
    "markup": "p, span, div, code { text-align: justify !important;text-justify: inter-word !important;background: white !important;color: #333 !important;line-height: 1.5 !important;font-size: 1em !important;}"
}

init();

function init() {
    if (db.ready) {
        console.log("Db started, init layout");

        c.onRespons(onNewData);

        initLayout();
        initBackground();
    } else {
        setTimeout(init, 250);
    }
}
function onNewData(data) {
    changeLayoutItem(data.name, data.value);
}
// init background
function initBackground() {
    var elementen = document.querySelectorAll("p,li,span,code,dd,dt,dl,th,td");
    elementen.forEach(function(e) {
        e.onmouseover = function(e) {
            if (!enableBackground) {
                // reset pos
                cscreen.setVisible(false);
                return;
            }
            console.log("in");

            cscreen.setVisible(true);
            var pos = GetPos(e.target);

            cscreen.X = pos.X;
            cscreen.Y = pos.Y;
            cscreen.width = pos.Width;
            cscreen.height = pos.Height;

            cscreen.resetPos();
        }
    })
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
                enableBackground = false;
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
                    if (!settings["markup"] && styleElements[item].getAttribute("data") == "markup") {
                        styleElements[item].disabled = true;
                        continue;
                    }
                    styleElements[item].disabled = false;
                }
                if (settings["screen"])
                    enableBackground = true;
                else
                    enableBackground = false;
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
        case "markup":
            for (var item in styleElements) {
                if (styleElements[item].getAttribute("data") == "markup") {
                    var entry = document.createTextNode(prefabStyle["markup"]);
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
                enableBackground = false;
            } else {
                for (var item in styleElements) {
                    if (settings["dyslexic"] && styleElements[item].getAttribute("data") == "color") {
                        styleElements[item].disabled = false;
                        enableBackground = true;
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
            break;
        case "opacity":
            for (var item in styleElements) {
                if (styleElements[item].getAttribute("data") == "opacity") {
                    var entry = document.createTextNode(prefabStyle["opacity"].format([value]));
                    if (styleElements[item].childNodes[0])
                        styleElements[item].removeChild(styleElements[item].childNodes[0]);
                    styleElements[item].appendChild(entry);
                    if (!settings["screen"] || !settings["dyslexic"])
                        styleElements[item].disabled = true;
                    break;
                }
            }
            break;
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

function GetPos(elem) {
    var body = document.getElementsByName("body")[0];
    var pos = {}
    pos.X = elem.offsetLeft;
    pos.Y = elem.offsetTop;
    pos.Width = elem.offsetWidth;
    pos.Height = elem.offsetHeight;

    while (elem.offsetParent) {
        var parent = elem.offsetParent;
        pos.X += parent.offsetLeft;
        pos.Y += parent.offsetTop;

        if (elem == body)
            break;
        else
            elem = elem.offsetParent;
    }

    return pos;
}