// init file of popup

var wrapper = document.getElementById("wrapper");
var progress = document.getElementById("progress");
var settings = [];
var elementData = [];
var db = new Db();

// update data
/*for (var item in db.settings) {
    db.GetData(item.name, function (data) {
        settings.push(data);

        addElement(data.label, data.value, data.type)
    });
}*/

function addElement(name, value, type) {

    var result = document.createElement("tr");
    var tdName = document.createElement("td");
    var tdData = document.createElement("td");
    var dataInput = document.createElement("input");

    // set name
    tdName.value = name;
    // set input
    dataInput.type = type;
    dataInput.value = value;
    // merge everything
    tdData.children.addElement(dataInput);
    result.children.addElement(tdName);
    result.children.addElement(tdData);
}