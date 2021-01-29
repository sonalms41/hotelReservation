import React, { useState, useContext } from "react";
import FacebookLogin from "react-facebook-login";
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
	const responseFacebook = (response) => {
		console.log("facebook-detail:", response);
		if (response.userID) {
			const postValue = {
				access_token: response.accessToken,
			};
			console.log("f-post-val:", postValue);
			services.POST.facebookLogin(postValue)
				.then((response) => {
					const { data } = response;
					console.log("facebook-post-response:", response);
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
				.catch((errors) => {});
		}
	};

	const componentClicked = () => {};
	if (!loginForBooking && loginSuccess) {
		return <Redirect to="/userProfile/dashboard" />;
	}
	return (
		<>
			<FacebookLogin
				textButton="Login With Facebook"
				cssClass="facebook-login"
				appId={appId}
				autoLoad={false}
				fields="name,email,picture"
				onClick={componentClicked}
				callback={responseFacebook}
			/>
		</>
	);
};

export default Facebooklogin;
