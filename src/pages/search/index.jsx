// Packages
import React, { useEffect, useState, useContext, useRef } from "react";
import moment from "moment";
import { DateRangePicker } from "react-dates";
import { Tab, Tabs, TabList, TabPanel } from "react-tabs";
import { Scrollbars } from "react-custom-scrollbars";

// Images & Icons
import iconPen from "./../../assets/images/icon-pen.svg";

// Components
import PageLayout from "./../../HOC/PageLayout";
import { FilterPropertyContext } from "../../HOC/Context";
import services from "./../../services";
import { FormFieldCheckbox } from "../../components/FormFields";
import ModalInputGuestsRoomsForSearch from "../../components/ModalInputGuestsRoomsForSearch";
import { calDayDifference, LOCAL_STORAGE } from "../../utilities";
import MapBox from "../../components/MapBox";
import SortDescending from "./SortDescending";
import SortAscending from "./SortAscending";
import PropertyWithMap from "./PropertyWithMap";
import SelectDestination from "../../components/SelectDestination";
import { ButtonPrimary } from "../../components/button";

const Search = () => {
	const { handleFiltereProperty } = useContext(FilterPropertyContext);
	const [searchResult, setSearchResult] = useState({ data: [], response: "" });
	const [startDate, setStartDate] = useState(moment());
	const [endDate, setEndDate] = useState(moment().add(1, "days"));
	const [focusedInput, setFocusedInput] = useState(null);
	const [location, setLocation] = useState();

	const [destination, setDestination] = useState(null); // Selected Destination
	const [destinationLabel, setDestinationLabel] = useState(null); // Selected Destination-label

	const [isLoading, setIsLoading] = useState(true);
	const [propertyTypes, setPropertyTypes] = useState(null);
	const [aminities, setAminities] = useState([]);
	const [requiredLocation, setRequiredLocation] = useState(false);
	const [filterByPriceRadioChecked, setFilterByPriceRadioChecked] = useState(
		false,
	);

	const [roomConfig, setRoomConfig] = useState(null);
	const [numStayDays, setNumStayDays] = useState(null);
	const [newSearch, setNewSearch] = useState(false);
	const [filterByPrice, setFilterByPrice] = useState({
		price_start: null,
		price_end: null,
	});

	const [isViewOnMap, setIsViewOnMap] = useState(false);
	const [filterByPropStar, setFilterByPropStar] = useState([]);
	const [filterPriceId, setFilterPriceId] = useState(null);
	const [filterByGuestRating, setFilterByGuestRating] = useState([]);
	const [filterByFeatures, setFilterByFeatures] = useState([]);
	const [filterByPropTypes, setFilterByPropTypes] = useState([]);

	const [showFilterStar, setShowFilterStar] = useState(true);
	const [showFilterPrice, setShowFilterPrice] = useState(true);
	const [showFilterTypes, setShowFilterTypes] = useState(true);
	const [showFilterFeatues, setShowFilterFeatures] = useState(true);
	const [showFilterRating, setShowFilterRating] = useState(true);

	// Default number of Guests and Rooms
	const [guestsAndRooms, setGuestsAndRooms] = useState([
		{
			nRooms: 1,
			nAdults: 1,
			nChilds: 0,
		},
	]);
	// Updated Guests and Rooms
	const [updatedGR, setUpdatedGR] = useState({
		nRooms: 1,
		nAdults: 1,
		nChilds: 0,
	});
	const [showInputRGmodal, setShowInputRGmodal] = useState(false);
	const [filteredData, setFilteredData] = useState([]);
	const [sidebarBound, setSidebarBound] = useState({});
	const [yOffset, setYOffset] = useState(null);
	const [windowWidth, setWindowWidth] = useState(window.innerWidth);
	const sidebarRef = useRef();

	// ON-WINDOW-RESIZE
	window.addEventListener("scroll", () => {
		setYOffset(window.pageYOffset);
		setWindowWidth(window.innerWidth);
	});

	// Get initial search-values from localstorage
	// Initial search value is derived from other pages (landing-page, property-detail-page)
	useEffect(() => {
		const searchValue = LOCAL_STORAGE.getItem("_s_search");
		if (searchValue !== undefined) {
			let {
				location,
				guestsAndRooms,
				destinationLabel,
				destination,
				updatedGuestsAndRooms,
				roomConfig,
			} = searchValue;

			const startDate = moment(searchValue.startDate);
			const endDate = moment(searchValue.endDate);
			setRoomConfig(roomConfig);
			setStartDate(startDate);
			setEndDate(endDate);
			setLocation(location);
			setDestination(destination);

			setDestinationLabel(destinationLabel);
			setGuestsAndRooms(guestsAndRooms);
			setUpdatedGR(updatedGuestsAndRooms);
			handleSearch(destination, startDate, endDate, roomConfig);
		}
	}, []);

	useEffect(() => {
		const sidebar = sidebarRef.current.getBoundingClientRect();
		setSidebarBound({
			x: sidebar.x,
			y: sidebar.y,
			width: sidebar.width,
			bottom: sidebar.bottom,
		});
	}, [yOffset]);

	const handleSearch = (location, startDate, endDate, roomConfig) => {
		setIsLoading(true);
		const searchValue = {
			search_key: location ? location : "",
			starting_date: startDate.format("YYYY-MM-DD"),
			ending_date: endDate.format("YYYY-MM-DD"),
			room_conf: roomConfig,
		};
		services.POST.searchFilter(searchValue)
			.then((response) => {
				const data = response.data;
				if (data.status === 200) {
					setSearchResult({ data: data.property_dict });
					setFilteredData(data.property_dict);
					handleFiltereProperty(data.property_dict);
				}
				if (data.status === 400) {
					setSearchResult({
						data: [],
						response: data.message,
					});
				}
				setIsLoading(false);
			})
			.catch((errors) => {
				setIsLoading(false);
			});
		const getNumStayDay = calDayDifference(
			searchValue.starting_date,
			searchValue.ending_date,
		);
		setNumStayDays(getNumStayDay);
	};

	// Get data from route
	//useEffect(() => {
	//	if (routeData !== undefined) {
	//		const location = routeData.location ? routeData.location : "";
	//		const startDate = moment(routeData.startDate);
	//		const endDate = moment(routeData.endDate);
	//		const nRooms = parseInt(routeData.nRooms);
	//		const nAdults = parseInt(routeData.nAdults);
	//		const nChilds = parseInt(routeData.nChilds);
	//		setStartDate(startDate);
	//		setEndDate(endDate);
	//		setLocation(location);
	//		setGuestsAndRooms([
	//			{
	//				nRooms,
	//				nAdults,
	//				nChilds,
	//			},
	//		]);
	//		setUpdatedGR({
	//			nRooms,
	//			nAdults,
	//			nChilds,
	//		});
	//		const getNumStayDay = calDayDifference(
	//			routeData.startDate,
	//			routeData.endDate,
	//		);
	//		setNumStayDays(getNumStayDay);
	//		handleSearch(location, startDate, endDate, nRooms, nAdults, nChilds);
	//	}
	//}, [routeData]);

	// Handle guests and rooms search-input field
	const handleUpdateGR = () => {
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
	};

	// GET-AMENITIES,
	const getAmenities = () => {
		services.GET.savedSubAmenities()
			.then((response) => {
				const data = response.data;
				if (data.status_code === 200) {
					setAminities(data.result);
				}
				setIsLoading(false);
			})
			.catch((errors) => {});
	};

	// GET-PROPERTY-TYPES
	const getPropertyTypes = () => {
		services.GET.propertyType()
			.then((response) => {
				const data = response.data;
				if (data.status === 200) {
					setPropertyTypes(data.result);
				}
			})
			.catch((errors) => {});
	};

	useEffect(() => {
		getAmenities();
		getPropertyTypes();
	}, []);

	// FILTER
	const handleFilterStar = (propStar, data) => {
		const filteredData = data.filter((item) => {
			return propStar.includes(item.star);
		});
		return filteredData;
	};

	const handleFilterRating = (guestRating, property) => {
		const filteredData = property.filter((item, i) => {
			for (let i = 0; i < guestRating.length; i++) {
				if (guestRating[i] !== 5) {
					return (
						item.hotel_rating >= guestRating[i] &&
						item.hotel_rating < guestRating[i] + 1
					);
				}
				if (guestRating[i] === 5) {
					return item.hotel_rating === guestRating[i];
				}
			}
			return guestRating.includes(item.hotel_rating);
		});
		return filteredData;
	};

	const handleFilterTypes = (propertyTypes, data) => {
		const filteredData = data.filter((item) => {
			return propertyTypes.includes(item.property_type);
		});
		return filteredData;
	};

	const handleFilterPrice = (startPrice, endPrice, data) => {
		const filteredData = data.filter((item) => {
			return startPrice && endPrice
				? item.total_price >= startPrice && item.total_price <= endPrice
				: item.total_price >= startPrice;
		});
		return filteredData;
	};

	useEffect(() => {
		const propStar = filterByPropStar;
		const guestRating = filterByGuestRating;
		const endPrice =
			filterByPrice.price_end !== 0 && filterByPrice.price_end !== null
				? filterByPrice.price_end
				: null;
		const startPrice = endPrice === null ? null : filterByPrice.price_start;
		const propertyTypes = filterByPropTypes;
		const features = filterByFeatures;
		const data = searchResult.data;

		// Star
		if (propStar.length >= 1) {
			const fdata = handleFilterStar(propStar, data);
			setFilteredData(fdata);
		}

		// Price
		if (startPrice !== null && endPrice !== null) {
			const fdata = handleFilterPrice(startPrice, endPrice, data);
			setFilteredData(fdata);
		}

		// Rating
		if (guestRating.length >= 1) {
			const fdata = handleFilterRating(guestRating, data);
			setFilteredData(fdata);
		}

		// Types
		if (propertyTypes.length >= 1) {
			const fdata = handleFilterTypes(propertyTypes, data);
			setFilteredData(fdata);
		}

		// Rating, Types
		if (guestRating.length >= 1 && propertyTypes.length >= 1) {
			const fdata1 = handleFilterTypes(propertyTypes, data);
			const fdata2 = handleFilterRating(guestRating, fdata1);
			setFilteredData(fdata2);
		}

		// Star, Price
		if (propStar.length >= 1 && startPrice !== null && endPrice !== null) {
			const fdata1 = handleFilterStar(propStar, data);
			const fdata2 = handleFilterPrice(startPrice, endPrice, fdata1);
			setFilteredData(fdata2);
		}

		// Star, Rating
		if (propStar.length >= 1 && guestRating.length >= 1) {
			const fdata1 = handleFilterStar(propStar, data);
			const fdata2 = handleFilterRating(guestRating, fdata1);
			setFilteredData(fdata2);
		}

		// Star, Type
		if (propStar.length >= 1 && propertyTypes.length >= 1) {
			const fdata1 = handleFilterStar(propStar, data);
			const fdata2 = handleFilterTypes(propertyTypes, fdata1);
			setFilteredData(fdata2);
		}

		// Price, Types
		if (propertyTypes.length >= 1 && startPrice !== null && endPrice !== null) {
			const fdata1 = handleFilterTypes(propertyTypes, data);
			const fdata2 = handleFilterPrice(startPrice, endPrice, fdata1);
			setFilteredData(fdata2);
		}

		// Star, Price, Rating
		if (
			propStar.length >= 1 &&
			guestRating.length >= 1 &&
			startPrice !== null &&
			endPrice !== null
		) {
			const fdata1 = handleFilterStar(propStar, data);
			const fdata2 = handleFilterPrice(startPrice, endPrice, fdata1);
			const fdata3 = handleFilterRating(guestRating, fdata2);
			setFilteredData(fdata3);
		}

		// Star, Price, Types
		if (
			propStar.length >= 1 &&
			propertyTypes.length >= 1 &&
			startPrice !== null &&
			endPrice !== null
		) {
			const fdata1 = handleFilterStar(propStar, data);
			const fdata2 = handleFilterPrice(startPrice, endPrice, fdata1);
			const fdata3 = handleFilterTypes(propertyTypes, fdata2);
			setFilteredData(fdata3);
		}

		// Price, Rating
		if (guestRating.length >= 1 && startPrice !== null && endPrice !== null) {
			const fdata1 = handleFilterPrice(startPrice, endPrice, data);
			const fdata2 = handleFilterRating(guestRating, fdata1);
			setFilteredData(fdata2);
		}

		// If no filter
		if (
			propStar.length === 0 &&
			startPrice === null &&
			endPrice === null &&
			guestRating.length === 0 &&
			propertyTypes.length === 0
		) {
			setFilteredData(data);
		}
	}, [
		filterByPropStar,
		filterByPrice,
		filterByPropTypes,
		filterByGuestRating,
		filterByFeatures,
		searchResult.data,
	]);

	// Date-rante picker
	const onDateChange = (dates) => {
		setStartDate(dates.startDate);
		setEndDate(dates.endDate);
	};
	const onFocusChange = (focusedInput) => {
		setFocusedInput(focusedInput);
	};

	// This function execute when user click on Search-button
	const handleNewSearch = () => {
		if (location) {
			const roomConfig = guestsAndRooms.map((room, i) => {
				return {
					room: i + 1,
					guest: room.nChilds + room.nAdults,
				};
			});

			setNewSearch(!newSearch);
			setRoomConfig(roomConfig);
			handleSearch(destination, startDate, endDate, roomConfig);
		}
		location === "" || (location === undefined && setRequiredLocation(true));
	};

	const handleSelectLocation = (e, { value }) => {
		setLocation(value);
		setRequiredLocation(false);
	};

	// HANDLE FILTER-PROPERTY
	const handleSetValuesForFilter = {
		propStar: function (e) {
			const checkedStatus = e.target.checked;
			const star = parseInt(e.target.value);
			if (checkedStatus === true) {
				setFilterByPropStar([...filterByPropStar, star]);
			}
			if (checkedStatus === false) {
				const newData = filterByPropStar.filter((data) => {
					return data !== parseInt(e.target.value);
				});
				setFilterByPropStar([...newData]);
			}
		},
		price: function (e, id) {
			setFilterByPriceRadioChecked(!filterByPriceRadioChecked);
			const price = e.target.value;
			const checkedStatus = e.target.checked;
			const arrValue = price.split(",");
			let price_start = parseInt(arrValue[0]);
			let price_end = parseInt(arrValue[1]);

			if (checkedStatus === true) {
				setFilterByPrice({
					price_start,
					price_end,
				});
				setFilterPriceId(id);
			}

			if (checkedStatus === false) {
				setFilterByPrice({
					price_start: null,
					price_end: null,
				});
				setFilterPriceId(null);
			}
		},
		types: function (e) {
			const type = e.target.value;
			const checkedStatus = e.target.checked;
			if (checkedStatus === true) {
				setFilterByPropTypes([...filterByPropTypes, type]);
			}
			if (checkedStatus === false) {
				const newData = filterByPropTypes.filter((data) => {
					return data !== e.target.value;
				});
				setFilterByPropTypes([...newData]);
			}
		},
		features: function (e) {
			const features = e.target.value;
			const checkedStatus = e.target.checked;
			if (checkedStatus === true) {
				setFilterByFeatures([...filterByFeatures, features]);
			}
			if (checkedStatus === false) {
				const newData = filterByFeatures.filter((data) => {
					return data !== e.target.value;
				});
				setFilterByFeatures([...newData]);
			}
		},
		userRating: function (e) {
			const checkedStatus = e.target.checked;
			const rating = parseInt(e.target.value);
			if (checkedStatus === true) {
				setFilterByGuestRating([...filterByGuestRating, rating]);
			}
			if (checkedStatus === false) {
				const newData = filterByGuestRating.filter((data) => {
					return data !== parseInt(e.target.value);
				});
				setFilterByGuestRating([...newData]);
			}
		},
	};

	// CHANGE-DESTINATION
	const handleChangeDestination = ({ label, value }) => {
		setDestinationLabel(label);
		setDestination(value);
	};

	return (
		<>
			{/*<CustomLoader isLoading={isLoading} />*/}
			<ModalInputGuestsRoomsForSearch
				showModal={showInputRGmodal}
				closeModal={() => setShowInputRGmodal(false)}
				guestsAndRooms={guestsAndRooms}
				setGuestsAndRooms={setGuestsAndRooms}
				updateSearchGRinputField={handleUpdateGR}
			/>
			<PageLayout innerPage={true}>
				<div className="search-page">
					<div className="top-search-bar">
						<div className="container">
							<div className=" page-search-bar__wrapper col-wrapper">
								<div className="col-item col-item--lg-3">
									<div className="form-group">
										<SelectDestination
											defaultInputValue={
												destination ? destination : "loading..."
											}
											onChange={handleChangeDestination}
										/>

										{requiredLocation && (
											<div className="required-notification">
												Please enter a destination
											</div>
										)}
									</div>

									{/*<div className="form-group">
										<DropdownCustomSelect
											value={location}
											onChange={handleSelectLocation}
										/>
										{requiredLocation && (
											<div className="required-notification">
												Please enter a destination
											</div>
										)}
									</div>*/}
								</div>
								<div className="col-item col-item--lg-4">
									<div className="form-group">
										<DateRangePicker
											startDate={startDate}
											startDateId="search__start-date__id"
											endDate={endDate}
											endDateId="search__end-date__id"
											onDatesChange={onDateChange}
											focusedInput={focusedInput}
											onFocusChange={onFocusChange}
											displayFormat="dd, DD, MMM"
											firstDayOfWeek={1}
											small={false}
											hideKeyboardShortcutsPanel={true}
											noBorder={true}
											keepOpenOnDateSelect={false}
											reopenPickerOnClearDates={true}
											numberOfMonths={windowWidth < 770 ? 1 : 2}
										/>
									</div>
								</div>
								<div className="col-item col-item--lg-3">
									<div className="form-group">
										<label htmlFor="input_destination_1">Guests & Rooms</label>
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
									</div>
								</div>
								<div className="col-item col-item--lg-2">
									<ButtonPrimary title="SEARCH" onClick={handleNewSearch} />
								</div>
							</div>
						</div>
					</div>

					<div className="search-page__body">
						<div
							className={`container container--min-height ${
								isViewOnMap ? "view-map-container" : ""
							}`}
						>
							<div className="col-wrapper">
								{/*LEFT-SIDEBAR*/}
								{/*<SearchSidebar searchResult={searchResult}/>*/}
								<div
									className="col-item col-item--lg-3 search-sidebar"
									ref={sidebarRef}
								>
									<Scrollbars
										className="sidebar-scroll"
										style={
											sidebarBound.y < 6 && sidebarBound.bottom > 800
												? {
														position: "fixed",
														left: sidebarBound.x + 15,
														width: sidebarBound.width - 30,
														top: 5,
												  }
												: ""
										}
									>
										<aside className="sidebar sidebar-filter">
											<div className="sidebar-item disable">
												<div className="sidebar-item__header ">
													<h3
														className="flex-aC-jSB"
														onClick={() => setShowFilterStar(!showFilterStar)}
													>
														Hotel Star{" "}
														{showFilterStar ? (
															<span>Hide</span>
														) : (
															<span>Show</span>
														)}
													</h3>
												</div>

												<div
													className={`sidebar-item__body ${
														showFilterStar && "visible"
													}`}
												>
													<ul className="hotel-star flex-aC-jFS">
														<div className="check-group flex-aC-jFS">
															<input
																className="hotel-star"
																type="checkbox"
																value="1"
																onClick={handleSetValuesForFilter.propStar}
																id="filterbystar_1"
															/>
															<label htmlFor="filterbystar_1">1</label>
														</div>
														<div className="check-group flex-aC-jFS">
															<input
																className="hotel-star"
																type="checkbox"
																value="2"
																onClick={handleSetValuesForFilter.propStar}
																id="filterbystar_2"
															/>
															<label htmlFor="filterbystar_2">2</label>
														</div>
														<div className="check-group flex-aC-jFS">
															<input
																className="hotel-star"
																type="checkbox"
																value="3"
																onClick={handleSetValuesForFilter.propStar}
																id="filterbystar_3"
															/>
															<label htmlFor="filterbystar_3">3</label>
														</div>

														<div className="check-group flex-aC-jFS">
															<input
																className="hotel-star"
																type="checkbox"
																value="4"
																onClick={handleSetValuesForFilter.propStar}
																id="filterbystar_4"
															/>
															<label htmlFor="filterbystar_4">4</label>
														</div>
														<div className="check-group flex-aC-jFS">
															<input
																className="hotel-star"
																type="checkbox"
																value="5"
																onClick={handleSetValuesForFilter.propStar}
																id="filterbystar_5"
															/>
															<label htmlFor="filterbystar_5">5</label>
														</div>
													</ul>
												</div>
											</div>
											{/*End sidebar-item*/}
											<div className="sidebar-item">
												<div
													className="sidebar-item__header"
													onClick={() => setShowFilterPrice(!showFilterPrice)}
												>
													<h3>
														Price Per Night{" "}
														{showFilterPrice ? (
															<span>Hide</span>
														) : (
															<span>Show</span>
														)}
													</h3>
												</div>
												<div
													className={`sidebar-item__body ${
														showFilterPrice && "visible"
													}`}
												>
													<FormFieldCheckbox
														name="filterByPrice"
														id="filterPriceId1"
														value={[0, 1000]}
														label={[
															<span className="checkbox-hk"></span>,
															<span>0 to Rs. 1,000</span>,
														]}
														className="check-group"
														onChange={(e) =>
															handleSetValuesForFilter.price(
																e,
																"filterPriceId1",
															)
														}
														checked={filterPriceId === "filterPriceId1"}
													/>
													<FormFieldCheckbox
														name="filterByPrice"
														id="filterPriceId2"
														value={[1001, 2000]}
														label={[
															<span className="checkbox-hk"></span>,
															<span>Rs. 1,001 to Rs. 2,000</span>,
														]}
														className="check-group"
														onChange={(e) =>
															handleSetValuesForFilter.price(
																e,
																"filterPriceId2",
															)
														}
														checked={filterPriceId === "filterPriceId2"}
													/>
													<FormFieldCheckbox
														name="filterByPrice"
														id="filterPriceId3"
														value={[2001, 4000]}
														label={[
															<span className="checkbox-hk"></span>,
															<span>Rs. 2,001 to Rs. 4,000</span>,
														]}
														className="check-group"
														onChange={(e) =>
															handleSetValuesForFilter.price(
																e,
																"filterPriceId3",
															)
														}
														checked={filterPriceId === "filterPriceId3"}
													/>
													<FormFieldCheckbox
														name="filterByPrice"
														id="filterPriceId4"
														value={[4001, 7000]}
														label={[
															<span className="checkbox-hk"></span>,
															<span>Rs. 4,001 to Rs. 7,000</span>,
														]}
														className="check-group"
														onChange={(e) =>
															handleSetValuesForFilter.price(
																e,
																"filterPriceId4",
															)
														}
														checked={filterPriceId === "filterPriceId4"}
													/>
													<FormFieldCheckbox
														name="filterByPrice"
														id="filterPriceId5"
														value={[7001]}
														label={[
															<span className="checkbox-hk"></span>,
															<span>Greater than Rs. 7,001</span>,
														]}
														className="check-group"
														onChange={(e) =>
															handleSetValuesForFilter.price(
																e,
																"filterPriceId5",
															)
														}
														checked={filterPriceId === "filterPriceId5"}
													/>
												</div>
											</div>
											{/*End sidebar-item*/}

											<div className="sidebar-item">
												<div
													className="sidebar-item__header"
													onClick={() => setShowFilterTypes(!showFilterTypes)}
												>
													<h3>
														Property Type{" "}
														{showFilterTypes ? (
															<span>Hide</span>
														) : (
															<span>Show</span>
														)}
													</h3>
												</div>

												<div
													className={`sidebar-item__body ${
														showFilterTypes && "visible"
													}`}
												>
													{propertyTypes &&
														propertyTypes.map((property, i) => {
															return (
																<FormFieldCheckbox
																	key={`property_typeKey-${i}`}
																	id={`$property_typeId-${i}`}
																	value={property.name}
																	onChange={handleSetValuesForFilter.types}
																	label={[
																		<span className="checkbox-hk"></span>,
																		<span>{property.name}</span>,
																	]}
																	className="check-group"
																/>
															);
														})}
												</div>
											</div>
											{/*End sidebar-item*/}

											{/*<div className="sidebar-item">
												<div
													className="sidebar-item__header "
													onClick={() =>
														setShowFilterFeatures(!showFilterFeatues)
													}
												>
													<h3>
														Hotel Features{" "}
														{showFilterFeatues ? (
															<span>Hide</span>
														) : (
															<span>Show</span>
														)}
													</h3>
												</div>

												<div
													className={`sidebar-item__body ${
														showFilterFeatues && "visible"
													}`}
												>
													{aminities &&
														aminities.map((aminity, i) => {
															return (
																<FormFieldCheckbox
																	key={`sub_aminityKey-${i}`}
																	id={`aminity_id-${i}`}
																	value={aminity.aminity}
																	onChange={handleSetValuesForFilter.features}
																	label={[
																		<span className="checkbox-hk"></span>,
																		<span>{aminity.aminity}</span>,
																	]}
																	className="check-group"
																/>
															);
														})}
												</div>
											</div>*/}
											{/*End sidebar-item*/}

											<div className="sidebar-item">
												<div
													className="sidebar-item__header "
													onClick={() => setShowFilterRating(!showFilterRating)}
												>
													<h3>
														Guest Rating{" "}
														{showFilterRating ? (
															<span>Hide</span>
														) : (
															<span>Show</span>
														)}
													</h3>
												</div>

												<div
													className={`sidebar-item__body  ${
														showFilterRating && "visible"
													}`}
												>
													<div className="guest-rating flex-aC-jFS">
														<FormFieldCheckbox
															id="filter-gRating-1"
															value="1"
															onChange={handleSetValuesForFilter.userRating}
															label={[
																<span className="checkbox-hk"></span>,
																<span>1+</span>,
															]}
															className="rating-item flex-aC-jFS"
														/>

														<FormFieldCheckbox
															id="filter-gRating-2"
															value="2"
															onChange={handleSetValuesForFilter.userRating}
															label={[
																<span className="checkbox-hk"></span>,
																<span>2+</span>,
															]}
															className="rating-item flex-aC-jFS"
														/>

														<FormFieldCheckbox
															id="filter-gRating-3"
															value="3"
															onChange={handleSetValuesForFilter.userRating}
															label={[
																<span className="checkbox-hk"></span>,
																<span>3+</span>,
															]}
															className="rating-item flex-aC-jFS"
														/>

														<FormFieldCheckbox
															id="filter-gRating-4"
															value="4"
															onChange={handleSetValuesForFilter.userRating}
															label={[
																<span className="checkbox-hk"></span>,
																<span>4+</span>,
															]}
															className="rating-item flex-aC-jFS"
														/>

														<FormFieldCheckbox
															id="filter-gRating-5"
															value="5"
															onChange={handleSetValuesForFilter.userRating}
															label={[
																<span className="checkbox-hk"></span>,
																<span>5</span>,
															]}
															className="rating-item flex-aC-jFS"
														/>
													</div>
												</div>
											</div>
											{/*End sidebar-item*/}
										</aside>
									</Scrollbars>
								</div>
								<div className="col-item col-item--lg-9 search-result">
									<span className="search-result-filter">Sort By</span>

									<Tabs className="sort-tabs">
										<TabList className="sort-tabs__ul ">
											<Tab onClick={() => setIsViewOnMap(false)}>
												Lowest Price
											</Tab>
											<Tab onClick={() => setIsViewOnMap(false)}>
												Highest Price
											</Tab>
											<Tab onClick={() => setIsViewOnMap(true)}>
												View on map
											</Tab>
										</TabList>

										{/*PENDING*/}
										<TabPanel>
											<SortAscending
												filteredData={filteredData}
												startDate={startDate}
												endDate={endDate}
												updatedGR={updatedGR}
												numStayDays={numStayDays}
												location={location}
												isLoading={isLoading}
												roomConfig={roomConfig}
												guestsAndRooms={guestsAndRooms}
											/>
										</TabPanel>
										<TabPanel>
											<SortDescending
												filteredData={filteredData}
												startDate={startDate}
												endDate={endDate}
												updatedGR={updatedGR}
												numStayDays={numStayDays}
												isLoading={isLoading}
												location={location}
												roomConfig={roomConfig}
												guestsAndRooms={guestsAndRooms}
											/>
										</TabPanel>
										<TabPanel>
											<div className="property-with-map flex-aFS-jFS">
												<PropertyWithMap
													filteredData={filteredData}
													startDate={startDate}
													endDate={endDate}
													updatedGR={updatedGR}
													numStayDays={numStayDays}
													isLoading={isLoading}
													location={location}
												/>
												{filteredData && filteredData.length >= 1 && (
													<MapBox
														zoom={6}
														height="90vh"
														width="100%"
														propertyDetail={filteredData.map((property, i) => {
															return {
																...property,
																startDate,
																endDate,
																nChilds: updatedGR.nChilds,
																nAdults: updatedGR.nAdults,
																nRooms: updatedGR.nRooms,
															};
														})}
														draggable={false}
														viewDetail={true}
														showPrice={true}
													/>
												)}
											</div>
										</TabPanel>
									</Tabs>
									{/*<Tab
										onClick={handleChangeTab}
										menu={{ secondary: true, pointing: true }}
										panes={[
											{
												menuItem: "Lowest Price",
												render: () => (
													<Tab.Pane attached={false}>
														<SortAscending
															filteredData={filteredData}
															startDate={startDate}
															endDate={endDate}
															updatedGR={updatedGR}
															numStayDays={numStayDays}
															location={location}
															isLoading={isLoading}
															roomConfig={roomConfig}
															guestsAndRooms={guestsAndRooms}
														/>
													</Tab.Pane>
												),
											},

											// Descending Order
											{
												menuItem: "Highest Price",
												render: () => (
													<Tab.Pane attached={false}>
														<SortDescending
															filteredData={filteredData}
															startDate={startDate}
															endDate={endDate}
															updatedGR={updatedGR}
															numStayDays={numStayDays}
															isLoading={isLoading}
															location={location}
															roomConfig={roomConfig}
															guestsAndRooms={guestsAndRooms}
														/>
													</Tab.Pane>
												),
											},

											// View on Map
											{
												menuItem: "View on map",
												render: () => (
													<Tab.Pane attached={false}>
														<div className="property-with-map flex-aFS-jFS">
															<PropertyWithMap
																filteredData={filteredData}
																startDate={startDate}
																endDate={endDate}
																updatedGR={updatedGR}
																numStayDays={numStayDays}
																isLoading={isLoading}
																location={location}
															/>
															{filteredData && filteredData.length >= 1 && (
																<MapBox
																	zoom={5}
																	height="90vh"
																	width="100%"
																	propertyDetail={filteredData.map(
																		(property, i) => {
																			return {
																				...property,
																				startDate,
																				endDate,
																				nChilds: updatedGR.nChilds,
																				nAdults: updatedGR.nAdults,
																				nRooms: updatedGR.nRooms,
																			};
																		},
																	)}
																	draggable={false}
																	viewDetail={true}
																	showPrice={true}
																/>
															)}
														</div>
													</Tab.Pane>
												),
											},
										]}
									/>*/}
								</div>
							</div>
						</div>
					</div>
				</div>
			</PageLayout>
		</>
	);
};

export default React.memo(Search);
