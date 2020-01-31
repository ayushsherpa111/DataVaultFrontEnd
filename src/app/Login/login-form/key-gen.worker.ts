/// <reference lib="webworker" />
import * as cryptoJS from "crypto-js";

addEventListener("message", ({ data }) => {
	const response = `worker response to ${data}`;
	postMessage(response);
	this.salt = cryptoJS.lib.WordArray.random(128 / 8);
	const masterKey = cryptoJS.PBKDF2(
		data.email + data.masterPassword,
		this.salt,
		{
			keySize: 256 / 32,
			iterations: 10000,
			hasher: cryptoJS.algo.SHA512
		}
	);
});
