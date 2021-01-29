import React from "react";
const PropertyDetailAmenities = (props) => {
	const { propertyDetails } = props;
	return (
		<div
			id="prop-detail-amenities"
			className="prop-detail-row prop-detail-amenities"
		>
			<h3 className="heading-tertiary">Amenities</h3>
			{/*Render Amenities*/}

			<table className="table table-amenities-detail">
				<thead className="table-head">
					<tr>
						{propertyDetails.aminities &&
							propertyDetails.aminities.map((aminity, i) => {
								return (
									<th
										className={`table-col table-col-${i + 1}`}
										key={`amenities_id_${i}`}
									>
										{aminity.aminity}
									</th>
								);
							})}
					</tr>
				</thead>
				<tbody>
					<tr className="amenities-tr">
						{propertyDetails.aminities &&
							propertyDetails.aminities.map((aminity, i) => {
								return (
									<td
										className={`amenities-td table-col table-col-${i + 1}`}
										key={`subamenitiesid-${i}`}
									>
										<span className="aminity-category visible-on-ss">
											{aminity.aminity}
										</span>
										{aminity.sub_aminity &&
											aminity.sub_aminity.map((aminity_item, i) => {
												return (
													<span
														className="amenities"
														key={`subaminity_id_${i}`}
													>
														<span
															className={`amenities__icon ${aminity_item.icon}`}
														>
															{/*<img src={iconIncludes} alt="Amenities" />*/}
														</span>
														<span className="amenities__title">
															{aminity_item.name}
														</span>
													</span>
												);
											})}
									</td>
								);
							})}
						{/*End  table-col table-col-1*/}
					</tr>
				</tbody>
			</table>

			{/*End-render amenities*/}
		</div>
	);
};

export default PropertyDetailAmenities;
