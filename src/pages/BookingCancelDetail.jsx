import React, { useState, useEffect, useRef } from "react";
import { Redirect, Link } from "react-router-dom";
import PageLayout from "../HOC/PageLayout";
import services from "../services";
import { toastNotification, getFromLocal } from "../utilities";

import ConfirmationLandingPage from "../components/ConfirmationLandingPage";
import ReactToPrint from "react-to-print";
import CustomLoader from "../components/CustomLoader";

const BookingCanceledDetail = () => {
	const [bookedDetail, setBookedDetail] = useState();
	const [bookingData, setBookingData] = useState();
	const [bookingSuccess, setBookingSuccess] = useState(false);
	const [isLoading, setIsLoading] = useState(false);
	const [reBookingData, setReBookingData] = useState(null);
	const componentRef = useRef();

	useEffect(() => {
		const bookedResponseData = getFromLocal("_b_confInf");
		const bookingSavedInfo = getFromLocal("_b_savedInf");
		const basicInfo = getFromLocal("_b_baseInf");
		setReBookingData({
			...bookingSavedInfo,
			...basicInfo,
		});

		if (bookedResponseData !== undefined) {
			setBookedDetail(bookedResponseData);
		}
	}, []);
	if (reBookingData !== null) {
	}
	// Booking-again
	const handleBookingAgain = () => {
		if (reBookingData !== null) {
			setIsLoading(true);
			const postValue = {
				property_id: parseInt(reBookingData.propId),
				user_id: parseInt(reBookingData.userId),
				booking_id: reBookingData.bookingId,
				checkin: reBookingData.startDate,
				checkout: reBookingData.endDate,
				no_of_rooms: reBookingData.nRooms,
				no_of_adults: reBookingData.nAdults,
				room_conf:
					reBookingData.rooms &&
					reBookingData.rooms.map((room, i) => {
						return {
							sub_type: room.roomName,
							no_of_room: parseInt(room.roomSelectedNo),
							price: room.roomPrice,
						};
					}),
			};

			services.POST.bookingConfirm(postValue)
				.then((response) => {
					response.data.status_code === 200 &&
						setTimeout(() => {
							setBookingSuccess(true);
						}, 300);
					toastNotification.success(response.data.message);

					response.data.status_code === 400 &&
						toastNotification.info(response.data.message);
					setIsLoading(false);
				})
				.catch((errors) => {
					toastNotification.error(`${errors}`);
					setIsLoading(false);
				});
		}
	};
	if (bookingSuccess) {
		return (
			<Redirect
				to={{
					pathname: "/bookingConfirmationDetail",
					bookedDetail,
					bookingData,
				}}
			/>
		);
	}

	return (
		<>
			<CustomLoader isLoading={isLoading} />
			<PageLayout innerPage={true}>
				<div className="booking-cancel-detail">
					<div className="container">
						{bookedDetail && (
							<div className="booking-cancel-detail__header  col-wrapper flex-aC ">
								<div className="col-item col-item--lg-8">
									<h3 className="cancel-booking">
										Your Booking has been Cancelled
									</h3>
									<p>
										You will soon receive an email confirmation on{" "}
										<strong>{bookedDetail.email}</strong>
									</p>
								</div>
								<div className="col-item col-item--lg-4">
									<div className="btn-wrap text-right btn-print">
										<ReactToPrint
											trigger={() => <button>Print this out!</button>}
											content={() => componentRef.current}
										/>
									</div>
								</div>
							</div>
						)}

						{bookedDetail && (
							<div className="booking-cancel-detail__body">
								<ConfirmationLandingPage
									bookedDetail={bookedDetail}
									ref={componentRef}
									bodyClass="booking-confirm-detail__body"
								/>

								<div className="utl-row btn-wrap utl-row-5 page-bottom  flex-aC-jFE">
									<Link className="a-underline" to="/userProfile/booking">
										Go To Recent Cancelled
									</Link>
									<button
										className="utl-btn utl-btn-fifth width-auto"
										onClick={handleBookingAgain}
									>
										Book Again
									</button>
								</div>

								{/*End utl-row-5*/}
							</div>
						)}
					</div>
				</div>
			</PageLayout>
		</>
	);
};

export default BookingCanceledDetail;
