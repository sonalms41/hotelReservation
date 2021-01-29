// Packages
import React, { useState, useEffect, useRef, useContext } from "react";
import ProfileLayout from "./ProfileLayout";
import { Link } from "react-router-dom";
import { Tab, Tabs, TabList, TabPanel } from "react-tabs";

// Components
import BookingCancelReason from "../../components/BookingCancelReason";
import services from "../../services";
import CustomLoader from "./../../components/CustomLoader";
import moment from "moment";
import ConfirmationLandingPage from "./../../components/ConfirmationLandingPage";
import ReactToPrint from "react-to-print";

// Utilities
import { toastNotification, USER_AUTH } from "../../utilities";

// HOC
import { CancelReasonContext } from "../../HOC/Context";
// Images and icons
import defaultImg from "./../../assets/images/image-default.png";
import ModalPopUp from "../../components/ModalPopUp";
import ReviewForm from "../../components/ReviewForm";

const MyBooking = () => {
	const { cancelReason } = useContext(CancelReasonContext);

	const componentRef = useRef();
	const userId = USER_AUTH.getUserID();
	const [propertyId, setPropertyId] = useState();
	const [guestId, setGuestId] = useState();
	const startDate = moment().format("YYYY-MM-DD");
	const endDate = moment().add(1, "days").format("YYYY-MM-DD");

	const [showModal, setShowModal] = useState(false);
	const [visibleReviewModal, setVisibleReviewModal] = useState(false);
	const [isLoading, setIsLoading] = useState(true);
	const [upcommingProperty, setUpcommingProperty] = useState([]);
	const [completedProperty, setCompletedProperty] = useState([]);
	const [cancelledProperty, setCancelledProperty] = useState([]);
	const [pendingProperty, setPendingProperty] = useState([]);

	const [bookedDetail, setBookedDetail] = useState([]);
	const [visibleBookedDetailModal, setVisibleBookedDetailModal] = useState(
		false,
	);

	const [cancelPending, setCancelPending] = useState({
		showModal: false,
		instanceId: null,
	});
	const [cancelUpcoming, setCancelUpcoming] = useState({
		showModal: false,
		instanceId: null,
	});

	// Get pending-booking
	const getPendingToApprove = () => {
		setIsLoading(true);
		userId &&
			services.GET.bookingPending(userId)
				.then((response) => {
					const data = response.data;
					if (data.status_code === 200) {
						setPendingProperty(data.result);
					}
					setIsLoading(false);
				})
				.catch((errors) => {
					setIsLoading(false);
				});
		setIsLoading(false);
	};
	// Get cancelled-booking
	const getCancelledBooking = () => {
		setIsLoading(true);
		userId &&
			services.GET.cancelledProperty(userId)
				.then((response) => {
					if (response.data.status_code === 200) {
						const data = response.data.result;
						setCancelledProperty(data);
					}
					setIsLoading(false);
				})
				.catch((errors) => {
					toastNotification.error(`${errors}`);
					setIsLoading(false);
				});
		setIsLoading(false);
	};

	// Get upcomming-booking
	const getUpCommingBooking = () => {
		setIsLoading(true);
		userId &&
			services.GET.upcommingProperty(userId)
				.then((response) => {
					if (response.data.status_code === 200) {
						const bookedData = response.data.result;
						setUpcommingProperty(bookedData);
					}
					setIsLoading(false);
				})
				.catch((errors) => {
					toastNotification.error(`${errors}`);
					setIsLoading(false);
				});
		setIsLoading(false);
	};

	// Get completed-booking
	const getCompletedBooking = () => {
		setIsLoading(true);
		userId &&
			services.GET.completedProperty(userId)
				.then((response) => {
					const data = response.data;
					if (data.status_code === 200) {
						const bookedData = data.result;
						setCompletedProperty(bookedData);
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
		setIsLoading(false);
	};
	useEffect(() => {
		getPendingToApprove();
		getUpCommingBooking();
		getCancelledBooking();
		getCompletedBooking();
	}, []);

	// CANCEL-BOOKING
	const handleCancelBooking = (instantId, bookingStatus) => {
		const postValues = {
			instance_id: instantId,
			user_id: userId,
			message: cancelReason,
		};
		if (cancelReason === "") {
			toastNotification.warn("Cancel Reason is required!");
		} else
			services.POST.cancelBooking(postValues)
				.then((response) => {
					const data = response.data;
					if (data.status_code === 200) {
						toastNotification.success(data.message);
						if (bookingStatus === "pending") {
							getPendingToApprove();
						}
						if (bookingStatus === "upcomming") {
							getUpCommingBooking();
						}
					}
					if (data.status_code === 400) {
						toastNotification.warn(data.message);
					}
					setCancelPending({ showModal: false, instanceId: null });
					setCancelUpcoming({ showModal: false, instanceId: null });
				})
				.catch((errors) => {
					toastNotification.error(`${errors}`);
				});
	};

	const handleViewBookingDetail = (id) => {
		const postVal = {
			instance_id: id,
		};
		services.POST.bookingDetail(postVal).then((response) => {
			const data = response.data;
			if (data.status_code === 200) {
				setBookedDetail(data.result);
				setVisibleBookedDetailModal(true);
			}
		});
	};

	// WRITE-REVIEW
	const handleWriteReview = (propertyId, guestId) => {
		setPropertyId(propertyId);
		setGuestId(guestId);
		setVisibleReviewModal(true);
	};

	return (
		<>
			<CustomLoader isLoading={isLoading} />
			<ProfileLayout>
				<div className="section-mybooking">
					<Tabs>
						<TabList>
							<Tab>Pending to Approve</Tab>
							<Tab>Upcoming</Tab>
							<Tab>Completed</Tab>
							<Tab>Cancel</Tab>
						</TabList>

						{/*PENDING*/}
						<TabPanel>
							{pendingProperty.length !== 0 ? (
								pendingProperty.map((property, i) => {
									return (
										<div
											className="prop-box flex-jFS"
											key={`pending_booking_${i}`}
										>
											<div className="pop-box__col-1">
												<div
													className="col-inline-bg"
													style={{
														backgroundImage: `${
															property.prop_image
																? `url(${process.env.REACT_APP_API_BASE_URL}${property.prop_image})`
																: `url(${defaultImg})`
														}`,
													}}
												></div>
											</div>
											<div className="pop-box__col-2">
												<div className="pop-box__row-1 flex-aC-jSB">
													<div className="utl-col-1">
														<h3>{property.property_name}</h3>

														<div className="flex-aC-jFS">
															<span className="utl-star utl-star-y">
																{property.star} Star Hotel
															</span>
															<span className="utl-location">
																{property.street_address !== " " &&
																	`${property.street_address}, `}
																{property.city !== " " && `${property.city}, `}
																{property.country !== " " &&
																	`${property.country}`}
															</span>
														</div>
													</div>

													<div className="utl-col-2">
														<div className="review flex-aC-jFE">
															<span className="review__total-review">
																<Link
																	to={`/propertyDetail/${property.property_id}`}
																	target="_blank"
																>
																	{property.total_rating} Reviews
																</Link>
															</span>
															<span className="review__total-rating url-brn-rating-no">
																{`${property.review} / 5`}
															</span>
														</div>
													</div>
												</div>
												{/*End pop-box__row-1*/}

												<div className="pop-box__row-2 flex-aFS-jSB">
													<div className="utl-col-1">
														<div className="b-date flex-aC-jFS">
															{property.checkin}
															<span className="in">
																{property.nights}N
															</span>{" "}
															{property.checkout},{" "}
															<span className="no-guest">
																{property.no_of_adult}{" "}
																{`Adult${property.no_of_adult > 1 ? "s" : ""}`}
																{property.no_of_child !== 0 &&
																	"," + property.no_of_child + "Child"}
															</span>
														</div>
														<ul className="amenities-ul flex-aFS-jFS">
															{property.meals &&
																property.meals.map((meal, i) => {
																	return (
																		<li
																			key={`propmealke-${i}`}
																			className={`${
																				Object.values(meal)[0] !== "No"
																					? "exist"
																					: "not-exist"
																			}`}
																		>
																			{Object.values(meal)[0] !== "No"
																				? Object.keys(meal)
																				: ""}
																		</li>
																	);
																})}
														</ul>
														<div className="room-type flex-aC-jFS">
															<span className="utl-proptype utl-proptype-deluxe">
																{property.room_type}
															</span>
														</div>
													</div>
													<div className="utl-col-2 text-right flex-ffC ">
														<p className="guest">
															{property.nights} Nights{" "}
															{property.no_of_adult + property.no_of_child}{" "}
															Guests
														</p>
														<div className="flex-aC-jFE amount">
															{/*<span className="price-off">NPR 00 #static</span>*/}
															<strong>NPR {property.price}</strong>
														</div>
														<p className="txt-sm">Includes taxes and charge</p>
														<div className="btn-wrapper flex-aC-jFE">
															<button
																className="utl-btn utl-btn-cancel"
																onClick={() =>
																	setCancelPending({
																		showModal: true,
																		instanceId: property.instance_id,
																	})
																}
															>
																Cancel
															</button>
															<button
																className="utl-btn utl-btn-fifth"
																onClick={() =>
																	handleViewBookingDetail(property.instance_id)
																}
															>
																View Details
															</button>
														</div>
													</div>
												</div>

												{/*End pop-box__row-2*/}
											</div>
										</div>
									);
								})
							) : (
								<p className="info-notfound">Pending Booking Not Available !</p>
							)}
							{/*End prop-box*/}
						</TabPanel>

						{/*UPCOMMING */}
						<TabPanel>
							{upcommingProperty.length !== 0 ? (
								upcommingProperty.map((property, i) => {
									return (
										<div
											className="prop-box flex-jFS"
											key={`upcomming_booking_${i}`}
										>
											<div className="pop-box__col-1">
												<div
													className="col-inline-bg"
													style={{
														backgroundImage: `${
															property.prop_image
																? `url(${process.env.REACT_APP_API_BASE_URL}${property.prop_image})`
																: `url(${defaultImg})`
														}`,
													}}
												></div>
											</div>
											<div className="pop-box__col-2">
												<div className="pop-box__row-1 flex-aC-jSB">
													<div className="utl-col-1">
														<h3>{property.property_name}</h3>

														<div className="flex-aC-jFS">
															<span className="utl-star utl-star-y">
																{property.star} Star Hotel
															</span>
															<span className="utl-location">
																{property.street_address !== " " &&
																	`${property.street_address}, `}
																{property.city !== " " && `${property.city}, `}
																{property.country !== " " &&
																	`${property.country}`}
															</span>
														</div>
													</div>

													<div className="utl-col-2">
														<div className="review flex-aC-jFE">
															<span className="review__total-review">
																<Link
																	to={`/propertyDetail/${property.property_id}`}
																	target="_blank"
																>
																	{property.total_rating} Reviews
																</Link>
															</span>
															<span className="review__total-rating url-brn-rating-no">
																{`${property.review} / 5`}
															</span>
														</div>
													</div>
												</div>
												{/*End pop-box__row-1*/}

												<div className="pop-box__row-2 flex-aFS-jSB">
													<div className="utl-col-1">
														<div className="b-date flex-aC-jFS">
															{property.checkin}
															<span className="in">
																{property.nights}N
															</span>{" "}
															{property.checkout},{" "}
															<span className="no-guest">
																{property.no_of_adult}Audult{" "}
																{property.no_of_child !== 0 &&
																	"," + property.no_of_child + "Child"}
															</span>
														</div>

														<ul className="amenities-ul flex-aFS-jFS">
															{property.meals &&
																property.meals.map((meal, i) => {
																	return (
																		<li
																			key={`propmealke-${i}`}
																			className={`${
																				Object.values(meal)[0] !== "No"
																					? "exist"
																					: "not-exist"
																			}`}
																		>
																			{Object.values(meal)[0] !== "No"
																				? Object.keys(meal)
																				: ""}
																		</li>
																	);
																})}
														</ul>
														<div className="room-type flex-aC-jFS">
															<span className="utl-proptype utl-proptype-deluxe">
																{property.room_type}
															</span>
														</div>
													</div>
													<div className="utl-col-2 text-right flex-ffC ">
														<p className="guest">
															{property.nights} Nights{" "}
															{property.no_of_adult + property.no_of_child}{" "}
															Guests
														</p>
														<div className="flex-aC-jFE amount">
															{/*<span className="price-off">
																NPR 3600 #static
															</span>*/}
															<strong>NPR {property.price}</strong>
														</div>
														<p className="txt-sm">Includes taxes and charge</p>
														<div className="btn-wrapper flex-aC-jFE">
															<button
																className="utl-btn utl-btn-cancel"
																onClick={() =>
																	setCancelUpcoming({
																		showModal: true,
																		instanceId: property.instances,
																	})
																}
															>
																Cancel
															</button>
															<button
																className="utl-btn utl-btn-fifth"
																onClick={() =>
																	handleViewBookingDetail(property.instances)
																}
															>
																View Details
															</button>
														</div>
													</div>
												</div>

												{/*End pop-box__row-2*/}
											</div>
										</div>
									);
								})
							) : (
								<p className="info-notfound">
									Upcoming Booking Not Available !
								</p>
							)}
							{/*End prop-box*/}
						</TabPanel>

						{/*COMPLETED */}
						<TabPanel>
							{completedProperty.length !== 0 ? (
								completedProperty.map((property, i) => {
									return (
										<div
											className="prop-box flex-jFS"
											key={`upcomming_booking_${i}`}
										>
											<div className="pop-box__col-1">
												<div
													className="col-inline-bg"
													style={{
														backgroundImage: `${
															property.prop_image
																? `url(${process.env.REACT_APP_API_BASE_URL}${property.prop_image})`
																: `url(${defaultImg})`
														}`,
													}}
												></div>
											</div>
											<div className="pop-box__col-2">
												<div className="pop-box__row-1 flex-aC-jSB">
													<div className="utl-col-1">
														<h3>{property.property_name}</h3>

														<div className="flex-aC-jFS">
															<span className="utl-star utl-star-y">
																{property.star} Star Hotel
															</span>
															<span className="utl-location">
																{property.street_address !== " " &&
																	`${property.street_address}, `}
																{property.city !== " " && `${property.city}, `}
																{property.country !== " " &&
																	`${property.country}`}
															</span>
														</div>
													</div>

													<div className="utl-col-2">
														<div className="review flex-aC-jFE">
															<span className="review__total-review">
																<Link
																	to={`/propertyDetail/${property.property_id}`}
																	target="_blank"
																>
																	{property.total_rating} Reviews
																</Link>
															</span>
															<span className="review__total-rating url-brn-rating-no">
																{`${property.review} / 5`}
															</span>
														</div>
													</div>
												</div>
												{/*End pop-box__row-1*/}

												<div className="pop-box__row-2 flex-aFS-jSB">
													<div className="utl-col-1">
														<div className="b-date flex-aC-jFS">
															{property.checkin}
															<span className="in">
																{property.nights}N
															</span>{" "}
															{property.checkout},{" "}
															<span className="no-guest">
																{property.no_of_adult}Audult{" "}
																{property.no_of_child !== 0 &&
																	"," + property.no_of_child + "Child"}
															</span>
														</div>
														<ul className="amenities-ul flex-aFS-jFS">
															{property.meals &&
																property.meals.map((meal, i) => {
																	return (
																		<li
																			key={`propmealke-${i}`}
																			className={`${
																				Object.values(meal)[0] !== "No"
																					? "exist"
																					: "not-exist"
																			}`}
																		>
																			{Object.values(meal)[0] !== "No"
																				? Object.keys(meal)
																				: ""}
																		</li>
																	);
																})}
														</ul>
														<div className="room-type flex-aC-jFS">
															<span className="utl-proptype utl-proptype-deluxe">
																{property.room_type}
															</span>
														</div>
													</div>
													<div className="utl-col-2 text-right flex-ffC ">
														<p className="guest">
															{property.nights} Nights{" "}
															{property.no_of_adult + property.no_of_child}{" "}
															Guests
														</p>
														<div className="flex-aC-jFE amount">
															{/*<span className="price-off">
																NPR 3600 #static
															</span>*/}
															<strong>NPR {property.price}</strong>
														</div>
														<p className="txt-sm">Includes taxes and charge</p>
														<div className="btn-wrapper flex-aC-jFE">
															<button
																className="utl-btn utl-btn-sixth margin-r-15"
																onClick={() =>
																	handleWriteReview(
																		property.property_id,
																		property.guest_id,
																	)
																}
															>
																Write A Review
															</button>
															<button className="utl-btn utl-btn-fifth">
																<Link
																	to={`/propertyDetail/${property.property_id}`}
																	target="_blank"
																>
																	Book Again
																</Link>
															</button>
															{/*<button className="utl-btn utl-btn-fifth">
																<Link
																	to={`/roomDetails/${property.city?property.city:'City'}, ${startDate}, ${endDate}, 1,1,0,${property.property_id}`}
																	target="_blank"
																>
																	View Details
																</Link>
															</button>*/}
														</div>
													</div>
												</div>

												{/*End pop-box__row-2*/}
											</div>
										</div>
									);
								})
							) : (
								<p className="info-notfound">
									Completed Booking Not Available !
								</p>
							)}
							{/*End prop-box*/}
						</TabPanel>

						{/*CANCEL*/}
						<TabPanel>
							{cancelledProperty.length !== 0 ? (
								cancelledProperty.map((property, i) => {
									return (
										<div
											className="prop-box flex-jFS"
											key={`upcomming_booking_${i}`}
										>
											<div className="pop-box__col-1">
												<div
													className="col-inline-bg"
													style={{
														backgroundImage: `${
															property.prop_image
																? `url(${process.env.REACT_APP_API_BASE_URL}${property.prop_image})`
																: `url(${defaultImg})`
														}`,
													}}
												></div>
											</div>
											<div className="pop-box__col-2">
												<div className="pop-box__row-1 flex-aC-jSB">
													<div className="utl-col-1">
														<h3>{property.property_name}</h3>

														<div className="flex-aC-jFS">
															<span className="utl-star utl-star-y">
																{property.star} Star Hotel
															</span>
															<span className="utl-location">
																{property.street_address !== " " &&
																	`${property.street_address}, `}
																{property.city !== " " && `${property.city}, `}
																{property.country !== " " &&
																	`${property.country}`}
															</span>
														</div>
													</div>

													<div className="utl-col-2">
														<div className="review flex-aC-jFE">
															<span className="review__total-review">
																<Link
																	to={`/propertyDetail/${property.property_id}`}
																	target="_blank"
																>
																	{property.total_rating} Reviews
																</Link>
															</span>
															<span className="review__total-rating url-brn-rating-no">
																{`${property.review} / 5`}
															</span>
														</div>
													</div>
												</div>
												{/*End pop-box__row-1*/}

												<div className="pop-box__row-2 flex-aFS-jSB">
													<div className="utl-col-1">
														<div className="b-date flex-aC-jFS">
															{property.checkin}
															<span className="in">
																{property.nights}N
															</span>{" "}
															{property.checkout},{" "}
															<span className="no-guest">
																{property.no_of_adult}Audult{" "}
																{property.no_of_child !== 0 &&
																	"," + property.no_of_child + "Child"}
															</span>
														</div>
														<ul className="amenities-ul flex-aFS-jFS">
															{property.meals &&
																property.meals.map((meal, i) => {
																	return (
																		<li
																			key={`propmealke-${i}`}
																			className={`${
																				Object.values(meal)[0] !== "No"
																					? "exist"
																					: "not-exist"
																			}`}
																		>
																			{Object.values(meal)[0] !== "No"
																				? Object.keys(meal)
																				: ""}
																		</li>
																	);
																})}
														</ul>
														{property.room_type !== "" && (
															<div className="room-type flex-aC-jFS">
																<span className="utl-proptype utl-proptype-deluxe">
																	{property.room_type}
																</span>
															</div>
														)}
													</div>
													<div className="utl-col-2 text-right flex-ffC ">
														<div className="btn-wrapper flex-aC-jFE">
															<button className="utl-btn utl-btn-fifth">
																<Link
																	to={`/propertyDetail/${property.property_id}`}
																	target="_blank"
																>
																	View Details
																</Link>
															</button>
														</div>
													</div>
												</div>

												{/*End pop-box__row-2*/}
											</div>
										</div>
									);
								})
							) : (
								<p className="info-notfound">
									Cancelled Booking Not available !
								</p>
							)}
							{/*End prop-box*/}
						</TabPanel>
					</Tabs>
				</div>
			</ProfileLayout>
			<ReviewForm
				visibleModal={visibleReviewModal}
				closeModal={() => setVisibleReviewModal(false)}
				propertyId={propertyId}
				userId={userId}
				guestId={guestId}
			/>
			<ModalPopUp
				visibleModal={visibleBookedDetailModal}
				closeModal={() => setVisibleBookedDetailModal(false)}
			>
				<div className="padding-20">
					<div className="flex-aC-jFS margin-b-10">
						<button className="utl-btn utl-btn-fifth width-auto">
							<ReactToPrint
								trigger={() => <button>Print</button>}
								content={() => componentRef.current}
							/>
						</button>
					</div>
					<ConfirmationLandingPage
						bookedDetail={bookedDetail}
						ref={componentRef}
					/>
				</div>
			</ModalPopUp>

			<BookingCancelReason
				closeModal={() =>
					setCancelPending({ showModal: false, instanceId: null })
				}
				showModal={cancelPending.showModal}
				cancelBooking={() =>
					handleCancelBooking(cancelPending.instanceId, "pending")
				}
			/>

			<BookingCancelReason
				closeModal={() =>
					setCancelUpcoming({ showModal: false, instanceId: null })
				}
				showModal={cancelUpcoming.showModal}
				cancelBooking={() =>
					handleCancelBooking(cancelUpcoming.instanceId, "upcomming")
				}
			/>
		</>
	);
};

export default MyBooking;
