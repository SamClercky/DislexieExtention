function Server() {

}
Server.prototype.Send = function(name, value) {
    console.log("Sending data...");

    chrome.tabs.query({}, function(tabs) {
        var msg = {
            "name": name,
            "value": value
        };
        for (var i in tabs) {
            chrome.tabs.sendMessage(tabs[i].id, msg);
        }
        console.log("Data sent");
    })
}