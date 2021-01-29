import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
// Components
import ProfileLayout from "./ProfileLayout";
import services from "../../services";
import CustomLoader from "../../components/CustomLoader";
import moment from "moment";

// Utilities
import { toastNotification, USER_AUTH } from "../../utilities";

// Images and icons
import defaultImg from "./../../assets/images/image-default.png";

const SavedHotel = () => {
	const userId = USER_AUTH.getUserID();
	const startDate = moment().format("YYYY-MM-DD");
	const endDate = moment().add(1, "days").format("YYYY-MM-DD");
	const [savedProperty, setSavedProperty] = useState(null);
	const [isLoading, setIsLoading] = useState(false);
	useEffect(() => {
		setIsLoading(true);
		userId &&
			services.GET.savedHotel(userId)
				.then((response) => {
					const data = response.data;
					if (data.status_code === 200) {
						setSavedProperty(data.result);
					}
					if (data.status_code === 400) {
						toastNotification.info(data.message);
					}
					setIsLoading(false);
				})
				.catch((errors) => {
					toastNotification.error(`${errors}`);
					setIsLoading(false);
				});
		setIsLoading(false);
	}, []);
	return (
		<>
			<CustomLoader isLoading={isLoading} />
			<ProfileLayout>
				<h2 className="user-profile__page-title">Saved Hotels</h2>

				{savedProperty ? (
					savedProperty.map((property, i) => {
						return (
							<div className="prop-box flex-jFS" key={`saved_prop_key${i}`}>
								<div className="pop-box__col-1 ">
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
													{property.country !== " " && `${property.country}`}
												</span>
											</div>
										</div>

										<div className="utl-col-2">
											<div className="review flex-aC-jFE">
												<span className="review__total-review">
													{property.total_rating} Reviews
												</span>
												<span className="review__total-rating url-brn-rating-no">
													{`${Math.round(property.review)} / 5`}
												</span>
											</div>
										</div>
									</div>
									{/*End pop-box__row-1*/}
									<div className="pop-box__row-2 flex-jSB">
										<div className="utl-col-1">
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
										<div className="utl-col-2 text-right flex-ffC flex-jFE">
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
					<p className="info-notfound">Saved Hotels not available</p>
				)}
				{/*End prop-box*/}
			</ProfileLayout>
		</>
	);
};
export default SavedHotel;
