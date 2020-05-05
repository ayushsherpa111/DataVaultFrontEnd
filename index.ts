import { config } from "dotenv";
import { app, BrowserWindow, dialog, ipcMain, screen, shell } from "electron";
import * as path from "path";
import * as url from "url";
import { readFile, readFileSync } from "fs";
import {
	exists,
	genKey,
	loadVault,
	storeTo,
	encryptData,
	decryptData,
	CHBS,
} from "./utils/util";
config();
const ENC_ALGO = "aes-256-cbc";
let win: BrowserWindow = null;
const args = process.argv.slice(1);
const userData = app.getPath("userData");
const appData = app.getPath("appData");
const vaultFile = "vault.json";
const keyFile = "cridentials.json";
const vaultPath = path.join(userData, "user", vaultFile);
const keyPath = path.join(userData, "user", keyFile);
let VAULT = [];
let USER: any = {};
const WORDS = readFileSync("./utils/wordlist.txt", "utf8").split(",");
function createWindow(): BrowserWindow {
	exists(keyPath);
	exists(vaultPath);

	const electronScreen = screen;
	const size = electronScreen.getPrimaryDisplay().workAreaSize;
	console.log("RUNNING ");
	// Create the browser window.
	win = new BrowserWindow({
		x: 0,
		y: 0,
		width: size.width,
		height: size.height,
		webPreferences: {
			nodeIntegration: true,
		},
	});
	win.loadURL(
		url.format({
			pathname: path.join(__dirname, "dist/index.html"),
			protocol: "file:",
			slashes: true,
		})
	);
	try {
		VAULT = loadVault(vaultPath);
		USER = loadVault(keyPath);
	} catch {
		console.log("VAULT DOESNT EXIST");
	}
	// Emitted when the window is closed.
	win.on("closed", () => {
		win = null;
	});

	return win;
}

ipcMain.handle("storePass", (event, data) => {
	console.log("FROM RENDERED");
	console.log(data);
	let key = "";
	if (USER.masterKey) {
		key = USER.masterKey;
		const encData = encryptData(ENC_ALGO, Buffer.from(key, "hex"), {
			password: data.password,
			username: data.username,
		});
		data = { ...data, ...encData };
		VAULT.push(data);
		storeTo(vaultPath, VAULT);
		console.log("Stored new PAssword");
		return VAULT;
	} else {
		throw Error("key Missing");
	}
});

ipcMain.handle("CHBS", (event, options) => {
	if (options) {
		console.log(
			options.word_count,
			options.min_length,
			options.separator,
			options.capitalize
		);
		return CHBS(
			WORDS,
			options.word_count,
			options.min_length,
			options.separator,
			options.capitalize
		);
	} else {
		throw Error("Options not defined");
	}
});

ipcMain.on("logout", (e) => {
	USER = {};
	VAULT = [];
	console.log("loggedout");
	console.log(USER);
	console.log(VAULT);
});

ipcMain.on("fetchVault", (event, data) => {
	if (data === "all") {
		console.log(data);
		event.returnValue = VAULT;
	}
});

ipcMain.on("delete", (e, data) => {
	console.log(`To Delete: ${data}`);
	const indexx = VAULT.findIndex((pass) => pass.iv === data);
	if (indexx >= 0) {
		VAULT.splice(indexx, 1);
	}
});

ipcMain.handle("refreshKey", async (event, data) => {
	try {
		const key = await genKey(
			USER.authKey + data,
			"",
			parseInt(process.env.MASTERKEY, 10),
			32,
			"sha512"
		);
		USER.masterKey = key;
		return true;
	} catch (e) {
		console.log(e);
		console.log("SOMETHING WENT WRONG");
		dialog.showErrorBox("Something went Wrong", "Something went Wrong Dude");
		throw Error(e);
	}
});

ipcMain.on("userlogin", (event, data) => {
	USER.email = data.email;
	USER.authPass = data.authPass;
	console.log(parseInt(process.env.CLIENTAUTH, 10));
	genKey(
		USER.authPass + USER.email,
		process.env.AUTHSALT,
		parseInt(process.env.CLIENTAUTH, 10),
		32,
		"sha512"
	)
		.then((digest) => {
			USER.authKey = digest;
			event.sender.send("authKeyGen", digest);
		})
		.catch((err) => {
			dialog.showErrorBox("Main process error", "Something went wrongF");
		});
});

ipcMain.handle("decrypt", (_, data) => {
	if (USER && USER.masterKey !== undefined) {
		console.log(data);
		console.log(USER);
		console.log(Buffer.from(data.iv, "hex"));
		const decData = decryptData(
			ENC_ALGO,
			Buffer.from(USER.masterKey, "hex"),
			Buffer.from(data.iv, "hex"),
			{
				username: data.username,
				password: data.password,
			}
		);
		if (VAULT.length === 0) {
			VAULT = loadVault(vaultPath);
		}
		let toUpdate = VAULT.find((pass) => pass.iv === data.iv);
		if (toUpdate) {
			const newPass = encryptData(
				ENC_ALGO,
				Buffer.from(USER.masterKey, "hex"),
				{
					username: decData.username,
					password: decData.password,
				}
			);
			console.log("Updated");
			toUpdate = { ...toUpdate, ...newPass };
			storeTo(vaultPath, VAULT);
		}
		console.log("Decrypted Data");
		console.log(decData);
		return decData;
	} else {
		console.log("Decrypt didnt workd");
		throw Error("Master Password Missing");
	}
});

ipcMain.handle("goTo", async (e, data) => {
	if (data) {
		try {
			await shell.openExternal(data);
		} catch (e) {
			throw Error("URL not available");
		}
	}
});

ipcMain.on("auth", (event, data) => {
	if (data) {
		genKey(
			USER.authKey + USER.authPass,
			"",
			parseInt(process.env.MASTERKEY, 10),
			32,
			"sha512"
		)
			.then((digest) => {
				console.log("Got Key");
				USER.masterKey = digest;
				storeTo(keyPath, { email: USER.email, key: USER.authKey });
			})
			.catch((e) => {
				console.log(e);
				console.log("SOMETHING WENT WRONG");
				dialog.showErrorBox(
					"Something went Wrong",
					"Something went Wrong Dude"
				);
			});
	} else {
		dialog.showErrorBox(
			"Auth Cridentials Wrong",
			"Your password or username is incorrect"
		);
	}
});

try {
	app.on("ready", createWindow);
	// Quit when all windows are closed.
	app.on("window-all-closed", () => {
		if (process.platform !== "darwin") {
			app.quit();
		}
	});
	app.allowRendererProcessReuse = true;

	app.on("activate", () => {
		// On OS X it's common to re-create a window in the app when the
		// dock icon is clicked and there are no other windows open.
		if (win === null) {
			createWindow();
		}
	});
} catch (e) {
	// Catch Error
	// throw e;
}
