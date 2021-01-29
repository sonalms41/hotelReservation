import React from "react";

const PropertyDetailPolicies = (props) => {
	const { propertyDetails } = props;
	return (
		<div
			id="prop-detail-policies"
			className="prop-detail-row prop-detail-policies"
		>
			<h3 className="heading-tertiary">Policies</h3>
			{/*Render Policy*/}

			<div className="col-wrapper policies-container">
				<div className="col-item col-item--lg-6 ">
					<div className="policy-col utl-col-1">
						<ul className="policy-ul">
							<h4>Cancellation Policy</h4>
							{propertyDetails.cancel_property_policies &&
								propertyDetails.cancel_property_policies.map((c_policy, i) => {
									return <li key={`c_policy_id-${i}`}>{c_policy}</li>;
								})}
						</ul>
						<ul className="policy-ul">
							<h4>Other Policy</h4>
							{propertyDetails.rules_policy_array &&
								propertyDetails.rules_policy_array.map((policy, i) => {
									return <li key={`policy_id_general-${i}`}>{policy}</li>;
								})}
						</ul>
					</div>
				</div>
				<div className="col-item col-item--lg-6">
					<div className="policy-col utl-col-2">
						<div className="policy-row col-wrapper">
							<div className="col-item col-item--lg-6">
								<h4>Check in Time</h4>
								<div className="utl-col flex-aC-jFS">
									<span className="col-sm-box-1">
										{propertyDetails && propertyDetails.property_checkin}
									</span>
									<span className="txt">TO</span>
									<span className="col-sm-box-1">
										{propertyDetails && propertyDetails.property_checkin_end}
									</span>
								</div>
							</div>

							<div className="col-item col-item--lg-6">
								<h4>Check out Time</h4>
								<div className="utl-col flex-aC-jFS">
									<span className="col-sm-box-1">
										{propertyDetails && propertyDetails.property_checkout}
									</span>
									<span className="txt">TO</span>
									<span className="col-sm-box-1">
										{propertyDetails && propertyDetails.property_checkout_end}
									</span>
								</div>
							</div>
						</div>
						<div className="policy-row ">
							<h4>Age restriction</h4>
							<p>The minimum age for check-in is 18</p>
						</div>
						<div className="policy-row ">
							<h4>Pet</h4>
							<p>Pets are not allowed.</p>
						</div>
					</div>
				</div>
			</div>
		</div>
	);
};

export default PropertyDetailPolicies;
