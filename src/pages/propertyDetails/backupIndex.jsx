// Packages
import React, {
	useEffect,
	useState,
	Fragment,
	useContext,
	useRef,
	useLayoutEffect,
} from "react";
import { useParams, Redirect } from "react-router-dom";
import moment from "moment";
import { Link as LinkReactScroll } from "react-scroll";
import { DateRangePicker } from "react-dates";
import { v4 as uuidv4 } from "uuid";

// Components
import PageLayout from "./../../hoc/PageLayout";
import { Select } from "semantic-ui-react";
import services from "../../services";
import DropdownCustomSelect from "../../components/DropdownCustomSelect";
import FormFieldError from "../../components/FormFieldError";
import MapBox from "../../components/MapBox";
import ModalInputGuestsRoomsForSearch from "../../components/ModalInputGuestsRoomsForSearch";
import { PlaceholderPluid } from "../../components/CustomPlaceholder";
import Login from "./../Login";
import ModalPopUp from "../../components/ModalPopUp";

import Review from "./Review";
import Policies from "./Policies";
import Amenities from "./Amenities";
import Overview from "./Overview";

// Utilities
import {
	toastNotification,
	calDayDifference,
	getFromLocal,
} from "../../utilities";

// Icons and Images
import iconPen from "./../../assets/images/icon-pen.svg";
import iconStarYellow from "./../../assets/images/icon-starYellow.svg";
import iconLocation from "./../../assets/images/icon-location.svg";
import defaultImg from "./../../assets/images/image-default.png";
import iconResize from "./../../assets/images/icon-resize.svg";
import iconUserFriends from "./../../assets/images/icon-userFriends.svg";
import iconBed from "./../../assets/images/icon-bed.svg";
import { BookingContext, UserContext } from "../../hoc/Context";

const RoomDetail = () => {
	const routeData = useParams();

	const roomDetailTableRef = useRef();
	const roomDetailTableHeadRef = useRef();
	const roomDetailTableBottomRef = useRef();
	const roomDetailTableLastThRef = useRef();
	const [detailLastThBound, setDetailLastThBound] = useState();

	const { dispatchBookingBascInfo } = useContext(BookingContext);
	const { userIdFromContext } = useContext(UserContext);
	const [propertyId, setPropertyId] = useState();
	const [pageYOffset, setPageYOffset] = useState(null);
	const [stickyDetailTable, setStickyDetailTable] = useState(false);
	const [requiredUserLogin, setRequiredUserLogin] = useState(false);
	const [viewMap, setViewMap] = useState(false);

	const [startDateSearch, setStartDateSearch] = useState(moment());
	const [endDateSearch, setEndDateSearch] = useState(moment().add(1, "days"));
	const [startDateRoomDetail, setStartDateRoomDetail] = useState(moment());
	const [endDateRoomDetail, setEndDateRoomDetail] = useState(
		moment().add(1, "days"),
	);
	const [proceedBookingEntry, setProceedBookingEntry] = useState(false);

	const [requiredNRooms, setRequiredNRooms] = useState(false);
	const [requiredNGuests, setRequiredNGuests] = useState(false);
	const [requiredLocation, setRequiredLocation] = useState(false);

	const [focusedInputSearch, setFocusedInputSearch] = useState(null);
	const [focusedInputRoomDetail, setFocusedInputRoomDetail] = useState(null);

	const [nStayDays, setNStayDays] = useState(null);

	const [redirectToSearch, setRedirectToSearch] = useState(false);
	const [redirectForBookingEntry, setRedirectForBookingEntry] = useState(false);

	const [isLoading, setIsLoading] = useState(true);
	const [fixedNav, setFixedNav] = useState(false);
	const [showMapBox, setShowMapBox] = useState(false);

	const [propertyDetail, setPropertyDetail] = useState(null);
	const [roomDetail, setRoomDetail] = useState(null);

	const [location, setLocation] = useState("");

	const [selectedRooms, setSelectedRooms] = useState([]);

	const [propertyToBookingEntry, setPropertyToBookingEntry] = useState([]);

	const [roomConfig, setRoomConfig] = useState([
		{
			room: 1,
			guest: 1,
		},
	]);
	const [indexesOfSelectedRooms, setIndexesOfSelectedRooms] = useState([]);
	const [windowWidth, setWindowWidth] = useState(window.innerWidth);

	const [total, setTotal] = useState({
		nRooms: 0,
		nRoomsPrice: 0,
		vat: 0,
		vatAmount: 0,
	});
	const [savedHotel, setSavedHotel] = useState(false);
	const [
		showInputRGmodalSearchHotels,
		setShowInputRGmodalSearchHotels,
	] = useState(false);

	const [guestsAndRoomsForSearc, setGuestsAndRoomsForSearc] = useState([
		{
			nRooms: 1,
			nAdults: 1,
			nChilds: 0,
		},
	]);
	const [updatedGRSearch, setUpdatedGRSearch] = useState({
		nAdults: 1,
		nChilds: 0,
		nRooms: 1,
	});

	const [showInputRGmodalCheckRates, setShowInputRGmodalCheckRates] = useState(
		false,
	);
	const [grRoomDetails, setGrRoomDetails] = useState([
		// gr: Guests and Rooms
		{
			nRooms: 1,
			nAdults: 1,
			nChilds: 0,
		},
	]);
	const [updatedGRroomDetail, setUpdatedGRroomDetail] = useState({
		nAdults: 1,
		nChilds: 0,
		nRooms: 1,
	});

	// Get Bounding of particualr ref (div)
	useLayoutEffect(() => {
		if (roomDetailTableRef.current) {
			const table = roomDetailTableRef.current.getBoundingClientRect();
			const tableBottom = roomDetailTableBottomRef.current.getBoundingClientRect()
				.y;
			const tableLastTh = roomDetailTableLastThRef.current.getBoundingClientRect();
			setDetailLastThBound({
				x: tableLastTh.x,
				y: tableLastTh.y,
			});

			if (table.y <= 90 && tableBottom > 400) {
				setStickyDetailTable(true);
			}
			if (table.y > 90 || tableBottom < 400) {
				setStickyDetailTable(false);
			}
		}
	}, [pageYOffset]);

	// Get Property Details
	useEffect(() => {
		setIsLoading(true);
		const propertyId = routeData.id;
		services.GET.propertyDetail(propertyId)
			.then((response) => {
				const data = response.data;
				console.log("property-details:", data.result);
				if (data.status_code === 200) {
					setPropertyDetail(data.result);
				}
				setIsLoading(false);
			})
			.catch((errors) => {
				setIsLoading(false);
			});

		const valToViewDetail = getFromLocal("_s_valToViewDetail");
		if (valToViewDetail !== undefined) {
			let {
				guestsAndRooms,
				updatedGR,
				startDate,
				endDate,
				roomConfig,
				location,
			} = valToViewDetail;

			console.log("valToViewDetail:", guestsAndRooms);
			setGrRoomDetails(guestsAndRooms);
			setGuestsAndRoomsForSearc(guestsAndRooms);
			setUpdatedGRroomDetail(updatedGR);
			setStartDateSearch(moment(startDate));
			setEndDateSearch(moment(endDate));
			setRoomConfig(roomConfig);
			setUpdatedGRroomDetail(updatedGR);
			setStartDateRoomDetail(moment(startDate));
			setEndDateRoomDetail(moment(endDate));
			setLocation(location);
			handleGetRoomDetails(moment(startDate), moment(endDate), roomConfig);
		} else {
			handleGetRoomDetails(startDateRoomDetail, endDateRoomDetail, roomConfig);
		}
	}, []);

	// GET ROOM DETAILS
	const handleGetRoomDetails = (startDate, endDate, roomConfig) => {
		const postValue = {
			property_id: routeData.id,
			starting_date: startDate.format("YYYY-MM-DD"),
			ending_date: endDate.format("YYYY-MM-DD"),
			room_conf: roomConfig,
		};

		console.log("postValue-room-detail", postValue);
		services.POST.propertyRoomDetail(postValue)
			.then((response) => {
				const data = response.data;
				console.log("room-details:", data.result);
				if (data.status_code === 200) {
					setRoomDetail(data.result);
				}
			})
			.catch((errors) => {});

		const getNumStayDay = calDayDifference(
			postValue.starting_date,
			postValue.ending_date,
		);
		setNStayDays(getNumStayDay);
	};

	const handleSelectRooms = (roomIndex, value, room) => {
		const roomPrice = value ? value.price : 0;
		const roomName = value ? room.sub_names : "";
		const roomSelectedNo = value ? value.room_no : 0;
		const vat = value ? value.vat : 0;
		const vatAmount = value ? value.vatAmount : 0;
		const price_without_vat = value ? value.price_without_vat : 0;
		const nSleep = value ? parseInt(room.max_guest) : 0;

		//const arrRoomConfig = [];
		//for (let i = 0; i < roomSelectedNo; i++) {
		//	arrRoomConfig.push({
		//		roomIndex,
		//		roomName,
		//		roomPrice,
		//		roomSelectedNo,
		//		vat,
		//		vatAmount,
		//		price_without_vat,
		//		nSleep,
		//	});
		//}
		//setPropertyToBookingEntry([...propertyToBookingEntry, ...arrRoomConfig]);
		setSelectedRooms([
			...selectedRooms,
			{
				roomIndex,
				roomName,
				roomPrice,
				roomSelectedNo,
				vat,
				vatAmount,
				price_without_vat,
				nSleep,
			},
		]);
		// Filter if already selected the room of the same index
		const filterRoom = selectedRooms.filter((room) => {
			return room.roomIndex !== roomIndex;
		});

		// Replace filtered value
		for (let i = 0; i < selectedRooms.length; i++) {
			if (selectedRooms[i].roomIndex === roomIndex) {
				setSelectedRooms([
					...filterRoom,
					{
						roomIndex,
						roomName,
						roomPrice,
						roomSelectedNo,
						vat,
						vatAmount,
						price_without_vat,
						nSleep,
					},
				]);
			}
		}

		// Filter removed room from selectedRoom array
		if (value === "" || value === undefined) {
			const filteredval = selectedRooms.filter((room) => {
				return room.roomIndex !== roomIndex;
			});
			setSelectedRooms([...filteredval]);
		}

		// Filter if already selected the room of the same index
		const filterRoomConfig = roomConfig.filter((room) => {
			return room.roomIndex !== roomIndex;
		});

		// Replace filtered roomConfig value
		//for (let i = 0; i < roomConfig.length; i++) {
		//	if (roomConfig[i].roomIndex === roomIndex) {
		//		setPropertyToBookingEntry([
		//			...filterRoomConfig,
		//			{
		//				roomIndex,
		//				roomName,
		//				roomPrice,
		//				roomSelectedNo,
		//				vat,
		//				vatAmount,
		//				price_without_vat,
		//				nSleep,
		//			},
		//		]);
		//	}
		//}

		// Filter removed room from roomConfig array
		//if (value === "" || value === undefined) {
		//	const filteredval = roomConfig.filter((room) => {
		//		return room.roomIndex !== roomIndex;
		//	});
		//	setPropertyToBookingEntry([...filteredval]);
		//}
	};

	// Get-all index of selected rooms
	useEffect(() => {
		const indexes = [];
		for (let i = 0; i < selectedRooms.length; i++) {
			indexes.push(selectedRooms[i].roomIndex);
		}
		setIndexesOfSelectedRooms(indexes);
	}, [selectedRooms]);

	// Calculate total selected-room and total selected-room price
	useEffect(() => {
		let nRooms = 0;
		let nRoomsPrice = 0;
		let vat = 0;
		let vatAmount = 0;
		let nSleep = 0;
		let price_without_vat = 0;
		for (let i = 0; i < selectedRooms.length; i++) {
			nRoomsPrice = nRoomsPrice + selectedRooms[i].roomPrice;
			nSleep =
				nSleep + selectedRooms[i].nSleep * selectedRooms[i].roomSelectedNo;
			nRooms = nRooms + parseInt(selectedRooms[i].roomSelectedNo);
			vat = selectedRooms[i].vat;
			vatAmount = vatAmount + selectedRooms[i].vatAmount;
			price_without_vat =
				price_without_vat + selectedRooms[i].price_without_vat;
		}
		setTotal({
			nRooms,
			nRoomsPrice,
			vat,
			vatAmount,
			price_without_vat,
			nSleep,
		});
	}, [selectedRooms]);

	// Handle-sticky-menu bar
	window.addEventListener("scroll", () => {
		if (window.pageYOffset > 100) {
			setFixedNav(true);
		}
		if (window.pageYOffset < 100) {
			setFixedNav(false);
		}
		setPageYOffset(window.pageYOffset);
	});

	window.addEventListener("resize", (e) => {
		setWindowWidth(window.innerWidth);
	});
	// Handle-modal (Search-Hotel input-guests-and-rooms)
	const handleUpdateGRSearchHotels = () => {
		const nRooms = guestsAndRoomsForSearc.length;
		let nChilds = 0;
		let nAdults = 0;
		for (let i = 0; i < guestsAndRoomsForSearc.length; i++) {
			nChilds = nChilds + guestsAndRoomsForSearc[i].nChilds;
			nAdults = nAdults + guestsAndRoomsForSearc[i].nAdults;
		}
		setUpdatedGRSearch({
			nChilds,
			nAdults,
			nRooms,
		});
		setShowInputRGmodalSearchHotels(false);
	};

	// Handle-modal (Check-rates input-guests-and-rooms)
	const handleUpdateGRCheckRates = () => {
		const nRooms = grRoomDetails.length;
		let nChilds = 0;
		let nAdults = 0;
		for (let i = 0; i < grRoomDetails.length; i++) {
			nChilds = nChilds + grRoomDetails[i].nChilds;
			nAdults = nAdults + grRoomDetails[i].nAdults;
		}
		setUpdatedGRroomDetail({
			nChilds,
			nAdults,
			nRooms,
		});
		const roomConfig = grRoomDetails.map((room, i) => {
			return {
				room: i + 1,
				guest: room.nChilds + room.nAdults,
			};
		});
		setRoomConfig(roomConfig);
		setShowInputRGmodalCheckRates(false);
	};

	const onDateChangeSearch = (dates) => {
		setStartDateSearch(dates.startDate);
		setEndDateSearch(dates.endDate);
	};
	const onFocusChangeSearch = (focusedInput) => {
		setFocusedInputSearch(focusedInput);
	};
	const onDateChangeRoomDetail = (dates) => {
		setStartDateRoomDetail(dates.startDate);
		setEndDateRoomDetail(dates.endDate);
	};
	const onFocusChangeRoomDetail = (focusedInput) => {
		setFocusedInputRoomDetail(focusedInput);
	};

	const handleSelectLocation = (e, { value }) => {
		setLocation(value);
	};

	// Handle-submit
	const handleSubmitSearchData = (e) => {
		e.preventDefault();
		const nGuests = updatedGRSearch.nAdults + updatedGRSearch.nChilds;
		return !location
			? setRequiredLocation(true)
			: updatedGRSearch.nRooms === 0
			? setRequiredNRooms(true)
			: updatedGRSearch.nGuests === 0
			? setRequiredNGuests(true)
			: setRedirectToSearch(true);
	};

	const handleSaveProperty = () => {
		if (!localStorage.getItem("user-id")) {
			toastNotification.info("Please login to save property");
		}
		const postValue = {
			user_id: localStorage.getItem("user-id"),
			property_id: propertyId,
		};
		services.POST.saveHotel(postValue)
			.then((response) => {
				const data = response.data;
				if (data.status_code === 200) {
					toastNotification.success(data.message);
					if (data.message === "Hotel unsaved") {
						setSavedHotel(false);
					}
					if (data.message === "Hotel saved") {
						setSavedHotel(true);
					}
				}
			})
			.catch((errors) => {
				toastNotification.success(errors);
			});
	};

	//Hanlde-reservation
	const handleProceedReservation = () => {
		localStorage.removeItem("_pmt");
		if (total.nRooms === 0) {
			toastNotification.info("Please Select Room");
		}
		if (total.nRooms !== 0 && !localStorage.getItem("user-id")) {
			setRequiredUserLogin(true);
			localStorage.removeItem("_p");
		}
		if (total.nRooms !== 0 && localStorage.getItem("user-id")) {
			setProceedBookingEntry(true);
			localStorage.removeItem("_p");
		}
	};

	// Store bookig-entry required data in localstorate
	// Redirect to booking-entry page (if atleast one room selected and exists user-id)
	useEffect(() => {
		if (userIdFromContext || proceedBookingEntry) {
			const arrRoomConfig = [];
			for (let i = 0; i < selectedRooms.length; i++) {
				for (let j = 0; j < selectedRooms[i].roomSelectedNo; j++) {
					const arrGuestsOption = [];
					for (let k = selectedRooms[i].nSleep; k > 0; k--) {
						arrGuestsOption.push(k);
					}
					arrRoomConfig.push({
						roomPrice:
							selectedRooms[i].roomPrice / selectedRooms[i].roomSelectedNo,
						sub_room_type: selectedRooms[i].roomName,
						id: uuidv4(),
						arrGuestsOption,
						no_of_guset: arrGuestsOption[0],
						vat: selectedRooms[i].vat,
						price_without_vat:
							selectedRooms[i].price_without_vat /
							selectedRooms[i].roomSelectedNo,
						full_name: "",
						phone: "",
						email: "",
					});
				}
			}

			dispatchBookingBascInfo({
				type: "BOOKING_BASIC_INFO",
				basicInfo: {
					rooms: selectedRooms,
					roomConfig: arrRoomConfig,
					propName: propertyDetail.property_name,
					propPhoto: propertyDetail.prop_image && propertyDetail.prop_image[0],
					nAdults: updatedGRroomDetail.nAdults,
					nChilds: updatedGRroomDetail.nChilds,
					nRooms: total.nRooms,
					nSleep: total.nSleep,
					totRoomPrice: total.nRoomsPrice,
					startDate: startDateRoomDetail.format("YYYY-MM-DD"),
					endDate: endDateRoomDetail.format("YYYY-MM-DD"),
					vat: total.vat,
					totVatAmount: total.vatAmount,
					totPriceWithoutVat: total.price_without_vat,
				},
			});
			setRedirectForBookingEntry(true);
		}
	}, [userIdFromContext, proceedBookingEntry]);

	if (redirectToSearch) {
		return (
			<Redirect
				to={`/search/${location},${startDateSearch.format(
					"YYYY-MM-DD",
				)},${endDateSearch.format("YYYY-MM-DD")},${updatedGRSearch.nRooms}, ${
					updatedGRSearch.nAdults
				}, ${updatedGRSearch.nChilds}`}
			/>
		);
	}
	if (redirectForBookingEntry === true) {
		return <Redirect to={`/bookingEntry/${propertyId}`} />;
	}

	return (
		<>
			<PageLayout innerPage={true}>
				<div className="prop-detail-page">
					<div className="top-search-bar">
						<div className="container">
							<form onSubmit={handleSubmitSearchData}>
								<div className=" page-search-bar__wrapper col-wrapper">
									<div className="col-item col-item--lg-3">
										<div className="form-group">
											<DropdownCustomSelect
												value={location}
												onChange={handleSelectLocation}
												onClick={() => {
													setRequiredLocation(false);
												}}
											/>

											{requiredLocation && (
												<FormFieldError message="Please enter a destination." />
											)}
										</div>
									</div>
									<div className="col-item col-item--lg-4">
										<div className="form-group">
											<DateRangePicker
												startDate={startDateSearch}
												startDateId="your_unique_start_date_id-45"
												endDate={endDateSearch}
												endDateId="your_unique_end_date_id-5554"
												onDatesChange={onDateChangeSearch}
												focusedInput={focusedInputSearch}
												onFocusChange={onFocusChangeSearch}
												displayFormat="dd, DD, MMM"
												firstDayOfWeek={1}
												small={false}
												hideKeyboardShortcutsPanel={true}
												noBorder={true}
												keepOpenOnDateSelect={false}
												reopenPickerOnClearDates={true}
											/>
										</div>
									</div>
									<div className="col-item col-item--lg-3">
										<div className="form-group">
											<label htmlFor="input_destination_1">
												Guests & Rooms
											</label>
											<input
												type="text"
												id="input_destination_1"
												value={
													updatedGRSearch
														? `${updatedGRSearch.nAdults} Adult , ${updatedGRSearch.nChilds} Child, ${updatedGRSearch.nRooms} Room `
														: " Number of Guests and Rooms "
												}
												onClick={() => setShowInputRGmodalSearchHotels(true)}
												onChange={() => setShowInputRGmodalSearchHotels(true)}
											/>
											<span
												onClick={() => setShowInputRGmodalSearchHotels(true)}
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
									</div>
									<div className="col-item col-item--lg-2">
										<button className="utl-btn-primary utl-btn" type="submit">
											SEARCH
										</button>
									</div>
								</div>
							</form>
						</div>
					</div>

					<div className="prop-detail-page__body">
						<div className="container">
							{isLoading && (
								<div className="prop-detail-info-bar">
									<PlaceholderPluid />
								</div>
							)}
							{propertyDetail && (
								<div className=" prop-detail-info-bar flex-aC-jSB">
									<div className="utl-col utl-col-1 hotel-info-primary">
										<h3 className="heading-tertiary hotel-title">
											{propertyDetail.property_name}
										</h3>
										<div className="flex-aC-jFS">
											<span className="hotel-star flex-aC">
												<img src={iconStarYellow} alt="Hotel star" />
												{propertyDetail.star} Star Hotel
											</span>
											<span className="hotel-address">
												<img src={iconLocation} alt="Location" />
												{propertyDetail.street_address !== " " &&
													`${propertyDetail.street_address}, `}
												{propertyDetail.city !== " " &&
													`${propertyDetail.city}, `}
												{propertyDetail.country !== " " &&
													`${propertyDetail.country}`}
											</span>
											<span className="hotel-location-map">
												<span onClick={() => setViewMap(!viewMap)}>
													View on map
												</span>
											</span>
										</div>
									</div>

									<div className="utl-col-2 flex-aC-jFE">
										<div className="review flex-aC-jFE">
											<span className="review__total-review">
												<LinkReactScroll
													to="prop-detail-review"
													smooth={true}
													offset={-100}
													duration={1000}
													spy={true}
												>
													{`${propertyDetail.total_review} Reviews`}
												</LinkReactScroll>
											</span>
											<span className="review__total-rating url-brn-rating-no">
												{`${propertyDetail.hotel_rating} / 5`}
											</span>
										</div>
										<button
											className=" utl-btn utl-btn-tertiary btn-save-hotel"
											onClick={handleSaveProperty}
										>
											<span className={`${savedHotel ? "saved" : "no"}`}>
												Save
											</span>
										</button>
										<button
											className="utl-btn utl-btn-fifth"
											onClick={handleProceedReservation}
										>
											Reserve a Room
										</button>
									</div>
								</div>
							)}

							{isLoading && (
								<div className="prop-detail-nav">
									<PlaceholderPluid />
								</div>
							)}

							{propertyDetail && (
								<div
									className={`prop-detail-nav  ${
										fixedNav ? "prop-detail-nav--sticky" : ""
									}`}
								>
									<ul className="prop-detail-nav__ul flex-aC-jFS">
										<li>
											<LinkReactScroll
												to="prop-detail-overview"
												smooth={true}
												offset={-100}
												duration={1000}
												spy={true}
											>
												Overview
											</LinkReactScroll>
										</li>
										<li>
											<LinkReactScroll
												to="prop-detail-room"
												smooth={true}
												offset={-100}
												duration={500}
												spy={true}
											>
												Room
											</LinkReactScroll>
										</li>
										<li>
											<LinkReactScroll
												to="prop-detail-amenities"
												smooth={true}
												offset={-100}
												duration={500}
												spy={true}
											>
												Amenities & Services
											</LinkReactScroll>
										</li>
										<li>
											<LinkReactScroll
												to="prop-detail-policies"
												smooth={true}
												offset={-100}
												duration={500}
												spy={true}
											>
												Policy
											</LinkReactScroll>
										</li>
										<li>
											<LinkReactScroll
												to="prop-detail-review"
												smooth={true}
												offset={-100}
												duration={500}
												spy={true}
											>
												Reviews
											</LinkReactScroll>
										</li>
									</ul>
								</div>
							)}

							{/*PROPERTY-OVERVIEW*/}
							<Overview propertyDetail={propertyDetail} isLoading={isLoading} />

							<div
								id="prop-detail-room"
								className="prop-detail-row prop-detail-room"
							>
								<h3 className="heading-tertiary">Rooms</h3>
								<div className="utl-row-parent-1 find-room-rate">
									<div className="search-room-available ">
										<div className="col-wrapper">
											<div className="col-item col-item--lg-6">
												<div className="form-group">
													<DateRangePicker
														startDate={startDateRoomDetail}
														startDateId="your_unique_start_date_id-345"
														endDate={endDateRoomDetail}
														endDateId="your_unique_end_date_id-34e"
														onDatesChange={onDateChangeRoomDetail}
														focusedInput={focusedInputRoomDetail}
														onFocusChange={onFocusChangeRoomDetail}
														displayFormat="dd, DD, MMM"
														firstDayOfWeek={1}
														small={false}
														hideKeyboardShortcutsPanel={true}
														noBorder={true}
														keepOpenOnDateSelect={false}
														reopenPickerOnClearDates={true}
													/>
												</div>
											</div>
											<div className="col-item col-item--lg-4">
												<div className="form-group">
													<input
														type="text"
														id="input_search_room_1"
														value={
															updatedGRroomDetail
																? `${updatedGRroomDetail.nAdults} Adult , ${updatedGRroomDetail.nChilds} Child, ${updatedGRroomDetail.nRooms} Room `
																: " Number of Guests and Rooms "
														}
														onClick={() => setShowInputRGmodalCheckRates(true)}
														onChange={() => setShowInputRGmodalCheckRates(true)}
													/>
													<span
														onClick={() => setShowInputRGmodalCheckRates(true)}
														className=" utl-btn utl-btn-tertiary utl-btn-tertiary--sm"
													>
														<img src={iconPen} alt="guests and rooms" />
													</span>
												</div>
											</div>
											<div className="col-item col-item--lg-2">
												<button
													className="utl-btn-primary utl-btn"
													onClick={() =>
														handleGetRoomDetails(
															startDateRoomDetail,
															endDateRoomDetail,
															roomConfig,
														)
													}
												>
													Check Rate
												</button>
											</div>
										</div>
									</div>
								</div>

								{/*Room-details*/}
								{roomDetail && (
									<div className="utl-row-parent-2">
										<table
											className="table table-room-detail"
											ref={roomDetailTableRef}
										>
											<thead
												ref={roomDetailTableHeadRef}
												className="table__header"
											>
												<tr className="table-row">
													<th className="table-col table-col-1">Room Types</th>
													<th className=" table-col table-col-2">
														Service & Facility
													</th>
													<th className=" table-col table-col-3">Including</th>
													<th className=" table-col table-col-4">
														Price for {nStayDays} night
													</th>
													<th
														className=" table-col table-col-5"
														ref={roomDetailTableLastThRef}
													></th>
												</tr>
											</thead>
											<tbody className="table__body">
												{roomDetail.length >= 1 ? (
													roomDetail.map((room, room_index) => {
														return (
															<tr
																className={`table-row ${
																	indexesOfSelectedRooms.includes(room_index)
																		? "selected-room"
																		: ""
																}`}
																//key={uuidv4()}
																key={`dsfdsfsf${room_index}`}
															>
																<td className="table-col table-col-1 room-type">
																	<span className="alt-room-title">
																		Room Type
																	</span>

																	<span className="type">{room.sub_names}</span>
																	<span
																		className="img col-inline-bg"
																		style={{
																			backgroundImage: room.image[0]
																				? `url(${process.env.REACT_APP_API_BASE_URL}${room.image[0]})`
																				: `url(${defaultImg})`,
																		}}
																	></span>
																	<span className="room-capacity flex-aC-jSB">
																		<span className="area flex-aC-jFS">
																			<img src={iconResize} alt="Resize" />
																			<span>
																				{room.room_size} {room.room_unit}
																			</span>
																		</span>
																		<span className="person flex-aC-jFS">
																			<img
																				src={iconUserFriends}
																				alt="User friends"
																			/>
																			{room.max_guest} Sleep
																		</span>
																	</span>
																	{room.beds &&
																		room.beds.map((bed, i) => {
																			return (
																				<span
																					className="bed-type flex-aC-jFS"
																					key={`bed_id--${i}`}
																				>
																					<img src={iconBed} alt="Beds" />
																					{bed}
																				</span>
																			);
																		})}
																</td>

																<td className="table-col table-col-2 amenities-facilities">
																	<span className="alt-room-title">
																		Services and facilities
																	</span>
																	<section className="services-wrapper">
																		{room.amenities &&
																			room.amenities.map((aminity, i) => {
																				return (
																					<li
																						key={uuidv4()}
																						className="flex-aC-jFS"
																					>
																						<span
																							className={`${aminity.icon}`}
																						></span>
																						{aminity.name}
																					</li>
																				);
																			})}
																	</section>
																</td>

																<td className="table-col table-col-3 including">
																	<span className="alt-room-title">
																		Including
																	</span>

																	{room.meals &&
																		room.meals.map((meal, i) => {
																			return (
																				<Fragment key={uuidv4()}>
																					{
																						Object.values(meal)[0] ===
																							"Yes, its optional" ||
																						Object.values(meal)[0] ===
																							"Yes, its complimentary" ? (
																							<span className="included addition-service">
																								{Object.keys(meal)}
																							</span>
																						) : (
																							""
																						)
																						//(
																						//	<span className="not-included addition-service">
																						//		{Object.keys(meal)}
																						//	</span>
																						//)
																					}
																				</Fragment>
																			);
																		})}
																</td>

																<td className="table-col table-col-4 price">
																	<span className="alt-room-title">
																		Price for {nStayDays} night
																	</span>

																	{room.discount_price !== 0 &&
																	room.discount_price > room.price ? (
																		<span className="price__off">
																			{" "}
																			NPR {room.discount_price}
																		</span>
																	) : (
																		""
																	)}

																	<span className="price__act">
																		NPR {parseFloat(room.price).toFixed(2)}
																	</span>
																	<span className="price__info">
																		Includes taxes and charge
																	</span>
																	<span className="price__select">
																		<Select
																			className={`${
																				!room.price_accordingly.length >= 1
																					? "no-rooms"
																					: ""
																			} `}
																			clearable
																			closeOnChange
																			placeholder={`${
																				room.price_accordingly.length >= 1
																					? "Select room"
																					: " Room not available !"
																			}`}
																			disabled={
																				room.price_accordingly.length >= 1
																					? false
																					: true
																			}
																			options={
																				room.price_accordingly.length >= 1
																					? room.price_accordingly.map(
																							(item, i) => {
																								return {
																									//key: uuidv4(),
																									key: `sdlkfl-${i}`,
																									value: {
																										room_no: item.room,
																										price: item.price,
																										vat: item.vat,
																										vatAmount: item.vat_price,
																										price_without_vat:
																											item.price_without_vat,
																									},
																									text: (
																										<Fragment>
																											{item && (
																												<div className="option ">
																													<span className="option__room flex-aC-jFS">
																														{item.room}
																													</span>
																													<span className="option__price flex-aC-jFE">
																														<span className="curr">
																															NPR:{" "}
																														</span>
																														<span className="amount">
																															{item.price}
																														</span>
																													</span>
																												</div>
																											)}
																										</Fragment>
																									),
																								};
																							},
																					  )
																					: [
																							{
																								text: (
																									<span className="no-rooms">
																										Room not available !
																									</span>
																								),
																							},
																					  ]
																			}
																			onChange={(e, { value }) =>
																				handleSelectRooms(
																					room_index,
																					value,
																					room,
																				)
																			}
																		/>
																	</span>
																</td>
																<td
																	className={`table-col table-col-5 table-td-${room_index}`}
																></td>
															</tr>
														);
													})
												) : (
													<tr>
														<td colspan="6" className="td_not-found">
															<h1>Property Not Found</h1>
														</td>
													</tr>
												)}
											</tbody>

											{roomDetail && roomDetail.length >= 1 && (
												<>
													<span
														className={`sum-detail ${
															stickyDetailTable ||
															(windowWidth && windowWidth < 770)
																? "fixed"
																: ""
														}`}
														style={{
															left: stickyDetailTable
																? detailLastThBound.x
																: "",
															//display:
															//	windowWidth && windowWidth < 600
															//		? "none"
															//		: "inline-block",
														}}
													>
														{total &&
															total.nRooms >= 1 &&
															updatedGRroomDetail && (
																<>
																	<span className="n-nights">
																		{nStayDays}{" "}
																		{nStayDays > 1 ? "Nights" : "Night"},
																	</span>{" "}
																	<span className="n-guests">
																		{/*{updatedGRroomDetail.nAdults +
																				updatedGRroomDetail.nChilds}{" "}*/}
																		{total && total.nSleep} Guests can stay
																	</span>
																	<span className="n-rooms">
																		{total.nRooms} Rooms Selected
																	</span>
																</>
															)}{" "}
														<h3 className="tot-price">
															NPR{" "}
															{total &&
																parseFloat(total.nRoomsPrice).toFixed(2)}
														</h3>
														<p className="info">Includes taxes and charge</p>
														<button
															className="utl-btn-primary utl-btn"
															onClick={handleProceedReservation}
														>
															Reserve Now
														</button>
													</span>
												</>
											)}
											<tbody ref={roomDetailTableBottomRef}></tbody>
										</table>
									</div>
								)}
							</div>

							{propertyDetail && (
								<>
									<Amenities propertyDetails={propertyDetail} />
									<Policies propertyDetails={propertyDetail} />
									<Review propertyDetails={propertyDetail} />
								</>
							)}
						</div>
					</div>
				</div>
			</PageLayout>
			{showMapBox && (
				<MapBox
					closeMapBox={() => {
						setShowMapBox(false);
					}}
				/>
			)}
			<ModalInputGuestsRoomsForSearch
				showModal={showInputRGmodalSearchHotels}
				closeModal={() => setShowInputRGmodalSearchHotels(false)}
				guestsAndRooms={guestsAndRoomsForSearc}
				setGuestsAndRooms={setGuestsAndRoomsForSearc}
				updateSearchGRinputField={handleUpdateGRSearchHotels}
			/>
			<ModalInputGuestsRoomsForSearch
				showModal={showInputRGmodalCheckRates}
				closeModal={() => setShowInputRGmodalCheckRates(false)}
				guestsAndRooms={grRoomDetails}
				setGuestsAndRooms={setGrRoomDetails}
				updateSearchGRinputField={handleUpdateGRCheckRates}
			/>

			{requiredUserLogin && (
				<ModalPopUp
					visibleModal={true}
					className="modal-login"
					closeModal={() => setRequiredUserLogin(false)}
				>
					<Login loginAdditional={true} />
				</ModalPopUp>
			)}

			<ModalPopUp
				visibleModal={viewMap}
				closeModal={() => {
					setViewMap(false);
				}}
				className="modal-view-map"
			>
				<MapBox
					zoom={8}
					height="90vh"
					width="100%"
					propertyDetail={[
						{
							...propertyDetail,
							//property_name:propertyDetail[0].property_name,
							//latitude:propertyDetail[0].latitude,
							//	longitude:propertyDetail[0].languages,
							//	prop_image:""
						},
					]}
					draggable={false}
					showPrice={false}
					viewDetail={false}
				/>
			</ModalPopUp>
		</>
	);
};

export default RoomDetail;
