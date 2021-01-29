import React, { useRef } from "react";
import { useReactToPrint } from "react-to-print";
import ConfirmationLandingPage from "./ConfirmationLandingPage";

const PrintComponent = () => {
	const componentRef = useRef();
	const handlePrint = useReactToPrint({
		content: () => componentRef.current,
	});

	return (
		<div>
			<ConfirmationLandingPage ref={componentRef} />
			<button onClick={handlePrint}>Print this out!</button>
		</div>
	);
};

export default PrintComponent;
