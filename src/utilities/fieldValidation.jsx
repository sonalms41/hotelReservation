export const FIELD_VALIDATION = {
	email: function (fieldValue) {
		let emailFormat = /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9-]+(?:\.[a-zA-Z0-9-]+)*$/;
		if (fieldValue.match(emailFormat)) {
			return true;
		} else return false;
	},
};
