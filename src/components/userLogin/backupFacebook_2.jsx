import React, { useEffect } from "react";

const FacebookLogin = () => {
	//useEffect(() => {
	//	window.fbAsyncInit = function () {
	//		window.FB.init({
	//			appId: "215699503332848",
	//			cookie: true,
	//			xfbml: true,
	//			version: "v9.0",
	//		});

	//		window.FB.AppEvents.logPageView();
	//	};
	//}, []);
	const checkLoginState = () => {
		console.log(window.FB.getLoginStatus());
		//console.log("hi thre");
		//console.log(window.FB.getLoginStatus());

		window.FB.getLoginStatus(function (response) {
			console.log("facebook-response:", response);
			statusChangeCallback(response);
		});
	};
	function statusChangeCallback(response) {
		console.log("facebook-response:", response);
	}
	return (
		<div>
			<button onClick={checkLoginState}>Facebok Login</button>

			{/*<div
				class="fb-login-button"
				data-size="large"
				//data-button-type="continue_with"
				//data-layout="default"
				//data-auto-logout-link="false"
				//data-use-continue-as="false"
				data-width=""
				scope="public_profile,email"
				onlogin={checkLoginState}
			></div>*/}
		</div>
	);
};

export default FacebookLogin;
