import * as fs from "fs";
import * as path from "path";
import * as crypto from "crypto";

export function exists(filePath: string) {
	fs.access(filePath, fs.constants.F_OK, (err: Error) => {
		if (err) {
			const fullPath = filePath.split("\\");
			makeFile(
				fullPath.slice(0, fullPath.length - 1),
				fullPath[fullPath.length - 1]
			);
		} else {
			console.log("exist");
		}
	});
}

export function loadVault(vaultPath: string) {
	return require(vaultPath);
}

function makeFile(filePath: string[], fileName: string) {
	console.log(path.join(...filePath));
	try {
		fs.mkdirSync(path.join(...filePath));
	} catch (e) {
		console.log("FOLDER EXITS");
	}
	fs.writeFileSync(path.join(...filePath, fileName), "[]");
	console.log("Made Vault");
}

export function encryptData(
	algo: string,
	key: Buffer,
	data: { [key: string]: string }
) {
	const iv = crypto.randomBytes(16);
	for (const k in data) {
		if (data.hasOwnProperty(k)) {
			const cipher = crypto.createCipheriv(algo, key, iv);
			data[k] = cipher.update(data[k], "utf8", "hex");
			data[k] += cipher.final("hex");
		}
	}
	return {
		...data,
		iv: iv.toString("hex"),
	};
}

export function decryptData(
	algo: string,
	key: Buffer,
	iv: Buffer,
	data: { [key: string]: string }
) {
	for (const k in data) {
		if (data.hasOwnProperty(k)) {
			const cipher = crypto.createDecipheriv(algo, key, iv);
			data[k] = cipher.update(data[k], "hex", "utf8");
			data[k] += cipher.final("utf8");
		}
	}
	return {
		...data,
	};
}
export function genKey(
	password: string,
	salt: string,
	rounds: number,
	keylen: number,
	digest: string
): Promise<string> {
	return new Promise((resolve, reject) => {
		crypto.pbkdf2(password, salt, rounds, keylen, digest, (err, key) => {
			if (err) {
				reject(err);
			} else {
				resolve(key.toString("hex"));
			}
		});
	});
}

export function storeTo(store: string, data: any) {
	fs.writeFile(
		store,
		JSON.stringify(data),
		{ encoding: "utf8", flag: "w" },
		(err) => {
			if (err) {
				console.log("FILE FAIL");
			}
		}
	);
}

const randoWord = (word: string[]) =>
	word[Math.floor(Math.random() * word.length)];

export function CHBS(
	wordList: string[],
	minWordCount: number,
	minLength: number,
	separator: string,
	capitalize: boolean
) {
	const pass: string[] = [];
	for (let i = 0; i < minWordCount; i++) {
		pass.push(randoWord(wordList));
	}
	if (pass.join("-").length < minLength) {
		while (pass.join("-").length < minLength) {
			pass.push(randoWord(wordList));
		}
	}

	if (separator.length > 1) {
		const newSpes = separator.split("");
		let newPass = "";
		// tslint:disable-next-line: forin
		for (let i = 0; i < pass.length; i++) {
			newPass += capitalize
				? pass[i][0].toUpperCase() + pass[i].slice(1)
				: pass[i];
			if (i !== pass.length) {
				newPass += randoWord(newSpes);
			}
		}
		return newPass;
	} else {
		return pass.join(separator);
	}
}
