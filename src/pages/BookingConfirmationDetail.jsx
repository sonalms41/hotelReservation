import React, { useState, useEffect, useRef, useContext } from "react";
import PageLayout from "../HOC/PageLayout";
import { CancelReasonContext } from "../HOC/Context";
import BookingCancelReason from "./../components/BookingCancelReason";
import { Redirect, Link } from "react-router-dom";
import services from "../services";
import { USER_AUTH, LOCAL_STORAGE, toastNotification } from "../utilities";
import ConfirmationLandingPage from "./../components/ConfirmationLandingPage";
import ReactToPrint from "react-to-print";

const BookingConfirmationDetail = () => {
	const { cancelReason } = useContext(CancelReasonContext);
	const userId = USER_AUTH.getUserID();
	const [showModal, setShowModal] = useState(false);
	const [bookedDetail, setBookedDetail] = useState();
	const [cancelBooking, setCancelBooking] = useState(false);
	const componentRef = useRef();

	useEffect(() => {
		const bookedResponseData = LOCAL_STORAGE.getItem("_b_confInf");
		if (bookedResponseData !== undefined) {
			console.log("bookedResponseData:", bookedResponseData);
			setBookedDetail(bookedResponseData);
		}
	}, []);

	// Cancel-booking
	const handleCancelBooking = () => {
		const postValues = {
			instance_id: bookedDetail.single_instance,
			user_id: userId,
			message: cancelReason,
		};
		if (cancelReason === "") {
			toastNotification.warn("Cancel Reason Is required !");
		} else
			services.POST.cancelBooking(postValues)
				.then((response) => {
					const data = response.data;
					if (data.status_code === 200) {
						setCancelBooking(true);
						toastNotification.success(data.message);
					}
					if (data.status_code === 400) {
						toastNotification.info(data.message);
					}
				})
				.catch((errors) => {
					toastNotification.error(`${errors}`);
				});
	};

	// If cancelled booking then redirect to cancelled detail
	if (cancelBooking) {
		return <Redirect to="/bookingCancelledDetail" />;
	}
	return (
		<>
			<PageLayout innerPage={true}>
				<div className="booking-confirm-detail">
					<div className="container">
						{bookedDetail && (
							<div className="booking-confirm-detail__header col-wrapper flex-aC ">
								<div className="col-item col-item--lg-8">
									<h3>Great! Your stay is confirmed</h3>
									<p>
										You will soon receive an email confirmation on{" "}
										<strong>{bookedDetail.email}</strong>
									</p>
								</div>
								<div className="col-item col-item--lg-4">
									<div className="btn-print text-right">
										<ReactToPrint
											trigger={() => <button>Print</button>}
											content={() => componentRef.current}
										/>
									</div>
								</div>
							</div>
						)}
						{bookedDetail && (
							<div className="booking-confirm-detail__body">
								<ConfirmationLandingPage
									bookedDetail={bookedDetail}
									ref={componentRef}
									bodyClass="booking-confirm-detail__body"
								/>

								<div className="page-bottom flex-aC-jFE">
									<span
										className="a-underline a-cancel"
										onClick={() => {
											setShowModal(true);
										}}
									>
										Cancel Booking
									</span>
									<Link
										className="utl-btn utl-btn-fifth width-auto "
										to="/userProfile/booking"
									>
										Go To Recent Booking
									</Link>
								</div>
								{/*End utl-row-5*/}
							</div>
						)}
					</div>
				</div>
			</PageLayout>

			<BookingCancelReason
				showModal={showModal}
				closeModal={() => setShowModal(false)}
				cancelBooking={handleCancelBooking}
			/>
		</>
	);
};

export default BookingConfirmationDetail;
