import React from "react";
import PageLayout from "../../HOC/PageLayout";

const IMEpayCancelPage = () => {
	return (
		<>
			<PageLayout innerPage={true}>
				<div className="container">
					<div className="payment-status-page payment-status-page--cancelled">
						Your Payment Process Has been Cancelled
					</div>
				</div>
			</PageLayout>
		</>
	);
};

export default IMEpayCancelPage;
