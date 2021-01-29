import React, { useState, useContext } from "react";
import { FormFieldCheckbox, FormFieldTextarea } from "./FormFields";
import { Modal } from "@material-ui/core";

// Images
import iconCancelBlack from "./../assets/images/icon-cancelBlack.png";
import { CancelReasonContext } from "../HOC/Context";

const BookingCancelReason = ({ closeModal, showModal, cancelBooking }) => {
	const { handleCancelReasonContext } = useContext(CancelReasonContext);
	const [cancelReasonId, setCancelReasonId] = useState(null);
	const [otherReason, setOtherReason] = useState(false);

	const handleCancelReason = (e, id) => {
		if (id === "otherReason") {
			setOtherReason(true);
			setCancelReasonId(id);
			handleCancelReasonContext("");
		} else {
			setOtherReason(false);
			const cancelReason = e.target.value;
			const checkedStatus = e.target.checked;
			if (checkedStatus === true) {
				handleCancelReasonContext(cancelReason);
				setCancelReasonId(id);
			}
			//if (checkedStatus === false) {
			//	setCancelReason("");
			//	setCancelReasonId(null);
			//	handleCancelReasonContext("");
			//}
		}
	};
	return (
		<>
			<Modal open={showModal} className="os-modal-primary">
				<div className="confirm confirm-cancel-booking">
					<h3 className="flex-aC-jSB">
						Cancel Booking{" "}
						<span className="btn-close-modal" onClick={closeModal}>
							<img src={iconCancelBlack} alt="Cancel booking" />
						</span>
					</h3>
					<FormFieldCheckbox
						label="Change in Plan"
						value="Change in Plan"
						id="booking-cancel-reason-1"
						onChange={(e) => handleCancelReason(e, "reason1")}
						checked={cancelReasonId === "reason1"}
					/>
					<FormFieldCheckbox
						label="Found a Better Deal"
						value="Found a Better Deal"
						id="booking-cancel-reason-2"
						onChange={(e) => handleCancelReason(e, "reason2")}
						checked={cancelReasonId === "reason2"}
					/>
					<FormFieldCheckbox
						label="Want to Book a Different Hotel
					"
						value="Want to Book a Different Hotel
					"
						id="booking-cancel-reason-3"
						onChange={(e) => handleCancelReason(e, "reason3")}
						checked={cancelReasonId === "reason3"}
					/>
					<FormFieldCheckbox
						label="Booking Created by Mistake
					"
						value="Booking Created by Mistake
					"
						id="booking-cancel-reason-4"
						onChange={(e) => handleCancelReason(e, "reason4")}
						checked={cancelReasonId === "reason4"}
					/>
					<FormFieldCheckbox
						label="Other Reason	"
						value="Other Reason	"
						id="booking-cancel-reason-5"
						onChange={(e) => handleCancelReason(e, "otherReason")}
						checked={cancelReasonId === "otherReason"}
					/>
					{otherReason && (
						<FormFieldTextarea
							id="booking-cancel-other"
							placeholder="Other reason"
							onChange={(e) => handleCancelReasonContext(e.target.value)}
						/>
					)}
					<div className="btn-cancel-confirm">
						<button
							className="utl-btn  utl-btn-confirm-cancel"
							onClick={cancelBooking}
						>
							Cancel Booking
						</button>
					</div>
				</div>
			</Modal>
		</>
	);
};

export default BookingCancelReason;
