// init file of popup
var wrapper = document.getElementById("wrapper");
var settings = {};
var elementData = [];
var db = new Db();

// update data after 1s
console.log("Waiting for db ...");

init();

function init() {
    if (db.ready) {
        console.log("Db started, Init menu");
        createMenu();
    } else {
        setTimeout(init, 250);
    }
}

function createMenu() {
    for (var i in db.settings) {
        if (i.startsWith("_")) continue;

        db.Get(i, function(obj) {
            var data = {};
            var item = {};
            for (item in obj) {
                data = obj[item];
            }
            settings[item] = data;
            elementData.push(addElement(data.label, data.value, data.type, item));
        })
    }
}

function addElement(name, value, type, id) {

    var result = document.createElement("tr");
    var tdName = document.createElement("td");
    var tdData = document.createElement("td");
    var dataInput = document.createElement("input");

    // set name
    tdName.className = "text";
    tdName.appendChild(document.createTextNode(name));
    // set input
    tdData.className = "input";
    dataInput.type = type;
    if (type == "checkbox")
        dataInput.checked = normalizeInput(value);
    else
        dataInput.value = normalizeInput(value);
    dataInput.setAttribute("data", id);
    dataInput.onchange = onChangeSet;
    // merge everything
    tdData.appendChild(dataInput);
    result.appendChild(tdName);
    result.appendChild(tdData);
    wrapper.appendChild(result);

    return result;
}

function onChangeSet(evt) {
    var value = (evt.target.type == "checkbox") ? evt.target.checked : evt.target.value;
    
    // save changes
    settings[evt.target.getAttribute("data")].value = value;

    toggleData(
        evt.target.getAttribute("data"),
        value
    );
    db.Set(
        evt.target.getAttribute("data"),
        value
    );
    var s = new Server();
    s.Send(
        evt.target.getAttribute("data"),
        value
    );
}

function normalizeInput(raw) {
    if (isNumeric(raw)) {
        return parseInt(raw);
    } else if (isBool(raw)) {
        return String(raw) == "true";
    } else {
        return raw;
    }
}
function isNumeric(n) {
    return !isNaN(parseFloat(n)) && isFinite(n);
}
function isBool(b) {
    switch (b) {
        case "true":
            return true;
        case "false":
            return true;
        default:
            return false;
    }
}
function toggleData(name, value){
    if (name == "dyslexic") {
        if (value == false) {
            for (var i in elementData) {
                if (elementData[i].childNodes[1].childNodes[0].getAttribute("data") == "dyslexic") continue;
                $(elementData[i]).slideUp();
            }
        } else {
            for (var i in elementData) {
                if (elementData[i].childNodes[1].childNodes[0].getAttribute("data") == "dyslexic") continue;
                if (
                    !normalizeInput(settings["screen"].value) && 
                    elementData[i].childNodes[1].childNodes[0].getAttribute("data") == "color"
                ) continue;
                $(elementData[i]).slideDown();
            }
        }
    }
    if (name == "screen") {
        if (value == false) {
            for (var i in elementData) {
                if (elementData[i].childNodes[1].childNodes[0].getAttribute("data") == "color")
                    $(elementData[i]).slideUp();
            }
        } else {
            for (var i in elementData) {
                if (elementData[i].childNodes[1].childNodes[0].getAttribute("data") == "color")
                    $(elementData[i]).slideDown();
            }
        }
    }
}