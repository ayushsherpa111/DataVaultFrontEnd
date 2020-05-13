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
var __asyncValues = (this && this.__asyncValues) || function (o) {
    if (!Symbol.asyncIterator) throw new TypeError("Symbol.asyncIterator is not defined.");
    var m = o[Symbol.asyncIterator], i;
    return m ? m.call(o) : (o = typeof __values === "function" ? __values(o) : o[Symbol.iterator](), i = {}, verb("next"), verb("throw"), verb("return"), i[Symbol.asyncIterator] = function () { return this; }, i);
    function verb(n) { i[n] = o[n] && function (v) { return new Promise(function (resolve, reject) { v = o[n](v), settle(resolve, reject, v.done, v.value); }); }; }
    function settle(resolve, reject, d, v) { Promise.resolve(v).then(function(v) { resolve({ value: v, done: d }); }, reject); }
};
Object.defineProperty(exports, "__esModule", { value: true });
var meta_1 = require("./../src/app/icons/meta");
var fs = require("fs");
var path = require("path");
var crypto = require("crypto");
var uuid_1 = require("uuid");
var readLine = require("readline");
var levenshtein = require("js-levenshtein");
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
    if (data.password) {
        data.hash = crypto
            .createHash("whirlpool")
            .update(data.password)
            .digest("hex");
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
                ? pass[i][0].toUpperCase() + pass[i].slice(1)
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
function computeStrength(pass) {
    // tslint:disable-next-line: prefer-const
    var score = {
        length: 0,
        digits: 0,
        letters: 0,
        splChr: 0,
    };
    if (pass) {
        if (pass.length === 0) {
            score.length = 0;
            score.digits = 0;
            score.letters = 0;
            score.splChr = 0;
            return;
        }
        if (pass.length <= 4 && pass.length > 0) {
            score.length = 5;
        }
        else if (pass.length >= 5 && pass.length <= 7) {
            score.length = 10;
        }
        else {
            score.length = 25;
        }
        // password entropy check
        // letters
        if (/^[a-z]+$/.test(pass) && pass.length > 0 && pass.length) {
            score.letters = 10;
        }
        else if (/^[a-zA-Z]+/.test(pass) && pass.length > 0 && pass.length) {
            score.letters = 20;
        }
        else {
            score.letters = 0;
        }
        // digits
        var numCount = pass.match(/\d/g);
        if (numCount === null) {
            score.digits = 0;
        }
        else if (numCount.length <= 1 && numCount.length > 0) {
            score.digits = 10;
        }
        else if (numCount.length >= 3) {
            score.digits = 20;
        }
        // special characters
        var spclChrs = pass.match(/\W/g);
        if (spclChrs === null) {
            score.splChr = 0;
        }
        else if (spclChrs.length === 1) {
            score.splChr = 10;
        }
        else {
            score.splChr = 25;
        }
    }
    return Object.keys(score).reduce(function (acc, curr) { return acc + score[curr]; }, 0);
}
exports.computeStrength = computeStrength;
function assignIcon(category, data) {
    var categoryItems = meta_1.MetaData[category];
    var score = { distance: Infinity, icon: "" };
    for (var _i = 0, categoryItems_1 = categoryItems; _i < categoryItems_1.length; _i++) {
        var _a = categoryItems_1[_i], meta = _a.meta, icon = _a.icon;
        // tslint:disable-next-line: forin
        for (var _b = 0, meta_2 = meta; _b < meta_2.length; _b++) {
            var m = meta_2[_b];
            var lScore = levenshtein(data, m);
            if (lScore < score.distance) {
                score.distance = lScore;
                score.icon = icon;
            }
        }
        // console.log(icon);
    }
    return score.icon;
}
function encryptJSON(payload, algo, key) {
    var newPayload = [];
    for (var _i = 0, payload_1 = payload; _i < payload_1.length; _i++) {
        var pass = payload_1[_i];
        var encData = encryptData(algo, Buffer.from(key, "hex"), {
            username: pass.username,
            password: pass.password,
        });
        console.log(encData);
        var score = computeStrength(pass.password);
        var data = __assign({}, pass, encData, { id: uuid_1.v4(), secure: score >= 55 ? true : false, score: score, icon: assignIcon(pass.category, pass.domain.toLowerCase()) });
        console.log(data);
        newPayload.push(data);
    }
    return newPayload;
}
exports.encryptJSON = encryptJSON;
function findCategory(domain) {
    var category = "";
    var ic = "";
    var score = Infinity;
    var found = false;
    // tslint:disable-next-line: forin
    for (var i in meta_1.MetaData) {
        for (var _i = 0, _a = meta_1.MetaData[i]; _i < _a.length; _i++) {
            var _b = _a[_i], meta = _b.meta, icon = _b.icon;
            for (var _c = 0, meta_3 = meta; _c < meta_3.length; _c++) {
                var keyWord = meta_3[_c];
                var kword = domain.split(".")[0].length <= 5 ||
                    domain.split(".")[0] === "crupeeteam"
                    ? domain.split(".")[1]
                    : domain.split(".")[0];
                if (domain.split(".")[0] === "mega") {
                    kword = "mega";
                }
                var sc = levenshtein(kword, keyWord);
                if (score > sc) {
                    score = sc;
                    category = i;
                    ic = icon;
                }
                if (score === 0) {
                    found = true;
                    break;
                }
            }
            if (found) {
                break;
            }
        }
        if (found) {
            break;
        }
    }
    return { category: category, ic: ic, score: score };
}
function encryptCSV(filePath, algo, key) {
    var e_1, _a;
    return __awaiter(this, void 0, void 0, function () {
        var csvStream, rl, firstLine, store, rl_1, rl_1_1, line, obj, urlFor, _b, category, ic, score, encPayload, passScore, e_1_1;
        return __generator(this, function (_c) {
            switch (_c.label) {
                case 0:
                    csvStream = fs.createReadStream(filePath);
                    rl = readLine.createInterface({
                        input: csvStream,
                    });
                    firstLine = false;
                    store = [];
                    _c.label = 1;
                case 1:
                    _c.trys.push([1, 6, 7, 12]);
                    rl_1 = __asyncValues(rl);
                    _c.label = 2;
                case 2: return [4 /*yield*/, rl_1.next()];
                case 3:
                    if (!(rl_1_1 = _c.sent(), !rl_1_1.done)) return [3 /*break*/, 5];
                    line = rl_1_1.value;
                    if (!firstLine) {
                        console.log("Got first Line: ");
                        console.log(line);
                        firstLine = true;
                    }
                    else {
                        obj = line.split(",");
                        urlFor = new URL(obj[1]);
                        _b = findCategory(urlFor.hostname), category = _b.category, ic = _b.ic, score = _b.score;
                        encPayload = encryptData(algo, Buffer.from(key, "hex"), {
                            username: obj[2],
                            password: obj[3],
                        });
                        if (score >= 7) {
                            category = "Other";
                            ic = "other.png";
                        }
                        passScore = computeStrength(obj[3]);
                        store.push(__assign({ domain: urlFor.hostname, url: urlFor.origin == null ? urlFor.href : urlFor.origin }, encPayload, { category: category, icon: ic, secure: score >= 55 ? true : false, score: passScore }));
                    }
                    _c.label = 4;
                case 4: return [3 /*break*/, 2];
                case 5: return [3 /*break*/, 12];
                case 6:
                    e_1_1 = _c.sent();
                    e_1 = { error: e_1_1 };
                    return [3 /*break*/, 12];
                case 7:
                    _c.trys.push([7, , 10, 11]);
                    if (!(rl_1_1 && !rl_1_1.done && (_a = rl_1.return))) return [3 /*break*/, 9];
                    return [4 /*yield*/, _a.call(rl_1)];
                case 8:
                    _c.sent();
                    _c.label = 9;
                case 9: return [3 /*break*/, 11];
                case 10:
                    if (e_1) throw e_1.error;
                    return [7 /*endfinally*/];
                case 11: return [7 /*endfinally*/];
                case 12: return [2 /*return*/, store];
            }
        });
    });
}
exports.encryptCSV = encryptCSV;
//# sourceMappingURL=util.js.map