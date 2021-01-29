import React, { useState, useEffect, useContext } from "react";
import { Scrollbars } from "react-custom-scrollbars";
import { FilterPropertyContext } from "../../hoc/Context";
import services from "../../services";
import { FormFieldCheckbox } from "../../components/FormFields";

const SearchSidebar = (props) => {
	const { searchResult } = props;
	const { handleFiltereProperty } = useContext(FilterPropertyContext);
	const [propertyTypes, setPropertyTypes] = useState(null);
	const [aminities, setAminities] = useState([]);
	const [filterByPriceRadioChecked, setFilterByPriceRadioChecked] = useState(
		false,
	);

	const [filterByPrice, setFilterByPrice] = useState({
		price_start: null,
		price_end: null,
	});

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
	const [filteredData, setFilteredData] = useState([]);

	// Get Amenities
	useEffect(() => {
		services.GET.savedSubAmenities()
			.then((response) => {
				const data = response.data;
				setAminities(data.result);
			})
			.catch((errors) => {});
		services.GET.propertyType()
			.then((response) => {
				const data = response.data;
				if (data.status === 200) {
					setPropertyTypes(data.result);
				}
			})
			.catch((errors) => {});
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
				if (!guestRating[i] === 5) {
					return item.star >= guestRating[i] && item.star < guestRating[i] + 1;
				}
				if (guestRating[i] === 5) {
					return item.star === guestRating[i];
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
			return item.price >= startPrice && item.price <= endPrice;
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
		const startPrice = endPrice == null ? null : filterByPrice.price_start;
		const propertyTypes = filterByPropTypes;
		const features = filterByFeatures;
		const data = searchResult.data;

		// Star
		if (propStar.length >= 1) {
			const fdata = handleFilterStar(propStar, data);
			handleFiltereProperty(fdata);
		}

		// Price
		if (startPrice !== null && endPrice !== null) {
			const fdata = handleFilterPrice(startPrice, endPrice, data);
			handleFiltereProperty(fdata);
		}

		// Rating
		if (guestRating.length >= 1) {
			const fdata = handleFilterRating(guestRating, data);
			handleFiltereProperty(fdata);
		}

		// Types
		if (propertyTypes.length >= 1) {
			const fdata = handleFilterTypes(propertyTypes, data);
			handleFiltereProperty(fdata);
		}

		// Rating, Types
		if (guestRating.length >= 1 && propertyTypes.length >= 1) {
			const fdata1 = handleFilterTypes(propertyTypes, data);
			const fdata2 = handleFilterRating(guestRating, fdata1);
			handleFiltereProperty(fdata2);
		}

		// Star, Price
		if (propStar.length >= 1 && startPrice !== null && endPrice !== null) {
			const fdata1 = handleFilterStar(propStar, data);
			const fdata2 = handleFilterPrice(startPrice, endPrice, fdata1);
			handleFiltereProperty(fdata2);
		}

		// Star, Rating
		if (propStar.length >= 1 && guestRating.length >= 1) {
			const fdata1 = handleFilterStar(propStar, data);
			const fdata2 = handleFilterRating(guestRating, fdata1);
			handleFiltereProperty(fdata2);
		}

		// Star, Type
		if (propStar.length >= 1 && propertyTypes.length >= 1) {
			const fdata1 = handleFilterStar(propStar, data);
			const fdata2 = handleFilterTypes(propertyTypes, fdata1);
			handleFiltereProperty(fdata2);
		}

		// Price, Types
		if (propertyTypes.length >= 1 && startPrice !== null && endPrice !== null) {
			const fdata1 = handleFilterTypes(propertyTypes, data);
			const fdata2 = handleFilterPrice(startPrice, endPrice, fdata1);
			handleFiltereProperty(fdata2);
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
			handleFiltereProperty(fdata3);
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
			handleFiltereProperty(fdata3);
		}

		// Price, Rating
		if (guestRating.length >= 1 && startPrice !== null && endPrice !== null) {
			const fdata1 = handleFilterPrice(startPrice, endPrice, data);
			const fdata2 = handleFilterRating(guestRating, fdata1);
			handleFiltereProperty(fdata2);
		}

		// If no filter
		if (
			propStar.length === 0 &&
			startPrice === null &&
			endPrice === null &&
			guestRating.length === 0 &&
			propertyTypes.length === 0
		) {
			handleFiltereProperty(data);
		}
	}, [
		filterByPropStar,
		filterByPrice,
		filterByPropTypes,
		filterByGuestRating,
		filterByFeatures,
	]);
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

	return (
		<Scrollbars style={{ width: "15rem", height: "100%", position: "fixed" }}>
			<aside className="sidebar sidebar-filter">
				<div className="sidebar-item disable">
					<div className="sidebar-item__header ">
						<h3
							className="flex-aC-jSB"
							onClick={() => setShowFilterStar(!showFilterStar)}
						>
							Hotel Star{" "}
							{showFilterStar ? <span>Hide</span> : <span>Show</span>}
						</h3>
					</div>

					<div className={`sidebar-item__body ${showFilterStar && "visible"}`}>
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
							{showFilterPrice ? <span>Hide</span> : <span>Show</span>}
						</h3>
					</div>
					<div className={`sidebar-item__body ${showFilterPrice && "visible"}`}>
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
								handleSetValuesForFilter.price(e, "filterPriceId1")
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
								handleSetValuesForFilter.price(e, "filterPriceId2")
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
								handleSetValuesForFilter.price(e, "filterPriceId3")
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
								handleSetValuesForFilter.price(e, "filterPriceId4")
							}
							checked={filterPriceId === "filterPriceId4"}
						/>
						<FormFieldCheckbox
							name="filterByPrice"
							id="filterPriceId5"
							value={[10001]}
							label={[
								<span className="checkbox-hk"></span>,
								<span>Greater than Rs. 10,001</span>,
							]}
							className="check-group"
							onChange={(e) =>
								handleSetValuesForFilter.price(e, "filterPriceId5")
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
							{showFilterTypes ? <span>Hide</span> : <span>Show</span>}
						</h3>
					</div>

					<div className={`sidebar-item__body ${showFilterTypes && "visible"}`}>
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
							{showFilterRating ? <span>Hide</span> : <span>Show</span>}
						</h3>
					</div>

					<div
						className={`sidebar-item__body  ${showFilterRating && "visible"}`}
					>
						<div className="guest-rating flex-aC-jFS">
							<FormFieldCheckbox
								id="filter-gRating-1"
								value="1"
								onChange={handleSetValuesForFilter.userRating}
								label={[<span className="checkbox-hk"></span>, <span>1+</span>]}
								className="rating-item flex-aC-jFS"
							/>

							<FormFieldCheckbox
								id="filter-gRating-2"
								value="2"
								onChange={handleSetValuesForFilter.userRating}
								label={[<span className="checkbox-hk"></span>, <span>2+</span>]}
								className="rating-item flex-aC-jFS"
							/>

							<FormFieldCheckbox
								id="filter-gRating-3"
								value="3"
								onChange={handleSetValuesForFilter.userRating}
								label={[<span className="checkbox-hk"></span>, <span>3+</span>]}
								className="rating-item flex-aC-jFS"
							/>

							<FormFieldCheckbox
								id="filter-gRating-4"
								value="4"
								onChange={handleSetValuesForFilter.userRating}
								label={[<span className="checkbox-hk"></span>, <span>4+</span>]}
								className="rating-item flex-aC-jFS"
							/>

							<FormFieldCheckbox
								id="filter-gRating-5"
								value="5"
								onChange={handleSetValuesForFilter.userRating}
								label={[<span className="checkbox-hk"></span>, <span>5</span>]}
								className="rating-item flex-aC-jFS"
							/>
						</div>
					</div>
				</div>
				{/*End sidebar-item*/}
			</aside>
		</Scrollbars>
	);
};

export default SearchSidebar;
