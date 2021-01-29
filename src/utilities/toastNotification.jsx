import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
toast.configure();
export const toastNotification = {
	info: function (message) {
		toast.info(message, {
			position: toast.POSITION.TOP_RIGHT,
			autoClose: 3500,
		});
	},
	warn: function (message) {
		toast.warn(message, {
			position: toast.POSITION.TOP_RIGHT,
		});
	},
	success: function (message) {
		toast.success(message, {
			position: toast.POSITION.TOP_RIGHT,
			autoClose: 3500,
		});
	},
	error: function (message) {
		toast.error(message, {
			position: toast.POSITION.TOP_RIGHT,
			autoClose: 3500,
		});
	},
};
