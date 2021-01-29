// Import FirebaseAuth and firebase.
import React, { useState, useContext } from "react";
import { Redirect } from "react-router-dom";
import { GoogleLogin } from "react-google-login";

// Components
import { toastNotification, USER_AUTH } from "../../utilities";
import { GmailLoginContext } from "../../HOC/Context";
import services from "../../services";

const Googlelogin = (props) => {
	const { handleGmailLoginSuccess } = useContext(GmailLoginContext);
	const { loginForBooking, propertyId } = props;
	const [loginSuccess, setLoginSuccess] = useState(false);
	const responseGoogle = (response) => {
		if (response) {
			const gToke = response.tokenId;
			const postVal = {
				token: gToke,
			};
			services.POST.googleAuth(postVal).then((response) => {
				const data = response.data;
				if (data.status_code === 200) {
					USER_AUTH.setUserId(data.user_id);
					USER_AUTH.setToken(data.token);
					toastNotification.success("Login success!");
					if (loginForBooking) {
						handleGmailLoginSuccess();
					}
					setLoginSuccess(true);
				}
			});
		}
	};
	if (!loginForBooking && loginSuccess) {
		return <Redirect to="/userProfile/dashboard" />;
	}
	if (loginForBooking && loginSuccess) {
		return <Redirect to={`/bookingEntry/${propertyId}`} />;
	}
	return (
		<>
			<GoogleLogin
				clientId="49203847990-ks6746oc1li7430ie7ejq5q2uvn75vjc.apps.googleusercontent.com"
				buttonText="Login with Google"
				onSuccess={responseGoogle}
				onFailure={responseGoogle}
				cookiePolicy={"single_host_origin"}
			/>
		</>
	);
};

export default React.memo(Googlelogin);
