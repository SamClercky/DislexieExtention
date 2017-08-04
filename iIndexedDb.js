// ---- code from https://developer.mozilla.org/en-US/docs/Web/API/IndexedDB_API/Using_IndexedDB
// In the following line, you should include the prefixes of implementations you want to test.
window.indexedDB = window.indexedDB || window.mozIndexedDB || window.webkitIndexedDB || window.msIndexedDB;
// DON'T use "var indexedDB = ..." if you're not in a function.
// Moreover, you may need references to some window.IDB* objects:
window.IDBTransaction = window.IDBTransaction || window.webkitIDBTransaction || window.msIDBTransaction || { READ_WRITE: "readwrite" }; // This line should only be needed if it is needed to support the object's constants for older browsers
window.IDBKeyRange = window.IDBKeyRange || window.webkitIDBKeyRange || window.msIDBKeyRange;
// (Mozilla has never prefixed these objects, so we don't need window.mozIDB*)

if (!window.indexedDB) {
    window.alert("Your browser doesn't support a stable version of IndexedDB. Such and such feature will not be available.");
}

function Db() {
    this._db = null;
    this._dbName = "settings";
    this._tableName = "settingsTable";
    this._permission = "readwrite";
    this.settings = [
        { name: "font", value: true, type: "checkbox", label: "Enable OpenDyslexic" },
        { name: "screen", value: true, type: "checkbox", label: "Enable special screen background" },
        { name: "color", value: "#0000ff", type: "color", label: "Backgroundcolor" },
        { name: "opacity", value: 0.5, type: "slider", label: ""}
    ];
    this.IsOpened = false;

    this._OpenDb();
}

Db.prototype._OpenDb = function () {
    var req = indexedDB.open(this._dbName, 1);

    var $this = this;
    req.onerror = this._onError;
    req.onsuccess = function (evt) {
        $this._db = evt.target.result;
    }

    this.IsOpened = true;

    req.onupgradeneeded = this._onInitDb;
}

Db.prototype._onInitDb = function (evt) {
    this.IsOpened = false;
    this._db = evt.target.result;

    var storage = this._db.createObjectStore(this._tableName, { keyPath: "Id", autoIncrement: true });

    storage.createIndex("name", "name", { unique: true });
    storage.createIndex("value", "value", { unique: false });
    storage.createIndex("type", "type", { unique: false });
    storage.createIndex("label", "label", { unique: false});

    // cache this
    var $this = this;
    storage.transaction.oncomplete = function (evt) {
        $this.IsOpened = true;
        $this._insert();
    }
}

Db.prototype.Close = function () {
    this.IsOpened = false;
}

Db.prototype._getStorage = function () {
    return this._db.transaction(this._dbName, this._permission).objectStore(this._tableName);
}

Db.prototype._insert = function () {
    if (!this.IsOpened) return false;

    var storage = this._getStorage();

    for (var i in this.settings) {
        storage.add(i);
    }
}

Db.prototype._dataExists = function (name) {
    for (var i in this.settings) {
        if (i.name == name) {
            return true;
        }
    }

    return false;
}

Db.prototype.GetData = function (name, cb) {
    if (!this.IsOpened) return false;
    if (!this._dataExists(name)) return false;

    var storage = this._db.transaction(this._dbName, this._permission).objectStore(this._tableName);

    storage.get(name).onsuccess = function (evt) {
        var data = evt.target.result;
        cb(data);
    };
}

Db.prototype.SetData = function (name, value) {
    if (!this.IsOpened) return false;
    // check if data exists if not return false
    if (!this._dataExists(name)) return false;

    this.GetData(name, function(oldData) {
        oldData.value = value;

        this._getStorage().put(oldData).onerror = function(evt) {
            this._onError(evt);
        }
    });

}

Db.prototype._onError = function (msg) {
    if (this.IsOpened) {
        this.Close();
    }
    alert(msg);
}