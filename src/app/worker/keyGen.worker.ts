/// <reference lib="webworker" />
import { PBKDF2, algo, enc } from "crypto-js";
import { environment } from "src/environments/environment";

addEventListener("message", ({ data }) => {
	const authKey = PBKDF2(data, environment.authSalt, {
		keySize: 256 / 32,
		iterations: environment.masterKeyRounds,
		hasher: algo.SHA512,
	});
	postMessage(authKey.toString(enc.Hex));
});
