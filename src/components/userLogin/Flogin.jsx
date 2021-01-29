import React, { useEffect } from "react";

const Flogin = () => {
	let FB = window.FB;
	const FB_APP_ID = "215699503332848";
	const loadFbLoginApi = () => {
		window.fbAsyncInit = function () {
			FB.init({
				appId: "215699503332848",
				cookie: true, // enable cookies to allow the server to access
				// the session
				xfbml: true, // parse social plugins on this page
				version: "v2.5", // use version 2.1
			});
		};

		console.log("Loading fb api");
		// Load the SDK asynchronously
		(function (d, s, id) {
			var js,
				fjs = d.getElementsByTagName(s)[0];
			if (d.getElementById(id)) return;
			js = d.createElement(s);
			js.id = id;
			js.src = "//connect.facebook.net/en_US/sdk.js";
			fjs.parentNode.insertBefore(js, fjs);
		})(document, "script", "facebook-jssdk");
	};

	useEffect(() => {
		loadFbLoginApi();
	}, []);

	function testAPI() {
		console.log("Welcome!  Fetching your information.... ");
		FB.api("/me", function (response) {
			console.log("Successful login for: " + response.name);
			document.getElementById("status").innerHTML =
				"Thanks for logging in, " + response.name + "!";
		});
	}

	function statusChangeCallback(response) {
		console.log("statusChangeCallback");
		console.log(response);
		if (response.status === "connected") {
			testAPI();
		} else if (response.status === "not_authorized") {
			console.log("Please log into this app.");
		} else {
			console.log("Please log into this facebook.");
		}
	}

	function checkLoginState() {
		FB.getLoginStatus(
			function (response) {
				statusChangeCallback(response);
			}.bind(this),
		);
	}

	function handleFBLogin() {
		FB.login(checkLoginState());
	}

	return (
		<div>
			<button
				classNames="btn-facebook"
				id="btn-social-login"
				onClick={handleFBLogin}
			>
				<span className="fa fa-facebook"></span> Sign in with Facebook
			</button>
		</div>
	);
};

export default Flogin;
