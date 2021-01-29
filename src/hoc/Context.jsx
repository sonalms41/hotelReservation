import React, { useState } from "react";
export const UserContext = React.createContext();
export const PropertyContext = React.createContext();
export const FilterPropertyContext = React.createContext();
export const PaymentStatusContext = React.createContext();
export const CancelReasonContext = React.createContext();
export const EsewaSubmitContext = React.createContext();
export const PayWithKhaltiContext = React.createContext();
export const SelectDestinationContext = React.createContext();
export const GmailLoginContext = React.createContext();
export const FacebookLoginContext = React.createContext();

const Context = (props) => {
	const [userIdFromContext, setUserIdFromContext] = useState(null);
	const [paymentStatus, setPaymentStatus] = useState(false);
	const [cancelReason, setCancelReason] = useState("");
	const [submitEsewa, setSubmitEsewa] = useState(false);
	const [payWithKhaltiSuccess, setPayWithKhaltiSuccess] = useState(false);
	const [selectedDestLabel, setSelectedDestLabel] = useState(null);
	const [selectedDestValue, setSelectedDestValue] = useState(null);
	const [gmailLoggedIn, setGmailLoggedIn] = useState(false);
	const [facebookLoggedIn, setFacebookLoggedIn] = useState(false);
	const applyUserId = (id) => {
		setUserIdFromContext(id);
	};
	const [propertyDetailContext, setpropertyDetailContext] = useState(null);
	const [filteredProperty, setFilteredProperty] = useState([]);
	const handleFiltereProperty = (properties) => {
		setFilteredProperty(properties);
	};
	const handlePropertyDetailContext = (property) => {
		setpropertyDetailContext(property);
	};
	const handleSetPaymentStatus = () => {
		setPaymentStatus(true);
	};

	// CANCEL-REASON
	const handleCancelReasonContext = (reason) => {
		setCancelReason(reason);
	};

	// E-SEWA
	const handleSubmitEsewa = () => {
		setSubmitEsewa(true);
	};

	// PAY WITH KHALTI
	const handleSetPayWithKhaltiStatus = () => {
		setPayWithKhaltiSuccess(true);
	};

	// CUSTOM-SELECT
	const handleChangeSelectDestination = (label, value) => {
		setSelectedDestLabel(label);
		setSelectedDestValue(value);
	};

	//GMAIL-LOGIN
	const handleGmailLoginSuccess = () => {
		setGmailLoggedIn(true);
	};

	// FACEBOOK-LOGIN
	const handleFacebookLoginSuccess = () => {
		setFacebookLoggedIn(true);
	};

	return (
		<>
			<UserContext.Provider value={{ applyUserId, userIdFromContext }}>
				<PropertyContext.Provider
					value={{ handlePropertyDetailContext, propertyDetailContext }}
				>
					<FilterPropertyContext.Provider
						value={{ filteredProperty, handleFiltereProperty }}
					>
						<PaymentStatusContext.Provider
							value={{ handleSetPaymentStatus, paymentStatus }}
						>
							<CancelReasonContext.Provider
								value={{ handleCancelReasonContext, cancelReason }}
							>
								<EsewaSubmitContext.Provider
									value={{ handleSubmitEsewa, submitEsewa }}
								>
									<PayWithKhaltiContext.Provider
										value={{
											handleSetPayWithKhaltiStatus,
											payWithKhaltiSuccess,
										}}
									>
										<SelectDestinationContext.Provider
											value={{
												handleChangeSelectDestination,
												selectedDestLabel,
												selectedDestValue,
											}}
										>
											<GmailLoginContext.Provider
												value={{
													handleGmailLoginSuccess,
													gmailLoggedIn,
												}}
											>
												<FacebookLoginContext.Provider
													value={{
														handleFacebookLoginSuccess,
														facebookLoggedIn,
													}}
												>
													{props.children}
												</FacebookLoginContext.Provider>
											</GmailLoginContext.Provider>
										</SelectDestinationContext.Provider>
									</PayWithKhaltiContext.Provider>
								</EsewaSubmitContext.Provider>
							</CancelReasonContext.Provider>
						</PaymentStatusContext.Provider>
					</FilterPropertyContext.Provider>
				</PropertyContext.Provider>
			</UserContext.Provider>
		</>
	);
};

export default Context;
