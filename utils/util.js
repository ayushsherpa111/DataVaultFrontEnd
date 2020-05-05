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
Object.defineProperty(exports, "__esModule", { value: true });
var fs = require("fs");
var path = require("path");
var crypto = require("crypto");
function exists(filePath) {
    fs.access(filePath, fs.constants.F_OK, function (err) {
        if (err) {
            var fullPath = filePath.split("\\");
            makeFile(fullPath.slice(0, fullPath.length - 1), fullPath[fullPath.length - 1]);
        }
        else {
            console.log("exist");
        }
    });
}
exports.exists = exists;
function loadVault(vaultPath) {
    return require(vaultPath);
}
exports.loadVault = loadVault;
function makeFile(filePath, fileName) {
    console.log(path.join.apply(path, filePath));
    try {
        fs.mkdirSync(path.join.apply(path, filePath));
    }
    catch (e) {
        console.log("FOLDER EXITS");
    }
    fs.writeFileSync(path.join.apply(path, filePath.concat([fileName])), "[]");
    console.log("Made Vault");
}
function encryptData(algo, key, data) {
    var iv = crypto.randomBytes(16);
    for (var k in data) {
        if (data.hasOwnProperty(k)) {
            var cipher = crypto.createCipheriv(algo, key, iv);
            data[k] = cipher.update(data[k], "utf8", "hex");
            data[k] += cipher.final("hex");
        }
    }
    return __assign({}, data, { iv: iv.toString("hex") });
}
exports.encryptData = encryptData;
function decryptData(algo, key, iv, data) {
    for (var k in data) {
        if (data.hasOwnProperty(k)) {
            var cipher = crypto.createDecipheriv(algo, key, iv);
            data[k] = cipher.update(data[k], "hex", "utf8");
            data[k] += cipher.final("utf8");
        }
    }
    return __assign({}, data);
}
exports.decryptData = decryptData;
function genKey(password, salt, rounds, keylen, digest) {
    return new Promise(function (resolve, reject) {
        crypto.pbkdf2(password, salt, rounds, keylen, digest, function (err, key) {
            if (err) {
                reject(err);
            }
            else {
                resolve(key.toString("hex"));
            }
        });
    });
}
exports.genKey = genKey;
function storeTo(store, data) {
    fs.writeFile(store, JSON.stringify(data), { encoding: "utf8", flag: "w" }, function (err) {
        if (err) {
            console.log("FILE FAIL");
        }
    });
}
exports.storeTo = storeTo;
var randoWord = function (word) {
    return word[Math.floor(Math.random() * word.length)];
};
function CHBS(wordList, minWordCount, minLength, separator, capitalize) {
    var pass = [];
    for (var i = 0; i < minWordCount; i++) {
        pass.push(randoWord(wordList));
    }
    if (pass.join("-").length < minLength) {
        while (pass.join("-").length < minLength) {
            pass.push(randoWord(wordList));
        }
    }
    if (separator.length > 1) {
        var newSpes = separator.split("");
        var newPass = "";
        // tslint:disable-next-line: forin
        for (var i = 0; i < pass.length; i++) {
            newPass += capitalize
                ? pass[i][0].toUpperCase + pass[i].slice(1)
                : pass[i];
            if (i !== pass.length) {
                newPass += randoWord(newSpes);
            }
        }
        return newPass;
    }
    else {
        return pass.join(separator);
    }
}
exports.CHBS = CHBS;
//# sourceMappingURL=util.js.map