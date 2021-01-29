// Packages
import React, { useEffect, useState } from "react";
import { Link, Redirect } from "react-router-dom";
import { DateRangePicker } from "react-dates";
import moment from "moment";
import OwlCarousel from "react-owl-carousel";
import "owl.carousel/dist/assets/owl.carousel.css";
import "owl.carousel/dist/assets/owl.theme.default.css";

// Image, Icon, Logo
import logoEsewaPay from "./../assets/images/logo-esewa.png";
import logoImePay from "./../assets/images/logo-IMEpay.png";
import logoKhaltiPay from "./../assets/images/logo-khalti.png";
import logoSCTpayment from "./../assets/images/logo-sctPayment.png";

import iconPen from "./../assets/images/icon-pen.svg";
import defaultImg from "./../assets/images/image-default.png";
import iconRating from "./../assets/images/icon-rating.svg";

// Components
import PageLayout from "../HOC/PageLayout";
import FormFieldError from "../components/FormFieldError";
import ModalInputGuestsRoomsForSearch from "../components/ModalInputGuestsRoomsForSearch";
import services from "./../services";
import { PlaceholderCard } from "../components/CustomPlaceholder";
import SelectDestination from "../components/SelectDestination";
import { LOCAL_STORAGE } from "../utilities";

const LandingPage = () => {
	const [location, setLocation] = useState("");
	const [startDate, setStartDate] = useState(moment());
	const [endDate, setEndDate] = useState(moment().add(1, "days"));
	const [focusedInput, setFocusedInput] = useState(null);
	const [isLoading, setIsLoading] = useState(false);
	const [redirect, setRedirectToSearch] = useState(false);
	const [destination, setDestination] = useState(null);
	const [destinationLabel, setDestinatonLabel] = useState(null);
	const [requiredNGuests, setRequiredNGuests] = useState(false);
	const [requiredDestination, setRequiredDestination] = useState(false);
	const [requiredNRooms, setRequiredNRooms] = useState(false);
	const [nearestHotels, setNearesthotels] = useState(null);
	const [mostViewedHotels, setMostViewedHotels] = useState(null);
	const [windowWidth, setWindowWidth] = useState(window.innerWidth);
	const [moreHotels, setMoreHotels] = useState({
		status: false,
		location: "",
	});
	const [guestsAndRooms, setGuestsAndRooms] = useState([
		{
			nRooms: 1,
			nAdults: 1,
			nChilds: 0,
		},
	]);
	const [updatedGR, setUpdatedGR] = useState({
		nRooms: 1,
		nAdults: 1,
		nChilds: 0,
	});
	const [showInputRGmodal, setShowInputRGmodal] = useState(false);
	const [topDestinations, setTopDestinations] = useState(null);
	const screenWidth = window.screen.width;

	useEffect(() => {
		//REMOVE ITEMS (array of items) FROM LOCAL-STORAGE
		//(pre-booking-statu, room-config, booking-basic-info, booking-saved-info)
		LOCAL_STORAGE.removeItems([
			"_pre_b_status",
			"_room_config",
			"_pre_b_info",
			"_b_confInf",
			"_b_basicInf",
			"_b_savedInf",
			"_s_search",
		]);
	}, []);

	// WINDOW-WIDTH
	window.addEventListener("resize", (e) => {
		setWindowWidth(window.innerWidth);
	});

	// MOST-VIEW HOTELS
	const getMostViewedHotels = () => {
		setIsLoading(true);
		services.GET.mostViewedHotels()
			.then((response) => {
				const data = response.data;
				if (data.status_code === 200) {
					setMostViewedHotels(data.result);
				}
				setIsLoading(false);
			})
			.catch((errors) => {
				setIsLoading(false);
				console.error(errors);
			});
	};

	// TOP-DESTINATIONS
	const getTopDestinations = () => {
		setIsLoading(true);
		services.GET.topDestinations()
			.then((response) => {
				const data = response.data;
				if (data.status === 200) {
					setTopDestinations(data.result);
				}
				setIsLoading(false);
			})
			.catch((errors) => {
				setIsLoading(false);
			});
	};

	// NEAREST-HOTELS
	const getNearestHotels = () => {
		if (navigator.geolocation) {
			navigator.geolocation.getCurrentPosition((position) => {
				const data = position.coords;
				const lat = data.latitude;
				const long = data.longitude;
				services.GET.nearestHotels(lat, long)
					.then((response) => {
						const { data } = response;
						if (data.status_code === 200) {
							if (data.result.length > 8) {
								setMoreHotels({
									status: true,
									city: data.result[0].city,
								});
								setNearesthotels(data.result.slice(0, 8));
								setIsLoading(false);
							} else setNearesthotels(data.result);
							setIsLoading(false);
						}
					})
					.catch((errors) => {
						console.error(errors);
						setIsLoading(false);
					});
			});
		}
	};

	//const getNearestHotels = () => {
	//	setIsLoading(true);
	//	services.GET.nearestHotels()
	//		.then((response) => {
	//			const data = response.data;
	//			if (data.status_code === 200) {
	//				if (data.result.length > 8) {
	//					setMoreHotels({
	//						status: true,
	//						city: data.result[0].city,
	//					});
	//					setNearesthotels(data.result.slice(0, 8));
	//					setIsLoading(false);
	//				} else setNearesthotels(data.result);
	//				setIsLoading(false);
	//			}
	//		})
	//		.catch((errors) => {
	//			setIsLoading(false);
	//		});
	//};

	useEffect(() => {
		getTopDestinations();
		getMostViewedHotels();
		getNearestHotels();
	}, []);

	const onDateChange = (dates) => {
		setStartDate(dates.startDate);
		setEndDate(dates.endDate);
	};
	const onFocusChange = (focusedInput) => {
		setFocusedInput(focusedInput);
	};

	const handleSelectLocation = (e, { value }) => {
		setLocation(value);
		setRequiredDestination(false);
	};

	const handleUpdateGRsearchInput = () => {
		const nRooms = guestsAndRooms.length;
		let nChilds = 0;
		let nAdults = 0;
		for (let i = 0; i < guestsAndRooms.length; i++) {
			nChilds = nChilds + guestsAndRooms[i].nChilds;
			nAdults = nAdults + guestsAndRooms[i].nAdults;
		}
		setUpdatedGR({
			nChilds,
			nAdults,
			nRooms,
		});
		setShowInputRGmodal(false);
		setRequiredNGuests(false);
		setRequiredNRooms(false);
	};

	const handleSubmitSearchData = (e) => {
		e.preventDefault();
		const nGuests = guestsAndRooms.nChilds + guestsAndRooms.nAdults;

		return !destination
			? setRequiredDestination(true)
			: guestsAndRooms.nRooms === 0
			? setRequiredNRooms(true)
			: nGuests === 0
			? setRequiredNGuests(true)
			: LOCAL_STORAGE.setItem("_s_search", {
					location: destination,
					destination,
					destinationLabel,
					startDate: startDate,
					endDate: endDate,
					guestsAndRooms: guestsAndRooms,
					updatedGuestsAndRooms: updatedGR,
					roomConfig: guestsAndRooms.map((room, i) => {
						return {
							room: i + 1,
							guest: room.nAdults + room.nChilds,
						};
					}),
			  }) || setRedirectToSearch(true);
	};

	// SEARCH-BY-CITY
	const handleSearchByCity = (city) => {
		LOCAL_STORAGE.setItem("_s_search", {
			location: city,
			destination: city,
			destinationLabel: city,
			startDate: startDate,
			endDate: endDate,
			guestsAndRooms: guestsAndRooms,
			updatedGuestsAndRooms: updatedGR,
			roomConfig: [
				{
					room: 1,
					guest: 1,
				},
			],
		});
		setRedirectToSearch(true);
	};

	// CHANGE-DESTINATION
	const handleChangeDestination = ({ label, value }) => {
		setDestinatonLabel(value);
		setDestination(value);
	};

	if (redirect) {
		return <Redirect to="/search" />;
	}

	return (
		<>
			<PageLayout>
				<div className="page-section page-section--site-banner">
					<div className="container ">
						<div className="col-wrapper">
							<div className="col-item col-item--lg-6 flex-aC">
								<div className="banner-form">
									<h3>Find the right hotel at the best price</h3>

									<form className="os-form" onSubmit={handleSubmitSearchData}>
										<div className="form-group">
											<SelectDestination
												defaultInputValue={destination}
												onChange={handleChangeDestination}
												primaryLayout={true}
												value={destinationLabel}
											/>
											{requiredDestination && !destinationLabel && (
												<FormFieldError message="Please select a destination!" />
											)}
										</div>

										{/*<div className="form-group">
											<DropdownCustomSelect
												value={location}
												onChange={handleSelectLocation}
												onClick={() => {
													setRequiredDestination(false);
												}}
											/>
											{requiredDestination && (
												<FormFieldError message="Please select a destination!" />
											)}
										</div>*/}
										<div className="form-group">
											<DateRangePicker
												startDate={startDate}
												startDateId="your_unique_start_date_id-1"
												endDate={endDate}
												endDateId="your_unique_end_date_id-1"
												onDatesChange={onDateChange}
												focusedInput={focusedInput}
												onFocusChange={onFocusChange}
												displayFormat="dd, DD MMM"
												firstDayOfWeek={1}
												small={false}
												hideKeyboardShortcutsPanel={true}
												noBorder={true}
												keepOpenOnDateSelect={false}
												reopenPickerOnClearDates={true}
												numberOfMonths={windowWidth < 770 ? 1 : 2}
											/>
										</div>
										<div className="form-group">
											<label htmlFor="input_destination_1">
												Guests & Rooms
											</label>
											<input
												type="text"
												id="input_destination_1"
												value={
													updatedGR
														? `${updatedGR.nAdults} Adult , ${updatedGR.nChilds} Child, ${updatedGR.nRooms} Room `
														: " Number of Guests and Rooms "
												}
												onClick={() => setShowInputRGmodal(true)}
											/>
											<span
												onClick={() => setShowInputRGmodal(true)}
												className=" utl-btn utl-btn-tertiary utl-btn-tertiary--sm"
											>
												<img src={iconPen} alt="guests and rooms" />
											</span>

											{requiredNGuests || requiredNRooms ? (
												<FormFieldError message="Please enter number of guests and room." />
											) : (
												""
											)}
										</div>

										<div className="form-group btn-wrapper">
											<button className="utl-btn utl-btn-primary" type="submit">
												Search
											</button>
										</div>
									</form>
								</div>
							</div>

							<div className="col-item col-item--lg-6">
								<div className="home-banner-img">
									<img
										src={require("./../assets/images/img-banner1.png")}
										alt="Banner"
									/>
								</div>
							</div>
						</div>
					</div>
				</div>

				<div className="page-section page-section--discover-today">
					<div className="container">
						<div className="col-wrapper flex-aC">
							<div className="col-item col-item--lg-4 discover-today__col-1">
								<h2 className="heading-secondary">Discover Today</h2>
								<p>
									Come and explore the best of the world, from modern cities to
									natural landscapes.
								</p>
							</div>

							<div className="col-item col-item--lg-8 discover-today__col-2">
								<div className="discover-today-slider">
									{isLoading && <PlaceholderCard count={5} />}
									{topDestinations && (
										<OwlCarousel
											className="owl-theme"
											loop
											margin={15}
											nav
											items={screenWidth < 700 ? 3 : 5}
											center={false}
											freeDrag={true}
											dots={false}
											disabled={false}
										>
											{topDestinations &&
												topDestinations.map((dest, i) => {
													return (
														<div
															className="today-prop-item anchor"
															onClick={() => handleSearchByCity(dest.city)}
														>
															<div
																className="prop-item__img col-inline-bg"
																style={{
																	backgroundImage: dest.image
																		? `url(${process.env.REACT_APP_API_BASE_URL}${dest.image})`
																		: `url(${defaultImg})`,
																}}
															></div>
															<div className="prop-item__overlay">
																<span className="prop-count">
																	{dest.count < 100
																		? `${dest.count} hotels`
																		: `100 + hotels`}
																</span>
																<span className="prop-location">
																	{dest.city}
																</span>
															</div>
														</div>
													);
												})}
										</OwlCarousel>
									)}
								</div>
							</div>
						</div>
					</div>
				</div>

				<div className="page-section page-section--near-you">
					<div className="container">
						<div className="section-header flex-aC-jSB">
							<h2 className="heading-secondary">Near You</h2>
							{/*<span href="#" className="anchor-tag disable">
								View all
							</span>*/}
						</div>
						{isLoading && <PlaceholderCard count={4} />}
						<div className="section-body col-wrapper">
							{/*Render data*/}

							{nearestHotels &&
								nearestHotels.map((hotel, i) => {
									return (
										<div
											className="col-item col-item--lg-3"
											key={`nearest-hotel-${i}`}
										>
											<div className="prop-item">
												<div
													className="prop-item__top col-inline-bg"
													style={{
														backgroundImage: hotel.image
															? `url(${process.env.REACT_APP_API_BASE_URL}${hotel.image})`
															: `url(${defaultImg})`,
													}}
												>
													<Link
														className="anchor-tag-overlay"
														to={`/propertyDetail/${hotel.property_id}`}
														target="_blank"
														onClick={() =>
															localStorage.removeItem("_s_valToViewDetail")
														}
													></Link>
												</div>
												<div className="prop-item__bottom ">
													<div className="row-1 flex-aFS-jSB">
														<div className="col-item-1">
															<p>{hotel.city}</p>
															<Link
																className="prop-item__name link"
																to={`/propertyDetail/${hotel.property_id}`}
																target="_blank"
																onClick={() =>
																	localStorage.removeItem("_s_valToViewDetail")
																}
															>
																{hotel.property_name}
															</Link>
														</div>
														<div className="col-item-2 rating flex-aFS-jFE">
															<span>{hotel.reviews}</span>

															{/*Rating-Icon*/}
															<img src={iconRating} alt="Rating" />
														</div>
													</div>
													<div className="row-2 flex-aC-jSB">
														<div className="flex-aC">
															{hotel.discount > hotel.price && (
																<span className="line-throw">
																	NPR {hotel.discount}
																</span>
															)}
															<strong>NPR {hotel.price}</strong>
															<span>per night</span>
														</div>
														<span className="offer">0 OFF</span>
													</div>
												</div>
											</div>
										</div>
									);
								})}

							{/*End-Item*/}
						</div>
						{moreHotels.status && moreHotels.city !== "" && (
							<div className="flex-aC-jFE">
								<span className="anchor-tag disable">
									{/*<Link
										to={`/search/${moreHotels.city},${startDate},${endDate},1,1,0`}
									>
										View all
									</Link>*/}
									<a onClick={() => handleSearchByCity(moreHotels.city)}>
										View all
									</a>
								</span>
							</div>
						)}
					</div>
				</div>
				<div className="page-section page-section--most-view-property">
					<div className="container">
						<div className="section-header flex-aC-jSB">
							<h2 className="heading-secondary">Most Popular Hotels</h2>
						</div>

						{isLoading && <PlaceholderCard count={4} />}
						<div className="section-body ">
							{mostViewedHotels && (
								<OwlCarousel
									className="owl-theme"
									loop
									margin={30}
									nav
									items={screenWidth < 700 ? 1 : 3}
									center={true}
									freeDrag={true}
									dots={false}
									disabled={false}
								>
									{mostViewedHotels &&
										mostViewedHotels.map((hotel, i) => {
											return (
												<div className="prop-item">
													<div
														className="prop-item__top col-inline-bg"
														style={{
															backgroundImage: hotel.image
																? `url(${process.env.REACT_APP_API_BASE_URL}${hotel.image})`
																: `url(${defaultImg})`,
														}}
													>
														<Link
															className="anchor-tag-overlay"
															to={`/propertyDetail/${hotel.hotel_id}`}
															target="_blank"
															onClick={() =>
																localStorage.removeItem("_s_valToViewDetail")
															}
														></Link>
													</div>
													<div className="prop-item__bottom ">
														<div className="row-1 flex-aFS-jSB">
															<div className="col-item-1">
																<p>{hotel.city}</p>
																<Link
																	className="prop-item__name link"
																	to={`/propertyDetail/${hotel.hotel_id}`}
																	target="_blank"
																	onClick={() =>
																		localStorage.removeItem(
																			"_s_valToViewDetail",
																		)
																	}
																>
																	{hotel.hotel_name}
																</Link>
															</div>
															<div className="col-item-2 rating flex-aFS-jFE">
																<span>{hotel.rating}</span>

																{/*Rating-Icon*/}
																<img src={iconRating} alt="Rating" />
															</div>
														</div>
														<div className="row-2 flex-aC-jSB">
															<div className="flex-aC">
																<span>Booked {hotel.booking_count}</span>
															</div>
														</div>
													</div>
												</div>
											);
										})}
								</OwlCarousel>
							)}

							{/*End-Item*/}
						</div>
					</div>
				</div>

				<div className="page-section page-section--payment-partner">
					<div className="container">
						<div className="payment-partner__header">
							<h2 className="heading-secondary title-paymentwith">Pay With</h2>
						</div>
						<ul className="payment-partner__lists flex-aC-jC flex-ffRW">
							<li className="pay-item">
								<img src={logoKhaltiPay} alt="khalti" />
							</li>
							<li className="pay-item">
								<img src={logoEsewaPay} alt="e-sewa" />
							</li>
							<li className="pay-item">
								<img src={logoImePay} alt="Ime pay" />
							</li>
							<li className="pay-item">
								<img src={logoSCTpayment} alt="SCT payment" />
							</li>
							{/*<li className="pay-item">
								<img src={logoVisaPay} alt="visa pay" />
							</li>*/}
							{/*<li className="pay-item">
								<img src={logoFonPay} alt="fon pay" />
							</li>*/}
							{/*<li className="pay-item">
								<img src={logoConnectIps} alt="Connect ips" />
							</li>*/}
						</ul>
					</div>
				</div>
			</PageLayout>
			<ModalInputGuestsRoomsForSearch
				showModal={showInputRGmodal}
				closeModal={() => setShowInputRGmodal(false)}
				guestsAndRooms={guestsAndRooms}
				setGuestsAndRooms={setGuestsAndRooms}
				updateSearchGRinputField={handleUpdateGRsearchInput}
			/>
		</>
	);
};

export default React.memo(LandingPage);
