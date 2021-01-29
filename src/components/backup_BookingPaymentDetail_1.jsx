import React from "react";
import defaultImg from "./../assets/images/image-default.png";

const BookingPaymentDetail = (props) => {
	const { bookingData } = props;

	return (
		<>
			{bookingData && (
				<div className="booking-payment-detail">
					<div className="utl-row">
						<div
							className="property-photo"
							style={{
								backgroundImage: `${
									bookingData.propPhoto
										? `url(${process.env.REACT_APP_API_BASE_URL}${bookingData.propPhoto})`
										: `url(${defaultImg})`
								}`,
							}}
						></div>
						<h3 className="heading-tertiary hotel-name">
							{bookingData.propName}
						</h3>
						<div className="general-info flex-aC-jSB">
							<div className="check-in-out  flex-ffC flex-aFS">
								<span className="info-row-1">Check IN Check Out</span>
								<span className="info-row-2 ">
									{bookingData.startDate} : {bookingData.endDate}
								</span>
							</div>
							<div className="room flex-ffC flex-aC">
								<span className="info-row-1 ">Number of Room</span>
								<span className="info-row-2 ">
									{bookingData.nRooms} Room - {bookingData.nSleep}{" "}
									{bookingData.nSleep > 1 ? "Guests" : "Guest"}{" "}
									{/*{bookingData.nRooms} Room - {bookingData.nAdults} Adults,
									{bookingData.nChilds ? `${bookingData.nChilds} Childs` : ""}*/}
								</span>
							</div>
						</div>

						<table className="room-price">
							<tbody>
								{bookingData.rooms &&
									bookingData.rooms.map((room, i) => {
										return (
											<tr className="room-price__row" key={`room_key-${i}`}>
												<td className="">
													<strong className="room-type">{room.roomName}</strong>
													<span>{parseInt(room.roomSelectedNo)} Room,</span>
												</td>
												<td className="room-price text-right">
													NRS. {room.price_without_vat}
												</td>
											</tr>
										);
									})}
								<tr className="room-price__row total">
									<td>Total</td>
									<td>
										NRS. {parseFloat(bookingData.totPriceWithoutVat).toFixed(2)}
									</td>
								</tr>
								<tr className="room-price__row vat">
									<td>{bookingData.vat}% VAT</td>
									<td>
										{parseFloat(
											bookingData.totVatAmount ? bookingData.totVatAmount : 0,
										).toFixed(2)}
									</td>
								</tr>

								<tr className="room-price__row grand-total">
									<td>Grand Total</td>
									<td>
										NRS. {parseFloat(bookingData.totRoomPrice).toFixed(2)}
									</td>
								</tr>
							</tbody>
						</table>
					</div>
					{/*End .utl-row*/}

					<div className="utl-row">
    						<div className="cancel-info">
							<h4>How much will it cost to cancel?</h4>
							<p>FREE cancellation until 11:59 PM on Sept 28</p>
						</div>
					</div>
				</div>
			)}
		</>
	);
};

export default BookingPaymentDetail;

