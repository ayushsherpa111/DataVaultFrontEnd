/// <reference lib="webworker" />
import { environment } from "../../environments/environment";
import { PBKDF2, algo, enc } from "crypto-js";

addEventListener("message", ({ data }) => {
	// This is running in the web-worker
	const salt = environment.authSalt;
	const masterKey = PBKDF2(data, salt, {
		keySize: 256 / 32,
		iterations: environment.clientAuthRounds,
		hasher: algo.SHA512
	});
	postMessage(masterKey.toString(enc.Hex));
});
