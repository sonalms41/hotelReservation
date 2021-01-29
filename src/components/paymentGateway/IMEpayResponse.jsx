import React, { useEffect, useState } from "react";
import PageLayout from "../../HOC/PageLayout";
import { Base64 } from "js-base64";
import { LOCAL_STORAGE, USER_AUTH } from "../../utilities";
import services from "../../services";
import { Redirect } from "react-router-dom";

const IMEpayResponse = () => {
	const [
		redirectToBookingConfirmationDetail,
		setRedirectToBookingConfirmationDetail,
	] = useState(false);

	useEffect(() => {
		const urlValues = window.location.search;
		const arrUrlValues = urlValues.split("?")[1].split("=");
		const encodedData = arrUrlValues[1];
		const MERCHANT_CODE = "HAMROHOTL";

		// Decode-data
		const data = Base64.decode(encodedData);
		console.log("data", data);

		// Data store in array
		const arrData = data.split("|");
		console.log("arrData:", arrData);
		// Data store in array
		const objData = {
			ResponseCode: arrData[0],
			ResponseDescription: arrData[1],
			Msisdn: arrData[2],
			TransactionId: arrData[3],
			RefId: arrData[4],
			TranAmount: arrData[5],
			TokenId: arrData[6].replace(/[^0-9]/g, ""), // Remove except number
		};
		console.log("objData:", objData);

		const { Msisdn, TransactionId, RefId, TokenId } = objData;

		const postValuesToConfirmByIMEpay = {
			MerchantCode: MERCHANT_CODE,
			RefId,
			TokenId,
			TransactionId,
			Msisdn,
		};

		console.log("postValuesToConfirmByIMEpay", postValuesToConfirmByIMEpay);
		services.POST.IMEpayConfirmationByIME(postValuesToConfirmByIMEpay)
			.then((response) => {
				console.log("confirmResponseByIMEpay:", response);
				const { data } = response;
				if (data.ResponseDescription === "Success") {
					const postValToValidateByBackend = {
						RefId: objData.RefId,
						amount: objData.TranAmount,
						TransactionId: objData.TransactionId,
						Msisdn: objData.Msisdn,
						guest_id: LOCAL_STORAGE.getItem("_g_id"),
						user_id: USER_AUTH.getUserID(),
						token: objData.TokenId,
					};

					console.log(
						"post-val-to-validateByBackend:",
						postValToValidateByBackend,
					);

					services.POST.IMEpayValidationByBackend(postValToValidateByBackend)
						.then((response) => {
							console.log("validationResponseByBackend:", response);
							if (response.data.status_code === 200) {
								setRedirectToBookingConfirmationDetail(true);
							}
						})
						.catch((errors) => {
							console.log("errors:", errors);
						});
				}
			})
			.catch((errors) => {
				console.error(errors);
			});

		const guestId =
			LOCAL_STORAGE.getItem("_b_confInf") &&
			LOCAL_STORAGE.getItem("_b_confInf").guest_id;

		console.log("guestId", guestId);
	});

	if (redirectToBookingConfirmationDetail) {
		return <Redirect to={"/bookingConfirmationDetail"} />;
	}
	return (
		<>
			<PageLayout innerPage={true}>
				<div className="container">
					<div className="payment-status-page payment-status-page--success">
						<h1>IME Payment Success</h1>
					</div>
				</div>
			</PageLayout>
		</>
	);
};

export default IMEpayResponse;
