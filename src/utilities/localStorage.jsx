// Get data from local-storage with Encruption
// Save data to local-storage with Decryption

let CryptoJS = require("crypto-js"); // Encryptio and decryption
const secretKey = "##**&&_encrypt_decrypt_hamroHotel100%"; // Encryption and Decryption secret key shuould be the same

export const LOCAL_STORAGE = {
	// SAVE
	setItem: (stateName, stateValue) => {
		try {
			const serializedState = JSON.stringify(stateValue);
			// Encrypt data before save to local-storage
			const encrypt = CryptoJS.AES.encrypt(
				serializedState,
				secretKey,
			).toString();
			localStorage.setItem(stateName, encrypt);
		} catch {
			// ignore write errors
		}
	},

	//GET
	getItem: (stateName) => {
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
	},

	// REMOVE
	removeItems: (arrayOfItems) => {
		for (let i = 0; i < arrayOfItems.length; i++) {
			localStorage.removeItem(arrayOfItems[i]);
		}
	},

	// CLEAR
	clear: () => {
		return localStorage.clear();
	},
};

// USER-AUTHENTICATION
export const USER_AUTH = {
	getUserID: function () {
		return LOCAL_STORAGE.getItem("userID");
	},
	getToken: function () {
		return LOCAL_STORAGE.getItem("resJWT");
	},
	setUserId: function (userId) {
		return LOCAL_STORAGE.setItem("userID", userId);
	},
	setToken: function (userToken) {
		return LOCAL_STORAGE.setItem("resJWT", userToken);
	},
};
