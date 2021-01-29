/***********************************
 * Get data from local-storage
 ***********************************/

let CryptoJS = require("crypto-js"); // Encryptio and decryption
const secretKey = "_encrypt_decrypt_connecting100%"; // Encryption and Decryption secret key shuould be the save
export const getFromLocal = (stateName) => {
	try {
		const serializedState = localStorage.getItem(`${stateName}`);

		// Decrypt data
		const decryptedData = CryptoJS.AES.decrypt(serializedState, secretKey);
		if (decryptedData === null) {
			return undefined;
		}
		return JSON.parse(decryptedData.toString(CryptoJS.enc.Utf8));
	} catch (err) {
		return undefined;
	}
};
