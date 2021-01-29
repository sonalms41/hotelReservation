import React from "react";
import { Switch, Route } from "react-router-dom";
import UserProfile from ".";
import MyBooking from "./MyBooking";
import MyReview from "./MyReview";
import SavedHotel from "./SavedHotel";
import ProfileSetting from "./ProfileSetting";

const UserProfileRoute = () => {
	return (
		<Route>
			<Switch>
				<Route path="/userProfile/dashboard" component={UserProfile} exact />
				<Route path="/userProfile/booking" component={MyBooking} exact />
				<Route path="/userProfile/setting" component={ProfileSetting} exact />
				<Route path="/userProfile/savedHotel" component={SavedHotel} exact />
				<Route path="/userProfile/review" component={MyReview} exact />
			</Switch>
		</Route>
	);
};

export default UserProfileRoute;
