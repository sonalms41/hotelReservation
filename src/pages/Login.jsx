import React, { useState, useEffect, useRef, useContext } from "react";
import { Link, Redirect } from "react-router-dom";
import {
	isPossiblePhoneNumber,
	isValidPhoneNumber,
	parsePhoneNumber,
} from "react-phone-number-input";
// Components
import CustomLoader from "../components/CustomLoader";
import Googlelogin from "./../components/userLogin/GoogleLogin";
import Facebooklogin, {
	initFacebookSdk,
} from "../components/userLogin/FacebookLogin";
import PhoneNumberInput from "../components/PhoneNumberInput";
import { UserContext } from "../HOC/Context";
// Images
import imgBg from "./../assets/images/img-loginbg.jpg";
import logoHamroHotel from "./../assets/images/logo-hamroHotel.png";
import {
	COMPANY_INFO,
	toastNotification,
	USER_AUTH,
	LOCAL_STORAGE,
} from "../utilities";
import ProfileDashboard from "./userProfile/ProfileDashboard";
const Login = ({ loginForBooking, propertyId }) => {
	const { applyUserId } = useContext(UserContext);

	const [isLoading, setIsLoading] = useState(false);
	const [isLoggedIn, setLoggedIn] = useState(false);
	const [mobileNumber, setMobileNumber] = useState("");
	const [OTP, setOTP] = useState("");
	const [OTP2, setOTP2] = useState("");
	const [OTP3, setOTP3] = useState("");
	const [OTP4, setOTP4] = useState("");
	const [OTP5, setOTP5] = useState("");
	const [userExist, setUserExist] = useState(false);
	const [newUser, setNewUser] = useState(false);

	useEffect(() => {
		document.title = "Login";
	});

	const otp2 = useRef();
	const otp3 = useRef();
	const otp4 = useRef();
	const otp5 = useRef();
	const confirmBtn = useRef();

	const otpInput = (e, i) => {
		if (i === 1) {
			setOTP(e.target.value);
			otp2.current.focus();
		}
		if (i === 2) {
			setOTP2(e.target.value);
			otp3.current.focus();
		}
		if (i === 3) {
			setOTP3(e.target.value);
			otp4.current.focus();
		}
		if (i === 4) {
			setOTP4(e.target.value);
			otp5.current.focus();
		}
		if (i === 5) {
			setOTP5(e.target.value);
			confirmBtn.current.focus();
		}
	};

	const handleLogin = () => {
		const possiblePhNo = isPossiblePhoneNumber(mobileNumber);
		const validatePnNo = isValidPhoneNumber(mobileNumber);

		if (possiblePhNo && validatePnNo) {
			//localStorage.setItem("u_ph", mobileNumber);
			LOCAL_STORAGE.setItem("u_ph", mobileNumber);
			const fetchData = async () => {
				setIsLoading(true);
				await fetch(`${process.env.REACT_APP_API_BASE_URL}/client/phone-otp/`, {
					method: "post",
					headers: {
						"Content-Type": "application/json",
					},
					body: JSON.stringify({
						phone_number: mobileNumber,
					}),
				})
					.then((res) => res.json())
					.then((data) => {
						if (data.status_code === 200) {
							toastNotification.info(data.message);
							setLoggedIn(true);
							setIsLoading(false);
						}

						if (data.status_code === 300) {
							USER_AUTH.setUserId(data.user_id);
							USER_AUTH.setToken(data.token);
							setUserExist(true);
						}
					})
					.catch((error) => console.error(error));
			};
			fetchData();
		} else {
			toastNotification.warn("Please enter correct Phone number!");
		}
	};

	const handleConfirm = () => {
		const OTPCode = OTP.concat(OTP2, OTP3, OTP4, OTP5);
		const fetchData = async () => {
			setIsLoading(true);
			await fetch(
				`${process.env.REACT_APP_API_BASE_URL}/client/phone-validate/`,
				{
					method: "post",
					headers: {
						"Content-Type": "application/json",
					},
					body: JSON.stringify({
						phone_number: mobileNumber,
						code_number: OTPCode,
					}),
				},
			)
				.then((res) => res.json())
				.then((data) => {
					if (data.status_code === 200) {
						USER_AUTH.setToken(data.token);
						USER_AUTH.setUserId(data.user_id);
						if (data.user_exists) {
							applyUserId(data.user_id);
							setUserExist(true);
						} else setNewUser(true);
						setIsLoading(false);
						toastNotification.success(data.message);
					}
					if (data.status_code === 400) {
						toastNotification.warn(`${data.message}, Please try again!`);
						setOTP("");
						setOTP2("");
						setOTP3("");
						setOTP4("");
						setOTP5("");
						otpInput();
					}
					setIsLoading(false);
				})
				.catch((error) => console.error(error));
		};
		fetchData();
	};

	const formWrapper = !isLoggedIn ? (
		<div className="login">
			<p className="login__title">Login</p>
			<div className="login__form">
				<PhoneNumberInput
					onChange={(e) => setMobileNumber(e)}
					defaultCountry="NP"
				/>{" "}
				<div
					type="button"
					className="login__submit"
					onClick={handleLogin}
				></div>
			</div>
			<div className="login__seperator">
				<span>or</span>
			</div>
			<div className="login__social-media">
				<Googlelogin
					loginForBooking={loginForBooking}
					propertyId={propertyId}
				/>
				{/*<button onClick={handleFacebookLogin}>Facebook Login</button>*/}
				<Facebooklogin
					loginForBooking={loginForBooking}
					propertyId={propertyId}
				/>
			</div>
			<p className="signup">I'll Signup Later</p>
		</div>
	) : (
		<>
			<p className="otp__title">Confirmation</p>
			<p className="otp__number">{mobileNumber}</p>
			<p className="otp__msg">
				Please enter the verification code you received via SMS.
			</p>
			<div className="otp__input">
				<input
					type="text"
					maxLength={1}
					className="otp__code"
					onChange={(e) => otpInput(e, 1)}
				/>
				<input
					type="text"
					maxLength={1}
					ref={otp2}
					className="otp__code"
					onChange={(e) => otpInput(e, 2)}
				/>
				<input
					type="text"
					maxLength={1}
					ref={otp3}
					className="otp__code"
					onChange={(e) => otpInput(e, 3)}
				/>
				<input
					type="text"
					maxLength={1}
					ref={otp4}
					className="otp__code"
					onChange={(e) => otpInput(e, 4)}
				/>
				<input
					type="text"
					maxLength={1}
					ref={otp5}
					className="otp__code"
					onChange={(e) => otpInput(e, 5)}
				/>
			</div>
			<p className="otp__resend">
				Didn't receive the code{" "}
				<strong onClick={handleLogin}>Resend Code</strong>
			</p>
			<button ref={confirmBtn} className="otp__confirm" onClick={handleConfirm}>
				Confirm
			</button>
		</>
	);

	if (!loginForBooking && userExist) return <Redirect to={"/"} />;
	else if (!loginForBooking && newUser)
		return <Redirect to={"./userProfile/dashboard"} />;
	return (
		<>
			{!loginForBooking && <CustomLoader isLoading={isLoading} />}
			{!newUser && (
				<div
					className="row login__wrapper"
					//style={{
					//	backgroundImage: `${`url(${imgBg})`}`,
					//	minHeight: !loginForBooking ? "100vh" : "auto",
					//}}
				>
					<div className={`login-content ${loginForBooking && "border-r-sm"}`}>
						<div
							className={`login__ui ${loginForBooking && "login__ui-booking"}`}
						>
							{!loginForBooking && (
								<div className="logo">
									<Link to="/">
										<img src={logoHamroHotel} alt="Logo" />
									</Link>
								</div>
							)}
							{formWrapper}
						</div>
						{!loginForBooking && (
							<div className="login__footer">
								<p>
									©{new Date().getFullYear()} {COMPANY_INFO.name}, All Rights
									Reserved
								</p>
							</div>
						)}
					</div>
				</div>
			)}
			{loginForBooking && newUser && (
				<ProfileDashboard
					registerForBooking={true}
					className="short-register"
				/>
			)}
		</>
	);
};

export default Login;
