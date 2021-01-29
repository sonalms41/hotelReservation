import React from "react";

const ConfirmationModal = (props) => {
	const { onClickYes, onClickNo, message, className, position } = props;

	return (
		<>
			<div
				className={`admin-confirmation-dialog ${className}`}
				style={{
					top: `${position === "bottom" ? "110%" : ""}`,
					bottom: `${position === "top" ? "110%" : ""}`,
				}}
			>
				<div className="confirmation-dialog-message">
					<p>{message}</p>
				</div>
				<div className="confirmation-action-btns">
					<button
						className="confirmation-action-yes"
						onClick={onClickYes}
						type="button"
					>
						Yes
					</button>
					<button
						className="confirmation-action-no"
						onClick={onClickNo}
						type="button"
					>
						No
					</button>
				</div>
			</div>
		</>
	);
};

export default ConfirmationModal;
