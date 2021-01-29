import KhaltiCheckout from "khalti-checkout-web";
import services from "../../services";
import { saveInLocal, toastNotification } from "../../utilities";

var guest_id = null;
var user_id = null;
const khaltiConfig = {
	// replace this key with yours
	publicKey: "test_public_key_bbe8500bd845495b884cbaaa7455e2be",
	secretkey: "test_secret_key_73bc22857bf54e7cba5e994635cf941a",
	productIdentity: "1234567890",
	productName: "ConnectingNepal",
	productUrl: "http://connectingsoft.com.np",
	eventHandler: {
		onSuccess(payload) {
			const postValues = {
				token: payload.token,
				amount: payload.amount / 100, // amount in paisa to rupees
				guest_id,
				user_id,
			};

			services.POST.khaltiPayment(postValues)
				.then((response) => {
					if (response.status === 200) {
						toastNotification.success(response.data.message);
						saveInLocal("_pmt", "success");
						//localStorage.setItem("_pmt", "success");
						setTimeout(() => {
							window.location.reload();
						}, 1000);
					}

					if (response.status === 400) {
						toastNotification.warn(response.data.message);
					}
				})
				.catch((errors) => {
					toastNotification.error(errors);
				});
		},
	},

	paymentPreference: ["KHALTI"],
};

let khaltiCheckout = new KhaltiCheckout(khaltiConfig);
export const handlePayWithKhalti = (amount, guestId, userId) => {
	guest_id = guestId;
	user_id = userId;
	khaltiCheckout.show({ amount });
};
