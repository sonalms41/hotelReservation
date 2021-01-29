import React, { useEffect, useState } from "react";
import { v4 as uuidv4 } from "uuid";

export const Esewa = ({ bookingData }) => {
	const [totalAmount, setTotalAmount] = useState(null);
	const [amountWithoutVat, setAmountWithoutVat] = useState(null);
	const [vatAmount, setVatAmount] = useState(null);
	const [userId, setUserId] = useState(null);
	const [guestId, setGuestId] = useState(null);

	useEffect(() => {
		if (bookingData !== undefined) {
			setTotalAmount(bookingData.totRoomPrice);
			setAmountWithoutVat(bookingData.totPriceWithoutVat);
			setVatAmount(bookingData.totVatAmount);
			setGuestId(bookingData.guest_id);
			setUserId(bookingData.userId);
		}
	}, [bookingData]);

	const hostUrl = "https://hamrohotel.com";
	//const hostUrl = "https://dev.hamrohotel.com";
	const eSewa = "https://uat.esewa.com.np/epay/main";
	const pid = `hamroHotelEsewa${uuidv4()}sfdfs`;
	const merchantCode = "EPAYTEST"; // DEFAULT
	const successURL = `${hostUrl}/payWithEsewaSuccess?q=su&guest_id=${guestId}&user_id=${userId}`;
	const failureURL = `${hostUrl}/payWithEsewaFail?q=fu`;

	return (
		<div className="e-sewa">
			<form action={eSewa} method="POST">
				<input value={totalAmount} name="tAmt" type="hidden" />
				<input value={amountWithoutVat} name="amt" type="hidden" />
				<input value={vatAmount} name="txAmt" type="hidden" />
				<input value="0" name="psc" type="hidden" />
				<input value="0" name="pdc" type="hidden" />
				<input value={merchantCode} name="scd" type="hidden" />
				<input value={pid} name="pid" type="hidden" />
				<input value={successURL} type="hidden" name="su" />
				<input value={failureURL} type="hidden" name="fu" />
				<button type="submit" type="submit" className="utl-btn utl-btn-fifth">
					NPR <strong> {totalAmount}, </strong> Pay With eSewa
				</button>
			</form>
		</div>
	);
};
