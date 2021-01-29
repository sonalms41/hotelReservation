import React, { useState, useRef } from "react";
import services from "../../services";
import CustomLoader from "../CustomLoader";

export const IMEpay = ({ bookingData }) => {
	const submitBtnRef = useRef();
	// resp: POST-response
	const [respTokenID, setRespTokenID] = useState(null);
	const [respAmount, setRespAmount] = useState(null);
	const [respRefID, setRespRefID] = useState(null);

	const [isLoading, setIsLoading] = useState(false);
	const hostURL = "https://hamrohotel.com";
	//const hostURL = "https://dev.hamrohotel.com";
	const action = "https://stg.imepay.com.np:7979/WebCheckout/Checkout";
	const responseURL = `${hostURL}/payWithIMEpayResponse`;
	const cancelURL = `${hostURL}/payWithIMEpayCancel`;
	const MerchantCode = "HAMROHOTL";
	const RefId = bookingData && `ha${bookingData.bookingId}`;
	const Amount = "11";
	const method = "GET";

	// Get Token-Id
	const handleGetTokenId = () => {
		setIsLoading(true);
		const postValue = {
			MerchantCode,
			Amount,
			RefId,
		};
		console.log("IMEpay-post-val:", postValue);

		services.POST.IMEpayGetToken(postValue)
			.then((response) => {
				console.log("IMEpay-response:", response);
				const { data } = response;
				if (response.status === 200) {
					setRespTokenID(data.TokenId);
					setRespAmount(data.Amount);
					setRespRefID(data.RefId);
					setTimeout(() => {
						submitBtnRef.current.click();
					}, 300);
				}
				setIsLoading(false);
			})
			.catch((errors) => {
				console.error(errors);
				setIsLoading(false);
			});
	};

	return (
		<>
			<CustomLoader isLoading={isLoading} />
			<form action={action} method="post">
				<input
					type="hidden"
					name="TokenId"
					value={respTokenID && respTokenID}
				/>
				<input type="hidden" name="MerchantCode" value={MerchantCode} />
				<input type="hidden" name="RefId" value={respRefID && respRefID} />
				<input
					type="hidden"
					name="TranAmount"
					value={respAmount && respAmount}
				/>
				<input type="hidden" name="Method" value={method} />
				<input type="hidden" name="RespUrl" value={responseURL} />
				<input type="hidden" name="CancelUrl" value={cancelURL} />
				<input type="submit" ref={submitBtnRef} style={{ display: "none" }} />
			</form>
			<button onClick={handleGetTokenId} className="utl-btn utl-btn-fifth">
				Pay with IME pay
			</button>
		</>
	);
};
