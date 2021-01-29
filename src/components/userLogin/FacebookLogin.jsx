import React, { useState, useContext } from "react";
import { Redirect } from "react-router-dom";
import { FacebookLoginContext } from "../../HOC/Context";
import services from "../../services";
import { toastNotification, USER_AUTH } from "../../utilities";
const Facebooklogin = ({ loginForBooking }) => {
	const [loginSuccess, setLoginSuccess] = useState(false);
	const { handleFacebookLoginSuccess } = useContext(FacebookLoginContext);
	/******************************************************************
	  FACEBOOK-PAGE:  https://www.facebook.com/connectingnepal2020
	  APP-NAME: Hamro Hotel
	  APP-ID: "215699503332848"
	*******************************************************************/

	const appId = "215699503332848";
	const handleFacebookLogin = () => {
		window.FB.login(function (response) {
			const authResponse = response.authResponse;
			const { accessToken, userID, graphDomain } = authResponse;

			if (userID) {
				const postValue = {
					access_token: accessToken,
				};
				services.POST.facebookLogin(postValue)
					.then((response) => {
						const { data } = response;
						if (data.status_code === 200) {
							USER_AUTH.setUserId(data.user_id);
							USER_AUTH.setToken(data.token);
							toastNotification.success("Login success!");
							if (loginForBooking) {
								handleFacebookLoginSuccess();
							}
							setLoginSuccess(true);
						}
					})
					.catch((errors) => {
						console.error(errors);
					});
			}
		});
	};

	if (!loginForBooking && loginSuccess) {
		return <Redirect to="/userProfile/dashboard" />;
	}
	return (
		<>
			<button onClick={handleFacebookLogin} className="facebook-login metro">
				Login With Facebook
			</button>
		</>
	);
};

export default Facebooklogin;
