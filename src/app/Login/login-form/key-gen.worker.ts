/// <reference lib="webworker" />
import { environment } from "./../../../environments/environment";
import { PBKDF2, lib, algo, enc } from "crypto-js";

addEventListener("message", ({ data }) => {
	// This is running in the web-worker
	const salt = lib.WordArray.random(128 / 8);
	const masterKey = PBKDF2(data.email + data.masterPassword, salt, {
		keySize: 256 / 32,
		iterations: environment.masterKeyRounds,
		hasher: algo.SHA512
	});
	const userObj = {
		masterKey: masterKey.toString(enc.Hex),
		salt
	};
	postMessage(userObj);
});
