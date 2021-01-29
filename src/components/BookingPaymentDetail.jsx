import React, { useState, useEffect } from "react";
import defaultImg from "./../assets/images/image-default.png";
import { v4 as uuidv4 } from "uuid";

const BookingPaymentDetail = ({ bookingData }) => {
	const [roomsGroupe, setRoomsGroupe] = useState(null);
	const [totalPriceAfterVat, setTotalPriceAfterVat] = useState(null);
	const [totalPriceBeforeVat, setTotalPriceBeforeVat] = useState(null);

	useEffect(() => {
		if (bookingData) {
			const { roomConfig } = bookingData;
			if (roomConfig) {
				var arrSameRooms = roomConfig.reduce((a, b) => {
					var itemIndex = a.findIndex(
						(item) => item.sub_room_type === b.sub_room_type,
					);

					return (
						itemIndex === -1
							? a.push({
									sub_room_type: b.sub_room_type,
									nRooms: 1,
									pricePerRoomBeforeVat: b.price_without_vat,
							  })
							: a[itemIndex].nRooms++,
						a
					);
				}, []);

				setRoomsGroupe(arrSameRooms);
				let totalPriceBeforeVat = 0;
				let totalPriceAfterVat = 0;

				for (let i = 0; i < roomConfig.length; i++) {
					totalPriceBeforeVat =
						totalPriceBeforeVat + roomConfig[i].price_without_vat;
					totalPriceAfterVat = totalPriceAfterVat + roomConfig[i].roomPrice;
				}
				setTotalPriceAfterVat(totalPriceAfterVat);
				setTotalPriceBeforeVat(totalPriceBeforeVat);
			}
		}
	}, [bookingData]);
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
								</span>
							</div>
						</div>

						<table className="room-price">
							<tbody>
								{roomsGroupe &&
									roomsGroupe.map((room, i) => {
										return (
											<tr className="room-price__row" key={uuidv4()}>
												<td className="">
													<strong className="room-type">
														{room.sub_room_type}
													</strong>
													<span>{parseInt(room.nRooms)} Room,</span>
												</td>
												<td className="room-price text-right">
													NRS. {room.pricePerRoomBeforeVat * room.nRooms}
												</td>
											</tr>
										);
									})}

								<tr className="room-price__row total">
									<td>Total</td>
									{totalPriceBeforeVat && (
										<td>NRS. {parseFloat(totalPriceBeforeVat).toFixed(2)}</td>
									)}
								</tr>
								<tr className="room-price__row vat">
									<td>{bookingData.vat}% VAT</td>

									{totalPriceAfterVat && (
										<td>
											{parseFloat((totalPriceAfterVat * 13) / 100).toFixed(2)}
										</td>
									)}
								</tr>

								<tr className="room-price__row grand-total">
									<td>Grand Total</td>
									{totalPriceAfterVat && (
										<td>NRS. {parseFloat(totalPriceAfterVat).toFixed(2)}</td>
									)}
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
