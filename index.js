"use strict";
var __assign = (this && this.__assign) || function () {
    __assign = Object.assign || function(t) {
        for (var s, i = 1, n = arguments.length; i < n; i++) {
            s = arguments[i];
            for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p))
                t[p] = s[p];
        }
        return t;
    };
    return __assign.apply(this, arguments);
};
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : new P(function (resolve) { resolve(result.value); }).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
    return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (_) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
var _this = this;
Object.defineProperty(exports, "__esModule", { value: true });
var dotenv_1 = require("dotenv");
var electron_1 = require("electron");
var path = require("path");
var url = require("url");
var fs_1 = require("fs");
var util_1 = require("./utils/util");
dotenv_1.config();
var ENC_ALGO = "aes-256-cbc";
var win = null;
var args = process.argv.slice(1);
var userData = electron_1.app.getPath("userData");
var appData = electron_1.app.getPath("appData");
var vaultFile = "vault.json";
var keyFile = "cridentials.json";
var vaultPath = path.join(userData, "user", vaultFile);
var keyPath = path.join(userData, "user", keyFile);
var VAULT = [];
var USER = {};
var WORDS = fs_1.readFileSync("./utils/wordlist.txt", "utf8").split(",");
function createWindow() {
    util_1.exists(keyPath);
    util_1.exists(vaultPath);
    var electronScreen = electron_1.screen;
    var size = electronScreen.getPrimaryDisplay().workAreaSize;
    console.log("RUNNING ");
    // Create the browser window.
    win = new electron_1.BrowserWindow({
        x: 0,
        y: 0,
        width: size.width,
        height: size.height,
        webPreferences: {
            nodeIntegration: true,
        },
    });
    win.loadURL(url.format({
        pathname: path.join(__dirname, "dist/index.html"),
        protocol: "file:",
        slashes: true,
    }));
    try {
        VAULT = util_1.loadVault(vaultPath);
        USER = util_1.loadVault(keyPath);
    }
    catch (_a) {
        console.log("VAULT DOESNT EXIST");
    }
    // Emitted when the window is closed.
    win.on("closed", function () {
        win = null;
    });
    return win;
}
electron_1.ipcMain.handle("storePass", function (event, data) {
    console.log("FROM RENDERED");
    console.log(data);
    var key = "";
    if (USER.masterKey) {
        key = USER.masterKey;
        var encData = util_1.encryptData(ENC_ALGO, Buffer.from(key, "hex"), {
            password: data.password,
            username: data.username,
        });
        data = __assign({}, data, encData);
        VAULT.push(data);
        util_1.storeTo(vaultPath, VAULT);
        console.log("Stored new PAssword");
        return VAULT;
    }
    else {
        throw Error("key Missing");
    }
});
electron_1.ipcMain.handle("CHBS", function (event, options) {
    if (options) {
        console.log(options.word_count, options.min_length, options.separator, options.capitalize);
        return util_1.CHBS(WORDS, options.word_count, options.min_length, options.separator, options.capitalize);
    }
    else {
        throw Error("Options not defined");
    }
});
electron_1.ipcMain.on("logout", function (e) {
    USER = {};
    VAULT = [];
    console.log("loggedout");
    console.log(USER);
    console.log(VAULT);
});
electron_1.ipcMain.on("fetchVault", function (event, data) {
    if (data === "all") {
        console.log(data);
        event.returnValue = VAULT;
    }
});
electron_1.ipcMain.on("delete", function (e, data) {
    console.log("To Delete: " + data);
    var indexx = VAULT.findIndex(function (pass) { return pass.iv === data; });
    if (indexx >= 0) {
        VAULT.splice(indexx, 1);
    }
});
electron_1.ipcMain.handle("refreshKey", function (event, data) { return __awaiter(_this, void 0, void 0, function () {
    var key, e_1;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                _a.trys.push([0, 2, , 3]);
                return [4 /*yield*/, util_1.genKey(USER.authKey + data, "", parseInt(process.env.MASTERKEY, 10), 32, "sha512")];
            case 1:
                key = _a.sent();
                USER.masterKey = key;
                return [2 /*return*/, true];
            case 2:
                e_1 = _a.sent();
                console.log(e_1);
                console.log("SOMETHING WENT WRONG");
                electron_1.dialog.showErrorBox("Something went Wrong", "Something went Wrong Dude");
                throw Error(e_1);
            case 3: return [2 /*return*/];
        }
    });
}); });
electron_1.ipcMain.on("userlogin", function (event, data) {
    USER.email = data.email;
    USER.authPass = data.authPass;
    console.log(parseInt(process.env.CLIENTAUTH, 10));
    util_1.genKey(USER.authPass + USER.email, process.env.AUTHSALT, parseInt(process.env.CLIENTAUTH, 10), 32, "sha512")
        .then(function (digest) {
        USER.authKey = digest;
        event.sender.send("authKeyGen", digest);
    })
        .catch(function (err) {
        electron_1.dialog.showErrorBox("Main process error", "Something went wrongF");
    });
});
electron_1.ipcMain.handle("decrypt", function (_, data) {
    if (USER && USER.masterKey !== undefined) {
        console.log(data);
        console.log(USER);
        console.log(Buffer.from(data.iv, "hex"));
        var decData = util_1.decryptData(ENC_ALGO, Buffer.from(USER.masterKey, "hex"), Buffer.from(data.iv, "hex"), {
            username: data.username,
            password: data.password,
        });
        if (VAULT.length === 0) {
            VAULT = util_1.loadVault(vaultPath);
        }
        var toUpdate = VAULT.find(function (pass) { return pass.iv === data.iv; });
        if (toUpdate) {
            var newPass = util_1.encryptData(ENC_ALGO, Buffer.from(USER.masterKey, "hex"), {
                username: decData.username,
                password: decData.password,
            });
            console.log("Updated");
            toUpdate = __assign({}, toUpdate, newPass);
            util_1.storeTo(vaultPath, VAULT);
        }
        console.log("Decrypted Data");
        console.log(decData);
        return decData;
    }
    else {
        console.log("Decrypt didnt workd");
        throw Error("Master Password Missing");
    }
});
electron_1.ipcMain.handle("goTo", function (e, data) { return __awaiter(_this, void 0, void 0, function () {
    var e_2;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                if (!data) return [3 /*break*/, 4];
                _a.label = 1;
            case 1:
                _a.trys.push([1, 3, , 4]);
                return [4 /*yield*/, electron_1.shell.openExternal(data)];
            case 2:
                _a.sent();
                return [3 /*break*/, 4];
            case 3:
                e_2 = _a.sent();
                throw Error("URL not available");
            case 4: return [2 /*return*/];
        }
    });
}); });
electron_1.ipcMain.on("auth", function (event, data) {
    if (data) {
        util_1.genKey(USER.authKey + USER.authPass, "", parseInt(process.env.MASTERKEY, 10), 32, "sha512")
            .then(function (digest) {
            console.log("Got Key");
            USER.masterKey = digest;
            util_1.storeTo(keyPath, { email: USER.email, key: USER.authKey });
        })
            .catch(function (e) {
            console.log(e);
            console.log("SOMETHING WENT WRONG");
            electron_1.dialog.showErrorBox("Something went Wrong", "Something went Wrong Dude");
        });
    }
    else {
        electron_1.dialog.showErrorBox("Auth Cridentials Wrong", "Your password or username is incorrect");
    }
});
try {
    electron_1.app.on("ready", createWindow);
    // Quit when all windows are closed.
    electron_1.app.on("window-all-closed", function () {
        if (process.platform !== "darwin") {
            electron_1.app.quit();
        }
    });
    electron_1.app.allowRendererProcessReuse = true;
    electron_1.app.on("activate", function () {
        // On OS X it's common to re-create a window in the app when the
        // dock icon is clicked and there are no other windows open.
        if (win === null) {
            createWindow();
        }
    });
}
catch (e) {
    // Catch Error
    // throw e;
}
//# sourceMappingURL=index.js.map