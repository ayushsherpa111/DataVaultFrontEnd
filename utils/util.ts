import { MetaData } from "./../src/app/icons/meta";
import * as fs from "fs";
import * as path from "path";
import * as crypto from "crypto";
import { v4 } from "uuid";
import * as readLine from "readline";
import levenshtein = require("js-levenshtein");

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
	if (data.password) {
		data.hash = crypto
			.createHash("whirlpool")
			.update(data.password)
			.digest("hex");
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

export function computeStrength(pass: string): number {
	// tslint:disable-next-line: prefer-const
	const score: {
		length: number;
		digits: number;
		letters: number;
		splChr: number;
	} = {
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
		} else if (pass.length >= 5 && pass.length <= 7) {
			score.length = 10;
		} else {
			score.length = 25;
		}

		// password entropy check
		// letters
		if (/^[a-z]+$/.test(pass) && pass.length > 0 && pass.length) {
			score.letters = 10;
		} else if (/^[a-zA-Z]+/.test(pass) && pass.length > 0 && pass.length) {
			score.letters = 20;
		} else {
			score.letters = 0;
		}

		// digits
		const numCount = pass.match(/\d/g);
		if (numCount === null) {
			score.digits = 0;
		} else if (numCount.length <= 1 && numCount.length > 0) {
			score.digits = 10;
		} else if (numCount.length >= 3) {
			score.digits = 20;
		}

		// special characters
		const spclChrs = pass.match(/\W/g);
		if (spclChrs === null) {
			score.splChr = 0;
		} else if (spclChrs.length === 1) {
			score.splChr = 10;
		} else {
			score.splChr = 25;
		}
	}
	return Object.keys(score).reduce((acc, curr) => acc + score[curr], 0);
}

function assignIcon(category: string, data: string) {
	const categoryItems = MetaData[category];
	const score = { distance: Infinity, icon: "" };
	for (const { meta, icon } of categoryItems) {
		// tslint:disable-next-line: forin
		for (const m of meta) {
			const lScore = levenshtein(data, m);
			if (lScore < score.distance) {
				score.distance = lScore;
				score.icon = icon;
			}
		}
		// console.log(icon);
	}
	return score.icon;
}

export function encryptJSON(payload: any, algo: string, key: string) {
	const newPayload = [];
	for (const pass of payload) {
		const encData = encryptData(algo, Buffer.from(key, "hex"), {
			username: pass.username,
			password: pass.password,
		});
		console.log(encData);
		const score = computeStrength(pass.password);
		const data = {
			...pass,
			...encData,
			id: v4(),
			secure: score >= 55 ? true : false,
			score,
			icon: assignIcon(pass.category, pass.domain.toLowerCase()),
		};
		console.log(data);
		newPayload.push(data);
	}
	return newPayload;
}

function findCategory(domain) {
	let category = "";
	let ic = "";
	let score = Infinity;
	let found = false;
	// tslint:disable-next-line: forin
	for (const i in MetaData) {
		for (const { meta, icon } of MetaData[i]) {
			for (const keyWord of meta) {
				let kword =
					domain.split(".")[0].length <= 5 ||
					domain.split(".")[0] === "crupeeteam"
						? domain.split(".")[1]
						: domain.split(".")[0];
				if (domain.split(".")[0] === "mega") {
					kword = "mega";
				}
				const sc = levenshtein(kword, keyWord);
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
	return { category, ic, score };
}

export async function encryptCSV(filePath: string, algo: string, key: string) {
	const csvStream = fs.createReadStream(filePath);
	const rl: any = readLine.createInterface({
		input: csvStream,
	});
	let firstLine = false;
	const store = [];
	for await (const line of rl) {
		if (!firstLine) {
			console.log("Got first Line: ");
			console.log(line);
			firstLine = true;
		} else {
			const obj = line.split(",");
			const urlFor = new URL(obj[1]);
			let { category, ic, score } = findCategory(urlFor.hostname);
			const encPayload = encryptData(algo, Buffer.from(key, "hex"), {
				username: obj[2],
				password: obj[3],
			});
			if (score >= 7) {
				category = "Other";
				ic = "other.png";
			}
			const passScore = computeStrength(obj[3]);
			store.push({
				domain: urlFor.hostname,
				url: urlFor.origin == null ? urlFor.href : urlFor.origin,
				...encPayload,
				category,
				icon: ic,
				secure: score >= 55 ? true : false,
				score: passScore,
			});
		}
	}
	return store;
}
