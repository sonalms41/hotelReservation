import React, { useEffect, useState } from "react";
import { Redirect } from "react-router-dom";
import services from "../../services";
import CustomLoader from "../CustomLoader";
import PageLayout from "../../HOC/PageLayout";

import { LOCAL_STORAGE, toastNotification } from "../../utilities";
const EsewaPaymentSuccessPage = () => {
	const [paySuccess, setPaySuccess] = useState(false);
	const [isLoading, setIsLoading] = useState(true);

	useEffect(() => {
		const url = window.location.href;
		const urlValues = window.location.search;

		const arrUrlValues = urlValues.split("?")[1].split("&");
		let objUrlValues = {};
		for (let i = 0; i < arrUrlValues.length; i++) {
			const values = arrUrlValues[i].split("=");
			objUrlValues = { ...objUrlValues, [values[0]]: values[1] };
		}
		console.log("obj-urlValues:", objUrlValues);
		console.log("url:", url);

		const postValue = {
			ref_id: objUrlValues.refId,
			pid: objUrlValues.oid,
			amount: parseInt(objUrlValues.amt),
			guest_id: objUrlValues.guest_id,
			user_id: objUrlValues.user_id,
		};
		console.log("esewa-post-value:", postValue);
		services.POST.esewaPay(postValue)
			.then((response) => {
				console.log("esewa-response:", response);
				const { data } = response;
				if (data.status_code === 200) {
					toastNotification.success(data.message);

					//REMOVE ITEMS (array of items) FROM LOCAL-STORAGE
					//(pre - booking - statu, reoom - config, booking - basic - info, booking - saved - info)
					LOCAL_STORAGE.removeItems([
						"_pre_b_status",
						"_room_config",
						"_b_baseInf",
						"_b_savedInf",
					]);
					setPaySuccess(true);
				}
				if (data.status_code === 400) {
					toastNotification.warn(data.message);
				}

				setIsLoading(false);
			})
			.catch((errors) => {
				setIsLoading(false);
				console.error(errors);
			});
	}, []);

	if (paySuccess) {
		return <Redirect to="/bookingConfirmationDetail" />;
	}
	return (
		<>
			<CustomLoader isLoading={isLoading} />
			<PageLayout innerPage={true}>
				<div className="container">
					<div className="payment-status-page payment-status-page--success">
						<h1 className="text-center">Pay with eSewa Success!!</h1>
					</div>
				</div>
			</PageLayout>
		</>
	);
};

export default EsewaPaymentSuccessPage;
