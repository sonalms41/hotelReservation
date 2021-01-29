import React from "react";
import PageLayout from "../../HOC/PageLayout";

const EsewaPaymentFailPage = () => {
	return (
		<>
			<PageLayout innerPage={true}>
				<div className="container">
					<div className="payment-status-page payment-status-page--fail">
						Pay with eSewa Fail, please try again !!
					</div>
				</div>
			</PageLayout>
		</>
	);
};

export default EsewaPaymentFailPage;
