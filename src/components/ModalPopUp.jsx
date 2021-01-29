import React, { useRef } from "react";
import ConfirmationModal from "./ConfirmationModal";

const ModalPopUp = (props) => {
	const {
		closeModal,
		visibleModal,
		className,
		closeButtonText,

		showCancelConfirmationModal,
		yesToCancel,
		noToCancel,
		cancelConfirmationModalPosition,
		cancelConfirmMessage,
	} = props;
	const componentRef = useRef();
	return (
		<>
			{visibleModal && (
				<div className={`modal-popup ${className ? className : ""}`}>
					<div className="modal-container">
						{/*<div className={`modal-container ${className ? className : ""}`}>*/}
						<span
							className="modal-popup__close flex-aC-jC"
							style={{
								width: closeButtonText ? "auto" : "3rem",
								fontWeight: closeButtonText ? "normal" : "700",
								fontSize: closeButtonText ? "1.7rem" : "2rem",
							}}
						>
							<span onClick={closeModal}>
								{closeButtonText ? closeButtonText : "X"}
							</span>
							{showCancelConfirmationModal && (
								<ConfirmationModal
									onClickYes={yesToCancel}
									onClickNo={noToCancel}
									message={cancelConfirmMessage}
									position={cancelConfirmationModalPosition}
									className="cancel-bookingprocess"
								/>
							)}
						</span>
						<div className="modal-popup__body">{props.children}</div>
					</div>
				</div>
			)}
		</>
	);
};

export default ModalPopUp;
