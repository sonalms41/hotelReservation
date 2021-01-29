import React, { Fragment, useState, useEffect, useRef } from "react";
import { Link } from "react-router-dom";
import { PlaceholderPluid } from "../../components/CustomPlaceholder";
import defaultImg from "./../../assets/images/image-default.png";
import { v4 as uuidv4 } from "uuid";
import { LOCAL_STORAGE } from "../../utilities";
import CustomLoader from "../../components/CustomLoader";
import { ButtonPrimary, ButtonSecondary } from "./../../components/button";

const SortDescending = (props) => {
	const linkToPropertyDetailRef = useRef();
	const [isLoadingNew, setIsLoadiingNew] = useState(false);

	const {
		filteredData,
		startDate,
		endDate,
		updatedGR,
		numStayDays,
		location,
		roomConfig,
		isLoading,
		guestsAndRooms,
	} = props;

	const [allPropertiesLength, setAllPropertiesLength] = useState(null);
	const [propertyId, setPropertyId] = useState(null);
	const [descendingOrder, setDescendingOrder] = useState([]);
	const nIncreDecre = 5; // Number to Increment or Decreemnt the showList on click (show more or show less)
	const [nListsToShow, setNListsToShow] = useState(nIncreDecre);
	useEffect(() => {
		// Sort array without mutating original array
		const arrData = Array.from(filteredData);
		const sortDesc = arrData.sort(function (a, b) {
			return b.total_price - a.total_price;
		});
		const currentShowLists = [];
		setAllPropertiesLength(filteredData.length);

		if (sortDesc.length >= 1) {
			for (let i = 0; i < nListsToShow; i++) {
				if (sortDesc[i] !== undefined) {
					currentShowLists.push(sortDesc[i]);
				}
			}
		}
		setDescendingOrder(currentShowLists);
	}, [filteredData, nListsToShow]);

	const handleGetRoomDetail = (propertyId) => {
		setPropertyId(propertyId);

		const valueToViewDetail = {
			roomConfig,
			guestsAndRooms,
			updatedGR,
			startDate,
			endDate,
			location,
		};
		LOCAL_STORAGE.setItem("_s_valToViewDetail", valueToViewDetail);
		setIsLoadiingNew(true);
		setTimeout(() => {
			linkToPropertyDetailRef.current.click();
			setIsLoadiingNew(false);
		}, 300);
	};

	return (
		<>
			<CustomLoader isLoading={isLoadingNew} />
			<div className="prop-lists">
				{isLoading && (
					<Fragment>
						<div className="prop-item ">
							<PlaceholderPluid />
						</div>
						<div className="prop-item ">
							<PlaceholderPluid />
						</div>
						<div className="prop-item ">
							<PlaceholderPluid />
						</div>
					</Fragment>
				)}

				{descendingOrder.length >= 1 &&
					descendingOrder.map((property, i) => {
						return (
							<div className="prop-item flex-jSB" key={uuidv4()}>
								<div className="prop-item__img utl-col utl-col-1">
									<div
										className="prop-image col-inline-bg"
										style={{
											backgroundImage: property.prop_image
												? `url(${process.env.REACT_APP_API_BASE_URL}${property.prop_image})`
												: `url(${defaultImg})`,
										}}
									></div>
								</div>
								<div className="prop-item__detail utl-col-2">
									<div className="utl-row utl-row-1 flex-aC-jSB">
										<div className="utl-col-1">
											<h3 className="hotel-title">
												{}
												<span
													onClick={() =>
														handleGetRoomDetail(property.property_id)
													}
													className="anchor-primary"
												>
													{property.property_name}
												</span>
												<Link
													ref={linkToPropertyDetailRef}
													to={`/propertyDetail/${propertyId}`}
													target="_blank"
												></Link>
											</h3>

											<div className="flex-aC-jFS">
												<span className="utl-star utl-star-y">
													{property.star} Star Hotel
												</span>
												<span className="utl-location">
													{property.street_address !== " " &&
														`${property.street_address}, `}
													{property.city !== " " && `${property.city}, `}
													{property.country !== " " && `${property.country}`}
												</span>
											</div>
										</div>

										<div className="utl-col-2">
											<div className="review flex-aC-jFE">
												<span
													className="review__total-review anchor-primary"
													onClick={() =>
														handleGetRoomDetail(property.property_id)
													}
												>
													{`${property.total_review} Reviews`}
												</span>

												<ButtonPrimary
													widthAuto={true}
													className="url-brn-rating-no"
													onClick={() =>
														handleGetRoomDetail(property.property_id)
													}
													title={`${property.hotel_rating} / 5`}
												/>
											</div>
										</div>
									</div>
									{/*end .utl-row-1*/}

									<div className="utl-row utl-row-2 flex-aFS-jSB">
										<div className="utl-col-1  ">
											{Object.values(property.meals)[0] !== "No" ? (
												<>
													{Object.keys(property.meals).map((item, i) => {
														return <p key={uuidv4()}>{item},</p>;
													})}
												</>
											) : (
												""
											)}
											{property.category && (
												<h4>
													<span className="utl-proptype utl-proptype-deluxe">
														{property.category}
													</span>
												</h4>
											)}
										</div>
										{/*end .utl-col-1*/}
										<div className="utl-col-2 flex-ffC flex-aFE">
											<p>
												{updatedGR.nRooms} Rooms {numStayDays} Nights{" "}
												{updatedGR.nChilds + updatedGR.nAdults} Guests
											</p>
											<div className="price flex-aC-jFE">
												{property.discount &&
												property.discount > property.total_price ? (
													<span className="price__off">
														NPR {property.discount}
													</span>
												) : (
													""
												)}
												<strong>NPR {property.total_price}</strong>
											</div>

											<p>Includes taxes and charge</p>
											<ButtonSecondary
												widthAuth={true}
												onClick={() =>
													handleGetRoomDetail(property.property_id)
												}
												title="Check available room"
											/>
										</div>
										{/*end .utl-col-2*/}
									</div>
									{/*end .utl-row-2*/}
								</div>

								{/*end .prop-item*/}
							</div>
						);
					})}
			</div>

			<div className="property-control">
				<div className="property-control__sum flex-aC-jFE">
					<strong>
						{allPropertiesLength}{" "}
						{descendingOrder.length > 1 ? "Properties" : "Property"} found
						{/*{location}*/}
					</strong>
				</div>
				<ul className="property-control__show flex-aC-jFE">
					<li>
						<span>
							{" "}
							{descendingOrder.length}{" "}
							{descendingOrder.length > 1 ? "Properties" : "Property"} shown
						</span>{" "}
						|
					</li>
					<li>
						<button
							onClick={() =>
								setNListsToShow(
									nListsToShow > nIncreDecre &&
										nListsToShow - nIncreDecre >= nIncreDecre
										? nListsToShow - nIncreDecre
										: nListsToShow > nIncreDecre &&
										  nListsToShow - nIncreDecre < nIncreDecre
										? nListsToShow - (nListsToShow - nIncreDecre)
										: nListsToShow,
								)
							}
							disabled={nListsToShow <= nIncreDecre}
						>
							show less
						</button>{" "}
						|
					</li>
					<li>
						{" "}
						<button
							onClick={() =>
								setNListsToShow(
									nListsToShow + nIncreDecre > allPropertiesLength
										? nListsToShow +
												(nListsToShow + nIncreDecre - allPropertiesLength)
										: nListsToShow + nIncreDecre,
								)
							}
							disabled={nListsToShow >= allPropertiesLength ? true : false}
						>
							show more{" "}
						</button>
					</li>
				</ul>
			</div>
		</>
	);
};

export default SortDescending;
