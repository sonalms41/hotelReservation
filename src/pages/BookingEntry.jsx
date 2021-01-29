import React, {
	useEffect,
	useState,
	Fragment,
	useRef,
	useLayoutEffect,
} from "react";
import { Redirect, useParams } from "react-router-dom";

// Components
import BookingPaymentDetail from "./../components/BookingPaymentDetail";
import PageLayout from "../HOC/PageLayout";
import services from "../services";
import CustomLoader from "../components/CustomLoader";
import { toastNotification, LOCAL_STORAGE, USER_AUTH } from "../utilities";
import ConfirmationModal from "../components/ConfirmationModal";
import {
	isPossiblePhoneNumber,
	isValidPhoneNumber,
	parsePhoneNumber,
} from "react-phone-number-input";

// Images
import PhoneNumberInput from "../components/PhoneNumberInput";

const BookingEntry = () => {
	const USER_ID = USER_AUTH.getUserID();
	const USER_TOKEN = USER_AUTH.getToken();
	const PROPERTY_ID = useParams().id;

	const [userLoging, setuserLogin] = useState(true);
	const [userPhone, setUserPhone] = useState(null);
	const [phCountry, setPhCountry] = useState(null);

	const paymentDetailCardRef = useRef();
	const pageBottomRef = useRef();
	const submitBtnRef = useRef();

	const [pageYOffset, setPageYOffset] = useState(null);
	const [payDetailDivBound, setPayDetailDivBound] = useState({
		x: null,
		y: null,
	});
	const [pageBottomDivBound, setPageBottomDivBound] = useState({
		x: null,
		y: null,
	});

	const [primaryFormData, setPrimaryFormData] = useState(null);
	const [isLoading, setIsLoading] = useState(false);
	const [formSubmitted, setFormSubmitted] = useState(false);
	const [bookingData, setBookingData] = useState(null);
	const [removeRoomId, setRemoveRoomId] = useState(null);

	const [roomConfig, setRoomConfig] = useState([
		{
			roomPrice: "",
			roomType: "",
			id: "",
			arrGuestsOption: "",
			sub_room_type: "",
			no_of_guset: "",
			full_name: "",
			phone: "",
			email: "",
		},
	]);
	const [businessTraveller, setBusinessTraveller] = useState(true);
	const [bookingForVal, setBookingForVal] = useState("For me");
	const [bookingForOther, setBookingForOther] = useState(false);

	useEffect(() => {
		if (!USER_ID && !USER_TOKEN) {
			setuserLogin(false);
		}
	}, []);
	// Handle-sticky payment-detail-div
	window.addEventListener("scroll", () => {
		setPageYOffset(window.pageYOffset);
	});
	useLayoutEffect(() => {
		if (paymentDetailCardRef.current) {
			const payDetailCardBound = paymentDetailCardRef.current.getBoundingClientRect();
			const pageBottom = pageBottomRef.current.getBoundingClientRect();

			setPayDetailDivBound({
				x: payDetailCardBound.x,
				y: payDetailCardBound.y,
				width: payDetailCardBound.width,
			});
			setPageBottomDivBound({
				x: pageBottom.x,
				y: pageBottom.y,
			});
		}
	}, [pageYOffset]);

	// REGISTERED-USER DETAIL
	const getRegisteredUserDetail = () => {
		setIsLoading(true);
		if (USER_ID) {
			services.GET.registeredUser(USER_ID)
				.then((response) => {
					if (response.data.status_code === 200) {
						const userDetail = response.data.result;
						setPrimaryFormData({
							first_name: userDetail.user_first_name,
							last_name: userDetail.user_last_name,
							phone_number: userDetail.user_phone_number,
							email: userDetail.user_email,
							user_id: USER_ID,
						});
					}
					setIsLoading(false);
				})
				.catch((errors) => {
					toastNotification.error(errors);
					setIsLoading(false);
				});
		}
	};

	// SELECTED-ROOM-DETAILS
	const getSelectedRoomDetails = () => {
		setIsLoading(true);

		// Get booking basic information from local-storate (These data are save from property-detail page)
		const bookingBasicInfo = LOCAL_STORAGE.getItem("_b_baseInf");
		if (bookingBasicInfo !== undefined) {
			setBookingData(bookingBasicInfo);
			setRoomConfig(bookingBasicInfo.roomConfig);
		}
		setIsLoading(false);
	};

	useEffect(() => {
		getRegisteredUserDetail();
		getSelectedRoomDetails();
	}, []);

	const optionBusinessTraveller = [
		{
			key: true,
			value: true,
		},
		{
			key: false,
			value: false,
		},
	];

	const optionBookingFor = [
		{
			key: "For me",
			value: "For me",
		},
		{
			key: "For someone else",
			value: "For someone else",
		},
	];

	const handleBookingFor = (value) => {
		setBookingForVal(value);
		if (value === "For someone else") {
			setBookingForOther(true);
		}
		if (value === "For me") {
			setBookingForOther(false);
		}
	};

	const handleInputChangePrimaryFormData = (e) => {
		const value = e.target.value;
		setPrimaryFormData({
			...primaryFormData,
			[e.target.name]: value,
		});
	};

	// HANDLE-INPUT-CHANGE BOOKING-CONFIG
	const handleInputChangeBookingConfig = (e, id) => {
		e.preventDefault();
		const value = e.target.value;
		const name = e.target.name;
		const tableContext = roomConfig;
		const myRowIndex = tableContext.findIndex((row) => row.id === id);

		if (name === "full_name") {
			tableContext[myRowIndex].full_name = value;
		}
		if (name === "email") {
			tableContext[myRowIndex].email = value;
		}
		if (name === "phone") {
			tableContext[myRowIndex].phone = value;
		}
		if (name === "no_of_guset") {
			tableContext[myRowIndex].no_of_guset = value;
		}
		setRoomConfig(tableContext);
	};

	// REMOVE-ROOM
	const handleRemoveRoom = (id) => {
		if (bookingData.roomConfig.length > 1) {
			setIsLoading(true);

			const removeRoomItem = roomConfig.filter((room) => {
				return room.id === id;
			});
			const filteredRooms = bookingData.roomConfig.filter((room) => {
				return room.id !== id;
			});
			LOCAL_STORAGE.setItem("_b_baseInf", {
				...bookingData,
				nSleep: bookingData.nSleep - removeRoomItem[0].no_of_guset,
				nRooms: bookingData.nRooms - 1,
				totRoomPrice: bookingData.totRoomPrice - removeRoomItem[0].roomPrice,
				roomConfig: filteredRooms,
			});

			setTimeout(() => {
				getSelectedRoomDetails();
				toastNotification.success("One room has been removed!");
			}, 500);
			setRemoveRoomId(null);
			setIsLoading(false);
		} else {
			toastNotification.warn("Single Room Availabe, not allow to remove it !");
			setRemoveRoomId(null);
		}
	};

	// SUBMIT
	const handleSubmit = (e) => {
		e.preventDefault();
		//FIELD_VALIDATION.email(primaryFormData.email);

		const postValue = {
			user_id: USER_AUTH.getUserID(),
			first_name: primaryFormData.first_name,
			last_name: primaryFormData.last_name,
			phone_number: primaryFormData.phone_number,
			email: primaryFormData.email,
			business_traveller: businessTraveller ? "Yes" : "No",
			booking_for: bookingForVal,
			booking_config: roomConfig.map((data) => {
				return {
					sub_room_type: data.sub_room_type,
					no_of_guset: data.no_of_guset,
					full_name: data.full_name,
					phone: data.phone,
					email: data.email,
				};
			}),
		};

		services.POST.bookingEntryForm(postValue)
			.then((response) => {
				const data = response.data;
				if (data.status_code === 200) {
					const bookingId = data.result.booking_id;

					LOCAL_STORAGE.setItem("_b_savedInf", {
						userId: postValue.user_id,
						bookingId: bookingId,
						email: postValue.email,
						firstName: postValue.first_name,
						lastName: postValue.last_name,
						phone: postValue.phone_number,
						bookingConfig: postValue.booking_config,
						bookingFor: postValue.booking_for,
						propId: PROPERTY_ID,
					});
					toastNotification.success("Booking information has been saved.");
					setFormSubmitted(true);
				}

				if (response.data.status_code === 400) {
					toastNotification.warn(
						`${response.data.message}, Please try again !`,
					);
				}
				setIsLoading(false);
			})
			.catch((errors) => {
				toastNotification.error(errors);
				setIsLoading(false);
			});
	};

	if (!userLoging) {
		return <Redirect to={`/propertyDetail/${PROPERTY_ID}`} />;
	}

	if (formSubmitted) {
		return <Redirect to="/bookingConfirm" />;
	}

	return (
		<>
			<CustomLoader isLoading={isLoading} />
			<PageLayout innerPage={true}>
				<div className="booking-detail-entry">
					<div className="container">
						<div className="booking-detail-entry__header">
							<h3 className="heading-tertiary">Enter Yours Details</h3>
						</div>
						<div className="booking-detail-entry__content">
							<div className="col-wrapper">
								<div className="col-item col-item--lg-8">
									{primaryFormData && (
										<form
											onSubmit={handleSubmit}
											className="utl-form form-booking-detail"
										>
											<div className="form-fields-wrapper">
												<div className="form__entry-basicinfo">
													<h4>Enter your details</h4>
													<p>
														We will use these details to share your booking
														information
													</p>
													<div className="utl-row">
														<div className="form-group-multiple">
															<div className="form-group ">
																<label htmlFor="first_name">First Name</label>
																<input
																	placeholder="First Name"
																	label="First Name"
																	id="first_name"
																	type="text"
																	name="first_name"
																	value={
																		primaryFormData &&
																		primaryFormData.first_name
																	}
																	onChange={handleInputChangePrimaryFormData}
																/>
															</div>

															<div className="form-group ">
																<label htmlFor="last_name">Last Name</label>
																<input
																	placeholder="Last Name"
																	label="Last Name"
																	id="last_name"
																	type="text"
																	name="last_name"
																	value={
																		primaryFormData && primaryFormData.last_name
																	}
																	onChange={handleInputChangePrimaryFormData}
																/>
															</div>
														</div>
														{/*End form-group-multiple*/}

														<div className="form-group-multiple">
															<div className="form-group">
																<label htmlFor="email">Email</label>
																<input
																	type="email"
																	name="email"
																	placeholder="Email "
																	label="E-mail"
																	id="email"
																	value={
																		primaryFormData && primaryFormData.email
																	}
																	onChange={handleInputChangePrimaryFormData}
																/>
															</div>
														</div>
														{/*End form-group-multiple*/}

														{/*<PhoneNumberInput
															name="phone_number"
															onChange={(e) => {
																setPrimaryFormData({
																	...primaryFormData,
																	phone_number: e,
																});
															}}
															defaultCountry="NP"
															value={
																primaryFormData &&
																primaryFormData.phone_number.toString()
															}
														/>*/}

														<div className="form-group-multiple">
															<div className="form-group ">
																<label htmlFor="phone_number">
																	Phone number
																</label>
																{/*<input
																name="phone_number"
																label="Phone Number"
																id="phone_number"
																type="text"
																value={
																	primaryFormData &&
																	primaryFormData.phone_number
																}
																onChange={handleInputChangePrimaryFormData}
															/>*/}

																<PhoneNumberInput
																	name="phone_number"
																	onChange={(e) => {
																		setPrimaryFormData({
																			...primaryFormData,
																			phone_number: e,
																		});
																	}}
																	defaultCountry="NP"
																	value={primaryFormData.phone_number.toString()}
																/>
															</div>
														</div>
													</div>

													<Fragment>
														<div className="utl-row">
															<h4>Are you travelling for work?</h4>
															<div className="form-group-multiple--radio">
																{optionBusinessTraveller.map((option, i) => {
																	return (
																		<div
																			className="form-group form-group--radio"
																			key={`travel-from-key${i}`}
																		>
																			<input
																				type="radio"
																				id={option.value}
																				checked={
																					option.key === businessTraveller
																				}
																				onClick={(e) =>
																					setBusinessTraveller(
																						!businessTraveller,
																					)
																				}
																			/>

																			<label htmlFor={option.value}>
																				{option.key === true ? "Yes" : "No"}
																			</label>
																		</div>
																	);
																})}
															</div>
														</div>
														{/*End .utl-row*/}

														<div className="utl-row">
															<h4>Who are you Booking for ?</h4>
															<div className="form-group-multiple--radio">
																{optionBookingFor.map((option, i) => {
																	return (
																		<div
																			className="form-group form-group--radio"
																			key={`key-booking-for${i}`}
																		>
																			<input
																				type="radio"
																				id={option.value}
																				checked={bookingForVal === option.value}
																				value={option.value}
																				onClick={() => {
																					handleBookingFor(option.value);
																				}}
																			/>
																			<label htmlFor={option.value}>
																				{option.key}
																			</label>
																		</div>
																	);
																})}
															</div>
														</div>
													</Fragment>
												</div>
												{/*End form__entry-basicinfo*/}

												{bookingForOther && (
													<div name="booking_config">
														<>
															{roomConfig &&
																roomConfig.map((room, i) => {
																	return (
																		<>
																			<div
																				className="form__entry-roomdetail"
																				key={`booking-config-${i}`}
																			>
																				<span className="remove-room">
																					<span
																						onClick={() =>
																							setRemoveRoomId(room.id)
																						}
																					>
																						x
																					</span>
																					{removeRoomId === room.id && (
																						<ConfirmationModal
																							className="prop-verify"
																							message="Are you sure to remove this room ?"
																							onClickYes={() =>
																								handleRemoveRoom(room.id)
																							}
																							onClickNo={() => {
																								setRemoveRoomId(null);
																							}}
																							position="bottom"
																						/>
																					)}
																				</span>
																				<h4 className="flex-aC-jSB">
																					{room.sub_room_type}{" "}
																				</h4>
																				<div className="form-group display-none ">
																					<input
																						type="text"
																						name={`bookingConfig${i}sub_room_type`}
																						value={room.sub_room_type}
																					/>
																				</div>
																				<div className="form-group ">
																					<label htmlFor="no_of_guset">
																						Guests
																					</label>
																					<select
																						id="no_of_guset"
																						name="no_of_guset"
																						onChange={(e) =>
																							handleInputChangeBookingConfig(
																								e,
																								room.id,
																							)
																						}
																					>
																						{room.arrGuestsOption &&
																							room.arrGuestsOption.map(
																								(option, i) => {
																									return (
																										<option
																											key={`n-guest-select${i}`}
																											value={option}
																										>
																											{option}
																										</option>
																									);
																								},
																							)}
																					</select>
																				</div>
																				<div className="form-group-multiple">
																					<div className="form-group ">
																						<label htmlFor="fullNameConfit">
																							Guest Full Name
																						</label>
																						<input
																							id="fullNameConfit"
																							type="text"
																							placeholder="Guest full name"
																							name="full_name"
																							//value={room.full_name}
																							onChange={(e) =>
																								handleInputChangeBookingConfig(
																									e,
																									room.id,
																								)
																							}
																							required={
																								bookingForOther ? true : false
																							}
																						/>
																					</div>

																					<div className="form-group">
																						<label htmlFor="phoneNumberConfit">
																							Phone no.
																						</label>
																						<input
																							id="phoneNumberConfit"
																							type="text"
																							placeholder="Phone no"
																							name="phone"
																							//value={room.phone}
																							required={
																								bookingForOther ? true : false
																							}
																							onChange={(e) =>
																								handleInputChangeBookingConfig(
																									e,
																									room.id,
																								)
																							}
																						/>

																						{/*<PhoneNumberInput
																							name="phone_number"
																							onChange={(e) => {
																								handleInputChangeBookingConfig(
																									e,
																									room.id,
																								);
																							}}
																							defaultCountry="NP"
																							value={primaryFormData.phone_number.toString()}
																						/>*/}
																					</div>
																				</div>
																				<div className="form-group-multiple">
																					<div className="form-group">
																						<label htmlFor="emailConfig">
																							Email
																						</label>

																						<input
																							id="emailConfig"
																							type="email"
																							placeholder="Email"
																							name="email"
																							//value={room.email}
																							required={
																								bookingForOther ? true : false
																							}
																							onChange={(e) =>
																								handleInputChangeBookingConfig(
																									e,
																									room.id,
																								)
																							}
																						/>
																					</div>
																				</div>
																			</div>
																		</>
																	);
																})}
														</>
													</div>
												)}
											</div>

											<div className="flex-aC-jFE">
												<button
													type="submit"
													className="utl-btn utl-btn-primary utl-btn-bigscreen"
													ref={submitBtnRef}
												>
													NEXT
												</button>
											</div>
										</form>
									)}
								</div>

								<div
									ref={paymentDetailCardRef}
									className={`col-item col-item--lg-4 `}
								>
									<div
										className={`${
											payDetailDivBound.y &&
											payDetailDivBound.y < 70 &&
											pageBottomDivBound &&
											pageBottomDivBound.y > 700 &&
											payDetailDivBound.x &&
											payDetailDivBound.x > 200
												? "stickay-pay-box"
												: ""
										}`}
										style={{
											width:
												payDetailDivBound.y &&
												payDetailDivBound.y < 70 &&
												pageBottomDivBound &&
												pageBottomDivBound.y > 700
													? `${
															payDetailDivBound.width &&
															payDetailDivBound.width - 30
													  }px`
													: "",
										}}
									>
										{bookingData && (
											<BookingPaymentDetail
												bookingData={bookingData}
												bookingEntryPage={true}
											/>
										)}
									</div>
								</div>
							</div>
							<dic className="submit-btn">
								<button
									className="utl-btn utl-btn-primary utl-btn-smallscreen"
									onClick={() => submitBtnRef.current.click()}
								>
									NEXT
								</button>
							</dic>
							<div className="ref" ref={pageBottomRef}>
								{/*Note: This dive use for referance*/}
							</div>
						</div>
					</div>
				</div>
			</PageLayout>
		</>
	);
};

export default BookingEntry;
