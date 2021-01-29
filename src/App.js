import React from "react";
import { BrowserRouter as Router, Switch, Route } from "react-router-dom";

// ROUTES
import PrivateRoute from "./route/PrivateRoute";
import PublicRoute from "./route/PublicRoute";

// PAGES
import LandingPage from "./pages/LandingPage";
import Search from "./pages/search";
import PropertyDetail from "./pages/propertyDetails";
import BookingEntry from "./pages/BookingEntry";
import BookingConfirm from "./pages/BookingConfirm";
import BookingConfirmationDetail from "./pages/BookingConfirmationDetail";
import BookingCancelledDetail from "./pages/BookingCancelledDetail";
import Login from "./pages/Login";

import EsewaPaymentFailPage from "./components/paymentGateway/EsewaPaymentFailPage";
import EsewaPaymentSuccessPage from "./components/paymentGateway/EsewaPaymentSuccessPage";
import PageNotFound from "./pages/PageNotFound";

// COMPONENTS
import ScrollToTop from "./components/ScrollToTop";
import UserProfileRoute from "./pages/userProfile/UserProfileRoute";
import Context from "./HOC/Context";
import IMEpayResponse from "./components/paymentGateway/IMEpayResponse";
import IMEpayCancel from "./components/paymentGateway/IMEpayCancel";
function App() {
	return (
		<>
			<Context>
				<Router>
					<ScrollToTop />
					<Switch>
						<Route exact path={"/"} component={LandingPage} />
						<Route path={"/login"} component={Login} />
						<PrivateRoute path="/userProfile" component={ UserProfileRoute } />
						<Route
							path="/search"
							component={Search}
						/>
						<Route
							path={
								"/propertyDetail/:id"
							}
							component={PropertyDetail}
							exact
						/>

						<Route path={"/bookingEntry/:id"} component={BookingEntry} exact />
						<Route
							path={"/bookingConfirmationDetail"}
							component={BookingConfirmationDetail}
						/>
						<Route
							path={"/bookingCancelledDetail"}
							component={BookingCancelledDetail}
						/>
						<Route path={ "/bookingConfirm" } component={ BookingConfirm } />
						
						<Route path={"/payWithEsewaSuccess"} component={EsewaPaymentSuccessPage} />
						<Route path={ "/payWithEsewaFail" } component={ EsewaPaymentFailPage } />

						<Route path={"/payWithIMEpayResponse"} component={IMEpayResponse} />
						<Route path={ "/payWithIMEpayCancel" } component={IMEpayCancel } />
						
						<Route path={"/aboutUs"} component={PageNotFound} />
						<Route path={"/contactUs"} component={PageNotFound} />
						<Route path={"/termsAndCondition"} component={PageNotFound} />
					</Switch>
				</Router>
			</Context>
		</>
	);
}

export default React.memo(App);
