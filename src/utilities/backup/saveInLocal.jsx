/***********************************
 * Save data to local-storage
 ***********************************/

let CryptoJS = require("crypto-js"); // Encryptio and decryption
export const saveInLocal = (stateName, stateValue) => {
	const secretKey = "_encrypt_decrypt_connecting100%"; // Encryption and Decryption secret key shuould be the save

	try {
		const serializedState = JSON.stringify(stateValue);
		// Encrypt data before save to local-storage
		const encrypt = CryptoJS.AES.encrypt(serializedState, secretKey).toString();
		localStorage.setItem(stateName, encrypt);
	} catch {
		// ignore write errors
	}
};
