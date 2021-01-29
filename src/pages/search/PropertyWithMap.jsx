import React, { Fragment, useState, useEffect, useContext } from "react";
import { Link } from "react-router-dom";
import { PropertyContext } from "../../HOC/Context";
import { PlaceholderPluid } from "../../components/CustomPlaceholder";
import defaultImg from "./../../assets/images/image-default.png";
import Scrollbars from "react-custom-scrollbars";
const PropertyWithMap = (props) => {
	const { handlePropertyDetailContext } = useContext(PropertyContext);
	const {
		filteredData,
		startDate,
		endDate,
		updatedGR,
		location,
		isLoading,
	} = props;
	return (
		<>
			<Scrollbars className="prop-lists-scroll">
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

					{filteredData &&
						filteredData.map((property, i) => {
							return (
								<div
									className="prop-item flex-jSB"
									key={`dsfsdf-${i}`}
									onMouseOver={() => handlePropertyDetailContext(property)}
									onMouseLeave={() => handlePropertyDetailContext(null)}
								>
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
										<div className="utl-row utl-row-1 flex-aC-jSB border-none">
											<div className="utl-col-1">
												<h3 className="hotel-title">
													<Link
														to={`/propertyDetail/${property.property_id}`}
														target="_blank"
													>
														{property.property_name}
													</Link>
												</h3>

												<div className="flex-aFS flex-ffC">
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
										</div>
									</div>
								</div>
							);
						})}
				</div>
			</Scrollbars>
		</>
	);
};

export default PropertyWithMap;
