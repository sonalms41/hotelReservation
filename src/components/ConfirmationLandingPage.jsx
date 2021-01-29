/*******************************************
 * Confirmation-landing page
 * for booking-cancel confimaiton or booking-confirmation)
 *****************************************/

import React, { Fragment } from "react";
import defaultImg from "./../assets/images/image-default.png";
class ConfirmationLandingPage extends React.Component {
	render() {
		const { bookedDetail } = this.props;
		return (
			<>
				{bookedDetail && (
					<table className="utl-table utl-table-landing">
						<tbody className=" body-parent flex-ffC ">
							<tr className="flex-aFS-jFS utl-row tr-parent">
								<td colspan="2" className="td-parent">
									<table className="table-child table-child-0">
										<tbody>
											<tr>
												<td>
													<strong>Booking ID </strong>{" "}
													<span className="u-id">
														{bookedDetail.booking_id}
													</span>
												</td>
											</tr>
											<tr>
												<td>
													<strong> Booked by </strong>
													<span className="u-name">
														{bookedDetail.booked_by}
													</span>
												</td>
											</tr>
										</tbody>
									</table>
								</td>
							</tr>
							<tr className="flex-aFS-jFS utl-row tr-parent">
								<td className="td-parent">
									<table className="table-child">
										<tbody>
											<tr className="flex-aFS">
												<td className="td-prop-img ">
													<div
														className="utl-inline-bg col-inline-bg "
														style={{
															backgroundImage: `${
																bookedDetail.image
																	? `url(${process.env.REACT_APP_API_BASE_URL}${bookedDetail.image})`
																	: `url(${defaultImg})`
															}`,
														}}
													></div>
												</td>

												<td className="td-detail ">
													<table className="table-child">
														<tbody>
															<tr>
																<td>
																	<h3 className="prop-name">
																		{bookedDetail.name}
																	</h3>
																	<p className="prop-binfo flex-aC-jFS">
																		<span className="utl-star utl-star-0 utl-star-y">
																			{bookedDetail.property_star} Star Hotel
																		</span>
																		<span className="utl-location">
																			{bookedDetail.location}
																		</span>
																	</p>
																</td>
																<td className="review flex-aC-jFE">
																	<span className="url-brn-rating-no">
																		0 / 5
																	</span>
																</td>
															</tr>
															<tr className="flex-ffC">
																{bookedDetail.meals &&
																	bookedDetail.meals.map((meal, i) => {
																		return (
																			<td
																				key={`propmealke-${i}`}
																				className={`aminity ${
																					Object.values(meal)[0] !== "No"
																						? "exist"
																						: "not-exist"
																				}`}
																			>
																				{Object.values(meal)[0] !== "No"
																					? Object.keys(meal)
																					: ""}
																			</td>
																		);
																	})}
															</tr>
															<tr>
																{bookedDetail.roomtype &&
																	bookedDetail.roomtype.map((room, i) => {
																		return (
																			<Fragment key={`room-type_${i}`}>
																				<td
																					className={`utl-proptype utl-proptype-deluxe utl-proptype-${i}`}
																				>
																					{room}
																				</td>
																			</Fragment>
																		);
																	})}
															</tr>
														</tbody>
													</table>
												</td>
											</tr>
										</tbody>
									</table>
								</td>
							</tr>
							<tr className="flex-aFS-jFS utl-row tr-parent">
								<td className="td-parent td-parent-lg">
									<table className="table-child">
										<tbody>
											<tr className="flex-aFS-jFS">
												<td className="td-book flex-ffC flex-aFS-jFS">
													<h4>Booked by</h4>
													<span className="value">
														{bookedDetail.booked_by}
													</span>
												</td>
												<td className="td-book flex-ffC flex-aFS-jFS">
													<h4>Check in</h4>
													<span className="value">
														{bookedDetail.mob_checkin} at{" "}
														{bookedDetail.checkin_time}
													</span>
												</td>
												<td className="td-book flex-ffC flex-aFS-jFS ">
													<h4>Stay</h4>
													<span className="value">
														{bookedDetail.nights} Night, {bookedDetail.guests}{" "}
														Guest
													</span>
												</td>
											</tr>
											<tr className="flex-aFS-jFS">
												<td className="td-book flex-ffC flex-aFS-jFS">
													<h4>Phone Number</h4>
													<span className="value">
														{bookedDetail.guest_phone_number}
													</span>
												</td>
												<td className="td-book flex-ffC flex-aFS-jFS">
													<h4>Check out</h4>
													<span className="value">
														{bookedDetail.mob_checkout} at{" "}
														{bookedDetail.checkout_time}
													</span>
												</td>
												<td className="td-book flex-ffC flex-aFS-jFS">
													<h4>Room</h4>
													{bookedDetail.roomtype &&
														bookedDetail.roomtype.map((room, i) => {
															return (
																<span className="value" key={i}>
																	{room}
																</span>
															);
														})}
												</td>
											</tr>
											<tr className="flex-aFS-jFS">
												<td className="td-book flex-ffC flex-aFS-jFS margin-b-no">
													<h4>Email</h4>
													<span className="value">{bookedDetail.email}</span>
												</td>
											</tr>
										</tbody>
									</table>
								</td>
							</tr>
							<tr className="flex-aFS-jFS utl-row tr-parent">
								<td className="td-parent">
									<table className="table-child-sm table-payment">
										<thead>
											<tr>
												<th>
													<h4>Payment Details</h4>
												</th>
											</tr>
										</thead>
										<tbody>
											<tr className="table-row-1">
												<td className="table-td">Booking Amount</td>
												<td className="table-td">
													<strong>NPR {bookedDetail.actual_price}</strong>
												</td>
											</tr>
											<tr className="table-row-2 ">
												<td className="table-td">
													VAT {bookedDetail.vat_amount}
												</td>
												<td className="table-td">
													<strong>NPR {bookedDetail.vat_price}</strong>
												</td>
											</tr>
											<tr className="table-row-3">
												<td className="table-td">
													<strong>Total Pay Amount</strong>
												</td>
												<td className="table-td">
													{bookedDetail.price && (
														<strong>NPR {bookedDetail.price}</strong>
													)}
													{bookedDetail.prices && (
														<strong>NPR {bookedDetail.prices}</strong>
													)}
												</td>
											</tr>
										</tbody>
									</table>
								</td>
							</tr>
							{/*End utl-row-4*/}
							{/*End utl-row-5*/}{" "}
						</tbody>
					</table>
				)}
			</>
		);
	}
}
export default ConfirmationLandingPage;
