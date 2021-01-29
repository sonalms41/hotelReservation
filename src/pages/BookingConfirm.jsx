import React, { useEffect, useState, useContext, useRef } from "react";
import PageLayout from "../HOC/PageLayout";
import services from "../services";
import BookingPaymentDetail from "../components/BookingPaymentDetail";
import { LOCAL_STORAGE, toastNotification } from "../utilities";
import { PayWithKhaltiContext } from "../HOC/Context";
import CustomLoader from "../components/CustomLoader";
import ModalPopUp from "../components/ModalPopUp";

import { Esewa, IMEpay, Khalti } from "../components/paymentGateway";
import esewaLogo from "./../assets/images/logo-esewa.png";
import khaltiLogo from "./../assets/images/logo-khalti.png";
import IMEpayLogo from "./../assets/images/logo-IMEpay.png";

import { Redirect } from "react-router-dom";

const BookingConfirm = () => {
	const { payWithKhaltiSuccess } = useContext(PayWithKhaltiContext);
	const submitBtnRef = useRef();

	const [bookingConfirmed, setBookingConfirmed] = useState(false);
	const [isLoading, setIsLoading] = useState(false);
	const [showPaymentOptions, setShowPaymentOptions] = useState(false);

	const [proceedToConfirmPayment, setProceedToConfirmPayment] = useState(false);

	const [paymentMethod, setPaymentMethod] = useState({
		atHotel: true,
		eSewa: false,
		khalti: false,
		IMEpay: false,
	});
	const [cancelledBookingProcess, setCancelledBookingProcess] = useState(false);
	const [showCancelConfirmation, setShowCancelConfirmation] = useState(false);

	const [bookingData, setBookingData] = useState(null);
	useEffect(() => {
		const bookingSavedInfo = {
			...LOCAL_STORAGE.getItem("_b_savedInf"),
			...LOCAL_STORAGE.getItem("_b_baseInf"),
		};
		if (bookingSavedInfo !== undefined) {
			setBookingData(bookingSavedInfo);
		}
	}, []);

	const handleBookingConfirm = () => {
		setIsLoading(true);

		// Combine same sub-room-type in a single array
		var arrSameRooms = bookingData.roomConfig.reduce((a, b) => {
			var itemIndex = a.findIndex(
				(item) => item.sub_room_type === b.sub_room_type,
			);
			return (
				itemIndex === -1
					? a.push({
							sub_room_type: b.sub_room_type,
							nRooms: 1,
							pricePerRoomBeforeVat: b.price_without_vat,
							pricePerRoomAfterVat: b.roomPrice,
					  })
					: a[itemIndex].nRooms++,
				a
			);
		}, []);

		const postValue = {
			property_id: parseInt(bookingData.propId),
			user_id: parseInt(bookingData.userId),
			booking_id: bookingData.bookingId,
			checkin: bookingData.startDate,
			checkout: bookingData.endDate,
			no_of_rooms: bookingData.nRooms,
			no_of_adults: bookingData.nAdults,
			payment_method: bookingData.payment_method,
			room_conf:
				arrSameRooms &&
				arrSameRooms.map((room, i) => {
					return {
						sub_type: room.sub_room_type,
						no_of_room: room.nRooms,
						price: room.pricePerRoomAfterVat * room.nRooms,
					};
				}),
		};
		services.POST.bookingConfirm(postValue)
			.then((response) => {
				const data = response.data;
				console.log("booking-data-response:", data);
				if (data.status_code === 200) {
					setBookingData({
						...bookingData,
						guest_id: data.result.guest_id,
					});

					// STORE BOOKING-CONFIRMED DATA IN LOCAL-STORAGE

					LOCAL_STORAGE.setItem("_b_confInf", {
						...data.result,
					});
					LOCAL_STORAGE.setItem("_pre_b_status", "success");
					LOCAL_STORAGE.setItem("_g_id", data.result.guest_id);
					setShowPaymentOptions(true);
				}
				if (data.status_code === 400) {
					toastNotification.warn(data.message);
				}
				setIsLoading(false);
			})
			.catch((errors) => {
				toastNotification.error(`${errors}`);
				setIsLoading(false);
			});
	};

	const handleChangePayMethod = (e) => {
		const initialMethod = {
			atHotel: false,
			eSewa: false,
			khalti: false,
			IMEpay: false,
		};
		const targetMethod = e.target.id;
		if (targetMethod === "paymentMethodEsewa") {
			setPaymentMethod({ ...initialMethod, eSewa: true });
		} else if (targetMethod === "paymentMethodKhalti") {
			setPaymentMethod({ ...initialMethod, khalti: true });
		} else if (targetMethod === "paymentMethodIMEpay") {
			setPaymentMethod({ ...initialMethod, IMEpay: true });
		} else setPaymentMethod({ ...initialMethod, atHotel: true });
	};

	const handleProceedToPayment = () => {
		setShowPaymentOptions(false);
		if (paymentMethod.atHotel) {
			toastNotification.success("Booking Success!");

			//REMOVE ITEMS (array of items) FROM LOCAL-STORAGE
			//(pre-booking-statu, room-config, booking-basic-info, booking-saved-info)
			LOCAL_STORAGE.removeItems([
				"_pre_b_status",
				"_room_config",
				"_b_baseInf",
				"_b_savedInf",
			]);

			setBookingConfirmed(true);
		} else setProceedToConfirmPayment(true);
	};

	const handleCancelBookingProcess = () => {
		toastNotification.error("Booking Process Has Been Cancelled");
		LOCAL_STORAGE.removeItems([
			"_pre_b_status",
			"_b_baseInf",
			"_b_confInf",
			"_b_savedInf",
		]);
		setCancelledBookingProcess(true);
	};
	if (cancelledBookingProcess) {
		return <Redirect to="/" />;
	}
	if (bookingConfirmed || payWithKhaltiSuccess) {
		return <Redirect to="/bookingConfirmationDetail" />;
	}
	return (
		<>
			<CustomLoader isLoading={isLoading} />
			<PageLayout innerPage={true}>
				{bookingData && (
					<div className="booking-confirmaion">
						<div className="container">
							<div className="booking-confirmation__header">
								<h3 className="heading-tertiary">Booking Confirmation</h3>
							</div>
							<div className="booking-confirmation__content">
								<div className="col-wrapper">
									<div className="col-item col-item--lg-8">
										<div className="confirmation-wrap">
											<div className="utl-row basic-info">
												<h4>Your Info</h4>
												<p>
													We will use these details to share your booking
													information
												</p>
												{bookingData && (
													<ul className="info-ul">
														<li>
															<strong>
																{bookingData.firstName} {bookingData.lastName}
															</strong>
														</li>
														<li>{bookingData.phone}</li>
														<li>{bookingData.email}</li>
													</ul>
												)}
											</div>

											{bookingData !== null &&
												bookingData.bookingFor === "For someone else" &&
												bookingData.bookingConfig &&
												bookingData.bookingConfig.map((room, i) => {
													return (
														<div
															className="utl-row info-room"
															key={`booked_room-${i}`}
														>
															<h4> {room.sub_room_type}</h4>
															<table>
																<thead>
																	<tr>
																		<th className="utl-col utl-col-1">
																			Guests
																		</th>
																		<th className="utl-col utl-col-2">Name</th>
																		<th className="utl-col utl-col-3">Email</th>
																		<th className="utl-col utl-col-4">
																			Phone Number
																		</th>
																	</tr>
																</thead>
																<tbody>
																	<tr>
																		<td className="utl-col utl-col-1">
																			{room.no_of_guset}
																		</td>
																		<td className="utl-col utl-col-2">
																			{room.full_name}
																		</td>
																		<td className="utl-col utl-col-3">
																			{room.email}
																		</td>
																		<td className="utl-col utl-col-4">
																			{" "}
																			{room.phone}
																		</td>
																	</tr>
																</tbody>
															</table>
														</div>
													);
												})}
										</div>
										<div className="btn-wrapper  text-right">
											<button
												className="utl-btn utl-btn-primary utl-btn-bigscreen"
												onClick={handleBookingConfirm}
												ref={submitBtnRef}
											>
												{bookingData.payment_method === "at_hotel"
													? "Complete Booking"
													: "Continue Booking"}
											</button>
										</div>
									</div>
									<div className="col-item col-item--lg-4">
										{bookingData !== null && (
											<BookingPaymentDetail bookingData={bookingData} />
										)}
									</div>
								</div>
								<div className="btn-on-small-screen">
									<button
										className="utl-btn utl-btn-primary utl-btn-smallscreen"
										onClick={() => submitBtnRef.current.click()}
									>
										{bookingData.payment_method === "at_hotel"
											? "Complete Booking"
											: "Continue Booking"}
									</button>
								</div>
							</div>
						</div>
					</div>
				)}
			</PageLayout>

			{/*PAYMENT-METHOD*/}
			<ModalPopUp
				visibleModal={
					showPaymentOptions ||
					LOCAL_STORAGE.getItem("_pre_b_status") === "success" // If the pre-booking process is complete
				}
				//visibleModal={true}
				className="modal-popup--paymentoptions"
				closeModal={() => {
					setShowCancelConfirmation(true);
				}}
				closeButtonText="cancel"
				showCancelConfirmationModal={showCancelConfirmation}
				cancelConfirmMessage="Are you sure to cancel booking process ?"
				yesToCancel={handleCancelBookingProcess}
				noToCancel={() => {
					setShowCancelConfirmation(false);
				}}
				cancelConfirmationModalPosition="bottom"
			>
				<div className="payment-options">
					<h3>Payment Method</h3>
					<div className="form-group-multiple">
						<div className="payment-options__offline item form-group">
							<input
								id="paymentMethodOffline"
								name="payment_method"
								type="radio"
								onClick={handleChangePayMethod}
								checked={paymentMethod.atHotel}
							/>
							<label htmlFor="paymentMethodOffline">Pay at Hotel</label>
						</div>
						<div className="payment-options__khalti item form-group">
							<input
								id="paymentMethodKhalti"
								name="payment_method"
								type="radio"
								onClick={handleChangePayMethod}
								checked={paymentMethod.khalti}
							/>

							<label htmlFor="paymentMethodKhalti">
								{/*<span>Pay With Khalti</span>*/}
								<img src={khaltiLogo} alt="Pay with Khalti" />
							</label>
						</div>
						<div className="payment-options__esewa item form-group">
							<input
								id="paymentMethodEsewa"
								name="payment_method"
								type="radio"
								onClick={handleChangePayMethod}
								checked={paymentMethod.esewa}
							/>

							<label htmlFor="paymentMethodEsewa">
								{/*<span>Pay With Khalti</span>*/}
								<img src={esewaLogo} alt="Pay with Esewa" />
							</label>
						</div>
						<div className="payment-options__IMEpay item form-group">
							<input
								id="paymentMethodIMEpay"
								name="payment_method"
								type="radio"
								onClick={handleChangePayMethod}
								checked={paymentMethod.IMEpay}
							/>

							<label htmlFor="paymentMethodIMEpay">
								{/*<span>Pay With Khalti</span>*/}
								<img src={IMEpayLogo} alt="Pay with Esewa" />
							</label>
						</div>
					</div>
				</div>
				<button
					className="utl-btn utl-btn-fifth"
					onClick={handleProceedToPayment}
				>
					Continue
				</button>
			</ModalPopUp>
			{proceedToConfirmPayment && paymentMethod.eSewa && (
				<ModalPopUp
					visibleModal={paymentMethod.eSewa}
					closeModal={() => {
						setProceedToConfirmPayment(false);
						setShowPaymentOptions(true);
					}}
					className="modal-popup--paymentoptions modal-epayment"
				>
					<div className="modal-epayment__img">
						<img src={esewaLogo} alt="Pay with esewa" />
					</div>
					<div className="modal-epayment__btn">
						<Esewa bookingData={bookingData} />
					</div>
				</ModalPopUp>
			)}

			{proceedToConfirmPayment && paymentMethod.khalti && (
				<ModalPopUp
					visibleModal={paymentMethod.khalti}
					closeModal={() => {
						setProceedToConfirmPayment(false);
						setShowPaymentOptions(true);
					}}
					className="modal-popup--paymentoptions modal-epayment"
				>
					<div className="modal-epayment__img">
						<img src={khaltiLogo} alt="Pay with Khalti" />
					</div>
					<div className="modal-epayment__btn">
						<Khalti bookingData={bookingData} />
					</div>
				</ModalPopUp>
			)}

			{proceedToConfirmPayment && paymentMethod.IMEpay && (
				<ModalPopUp
					visibleModal={paymentMethod.IMEpay}
					closeModal={() => {
						setProceedToConfirmPayment(false);
						setShowPaymentOptions(true);
					}}
					className="modal-popup--paymentoptions modal-epayment"
				>
					<div className="modal-epayment__img">
						<img src={IMEpayLogo} alt="Pay with IMEpay" />
					</div>
					<div className="modal-epayment__btn">
						<IMEpay bookingData={bookingData} />
					</div>
				</ModalPopUp>
			)}
		</>
	);
};

export default BookingConfirm;
