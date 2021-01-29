import React, { useEffect, useState } from "react";
import KhaltiCheckout from "khalti-checkout-web";
import { Redirect } from "react-router-dom";
import services from "../../services";
import { LOCAL_STORAGE, toastNotification } from "../../utilities";
export const Khalti = ({ bookingData }) => {
	const [totalAmount, setTotalAmount] = useState(null);
	const [guestId, setGuestId] = useState(null);
	const [userId, setUserId] = useState(null);
	const [paymentSuccess, setPaymentSuccess] = useState(false);
	const [payload, setPayLoad] = useState(null);

	useEffect(() => {
		if (bookingData !== undefined) {
			setTotalAmount(bookingData.totRoomPrice);
			setGuestId(bookingData.guest_id);
			setUserId(bookingData.userId);
		}
	}, [bookingData]);

	// Verify-payment
	useEffect(() => {
		if (payload) {
			const postValues = {
				token: payload.token,
				amount: payload.amount / 100, // amount in paisa to rupees
				guest_id: guestId,
				user_id: userId,
			};
			services.POST.payWithKhalti(postValues)
				.then((response) => {
					if (response.status === 200) {
						toastNotification.success(response.data.message);
						setPaymentSuccess(true);

						//REMOVE ITEMS (array of items) FROM LOCAL-STORAGE
						//(pre - booking - statu, reoom - config, booking - basic - info, booking - saved - info)
						LOCAL_STORAGE.removeItems([
							"_pre_b_status",
							"_room_config",
							"_b_baseInf",
							"_b_savedInf",
						]);
					}
					if (response.status === 400) {
						toastNotification.warn(response.data.message);
					}
				})
				.catch((errors) => {
					toastNotification.error(errors);
				});
		}
	}, [payload]);

	// Cnfig
	const khaltiConfig = {
		publicKey: "test_public_key_bbe8500bd845495b884cbaaa7455e2be",
		secretkey: "test_secret_key_73bc22857bf54e7cba5e994635cf941a",
		productIdentity: "1234567890",
		productName: "ConnectingNepal",
		productUrl: "http://connectingsoft.com.np",
		eventHandler: {
			onSuccess(payload) {
				setPayLoad(payload);
			},
			// onError handler is optional
			onError(error) {
				// handle errors
				console.error(error);
			},
			onClose() {
				toastNotification.warn("widget is closing");
			},
		},
		paymentPreference: ["KHALTI", "SCT", "EBANKING"],
	};

	const checkout = new KhaltiCheckout(khaltiConfig);
	const handlePayment = () => {
		const totAmountInPaisa = totalAmount * 100;
		checkout.show({ amount: totAmountInPaisa });
	};

	// If Payment success then redirect to booking-confirmation-detail page
	if (paymentSuccess) {
		return <Redirect to="/bookingConfirmationDetail" />;
	}
	return (
		<>
			<div classes="khalti">
				<button
					type="submit"
					className="utl-btn utl-btn-fifth"
					onClick={handlePayment}
				>
					NPR <strong> {totalAmount}, </strong> Pay With Khalti
				</button>
			</div>
		</>
	);
};
