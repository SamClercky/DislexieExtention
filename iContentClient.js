function Client() {

}

Client.prototype.onRespons = function(cb) {
    // cb(data);
    chrome.runtime.onMessage.addListener(function(data, sender, respons) {
        cb(data);
    });
}