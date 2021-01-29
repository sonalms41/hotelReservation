// Packages
import React, { useState, useEffect, Fragment, useContext } from "react";
import { Formik, Form, Field, ErrorMessage, useFormik } from "formik";
import * as Yup from "yup";
import { parsePhoneNumber } from "react-phone-number-input";

// Components
import CustomLoader from "./../../components/CustomLoader";
import services from "../../services";
import { toastNotification, USER_AUTH, LOCAL_STORAGE } from "../../utilities";
import PhoneNumberInput from "./../../components/PhoneNumberInput";

// Icon, Images
import iconFeatureUser from "./../../assets/images/icon-feature-user.svg";
import { UserContext } from "../../HOC/Context";

const ProfileDashboard = (props) => {
	const { applyUserId } = useContext(UserContext);
	const { className, registerForBooking } = props;
	const ref = React.createRef();
	// Pass the useFormik() hook initial form values and a submit function that will
	// be called when the form is submitted
	const formik = useFormik({
		initialValues: {
			phone: "",
		},
		onSubmit: (values) => {
			alert(JSON.stringify(values, null, 2));
		},
	});

	const user_id = USER_AUTH.getUserID();

	const [formData, setFormData] = useState(null);
	const [isLoading, setIsLoading] = useState(false);
	const [selectedFile, setSelectedFile] = useState();
	const [mobileNumber, setMobileNumber] = useState();
	const [countryCode, setCountryCode] = useState();
	const [phone, setPhone] = useState({
		country: "",
		number: "",
	});

	const getRegisterdUserDetail = (user_id) => {
		services.GET.registeredUser(user_id)
			.then((response) => {
				console.log("user-detail:", response);
				if (response.data.status_code === 200) {
					const data = response.data.result;
					setMobileNumber(data.user_phone_number);
					setFormData({
						first_name: data.user_first_name,
						last_name: data.user_last_name,
						gender: data.user_gender,
						address: data.user_address,
						city: data.user_city,
						phone_number: data.user_phone_number,
						email: data.user_email,
						business_traveller: data.user_traveller,
						display_full_name: data.user_display_name,
						display_phone_number: data.user_display_phone,
						display_email: data.user_display_email,
						display_city: data.user_display_city,
						display_country: data.user_display_country,
					});
				}
				setIsLoading(false);
			})
			.catch((errors) => {
				setIsLoading(false);
			});
	};

	useEffect(() => {
		const userPhNumber = LOCAL_STORAGE.getItem("u_ph");
		if (userPhNumber) {
			const country = parsePhoneNumber(userPhNumber).country;
			const number = parsePhoneNumber(userPhNumber).number;
			setPhone({
				country,
				number,
			});
		}
		if (user_id) {
			getRegisterdUserDetail(user_id);
		}
	}, []);

	// INITIAL VALUE
	const initialValues = {
		first_name: "",
		last_name: "",
		gender: "",
		address: "",
		city: "",
		phone_number: phone.number,
		email: "",

		business_traveller: "",
		display_full_name: "",
		display_phone_number: "",
		display_email: "",
		display_city: "",
		display_country: "",
	};
	const mailFormat = /[a-z0-9!#$%&'*+/=?^_`{|}~-]+(?:\.[a-z0-9!#$%&'*+/=?^_`{|}~-]+)*@(?:[a-z0-9](?:[a-z0-9-]*[a-z0-9])?\.)+[a-z0-9](?:[a-z0-9-]*[a-z0-9])?/;
	// Form-validation (Formik)
	const validationSchema = Yup.object({
		first_name: Yup.string().required("Required!"),
		last_name: Yup.string().required("Required!"),
		address: Yup.string().required("Required!"),
		//phone_number: Yup.number().required("Required").positive().integer(),
		email: Yup.string()
			.email("Invalid email format!")
			.required("Required!")
			.matches(mailFormat),
		gender: Yup.string().required("Required!"),
		city: Yup.string().required("Required!"),

		business_traveller: Yup.string(),
		display_full_name: Yup.string().nullable(),
		display_phone_number: Yup.number().positive().integer().nullable(),
		display_email: Yup.string().email("Invalid email format!").nullable(),
		display_city: Yup.string().nullable(),
		display_country: Yup.string().nullable(),
	});

	// SUBMIT-DATA
	const onSubmit = (values) => {
		setIsLoading(true);
		const phone_number = phone.number;
		const postValues = Object.assign(values, { phone_number });

		services.POST.clintRegistration(postValues)
			.then((response) => {
				const data = response.data;
				if (data.status_code === 200) {
					USER_AUTH.setUserId(data.user_id);
					USER_AUTH.setToken(data.token);
					applyUserId(data.user_id);
					getRegisterdUserDetail(data.user_id);
					toastNotification.success(`Profile ${data.message}`);
					setTimeout(() => {
						window.location.reload();
					}, 4000);
				}
				if (data.status_code === 400) {
					toastNotification.warn(data.message);
				}
				setIsLoading(false);
			})
			.catch((errors) => {
				toastNotification.error(`${errors}`);
				setIsLoading(false);
			});
	};

	const checkboxOptionsGender = [
		{
			key: "Male",
			value: "Male",
		},
		{
			key: "Female",
			value: "Female",
		},
	];

	return (
		<>
			<CustomLoader isLoading={isLoading} />
			<div className={`section-profile ${className ? className : ""}`}>
				<Formik
					initialValues={formData || initialValues}
					validationSchema={validationSchema}
					onSubmit={onSubmit}
					enableReinitialize
				>
					<Form className="utl-form profile-form">
						<div className="profile-row">
							{!registerForBooking && (
								<div className="profile-row-head">
									<h3>Your Connecting Reservation Account</h3>

									<p>
										These details are displayed next to your publicly shared
										reviews, ratings, photos, etc. Any updates you make here
										will also appear in past contributions.
									</p>
								</div>
							)}

							<div className="form-wrapper">
								{registerForBooking && (
									<h3 className="margin-b-20 font-s-20">
										Your Connecting Reservation Account
									</h3>
								)}
								<div
									className={`form__row flex-aC-jFS ${
										registerForBooking && "margin-b-no"
									}`}
								>
									{!registerForBooking && (
										<div className="col-profile-img flex-aC-jC">
											<img src={iconFeatureUser} alt="User" />
										</div>
									)}
									<div className="col-fields form-group-multiple">
										<div className="form-group ">
											<Field
												placeholder="First Name"
												id="first_name"
												type="text"
												name="first_name"
											/>
											<ErrorMessage name="first_name">
												{(errorMessage) => (
													<div className="required-notification">
														{errorMessage}
													</div>
												)}
											</ErrorMessage>
										</div>
										<div className="form-group ">
											<Field
												placeholder="Last Name"
												id="last_name"
												type="text"
												name="last_name"
											/>
											<ErrorMessage name="last_name">
												{(errorMessage) => (
													<div className="required-notification">
														{errorMessage}
													</div>
												)}
											</ErrorMessage>
										</div>
									</div>
								</div>
								{/*End form__row*/}{" "}
								<div className="form-group">
									<PhoneNumberInput
										onChange={(e) => {
											setPhone({ country: phone.country, number: e });
										}}
										defaultCountry="NP"
										value={`${phone.number}`}
										disabled={true}
									/>
								</div>
								<div className="form-group">
									<Field
										placeholder="Email address"
										id="email"
										type="text"
										name="email"
									/>
									<ErrorMessage name="email">
										{(errorMessage) => (
											<div className="required-notification">
												{errorMessage}
											</div>
										)}
									</ErrorMessage>
								</div>
								<div className="form-group-multiple form-group-radio flex-aC-jFS">
									<Field name="gender">
										{(props) => {
											const { field } = props;
											return checkboxOptionsGender.map((option, i) => {
												return (
													<Fragment key={`kls_${i}`}>
														<div className="form-group flex-aC-jFS width-auto">
															<input
																type="radio"
																id={option.value}
																{...field}
																value={option.value}
																checked={field.value === option.value}
															/>
															<label htmlFor={option.value}>{option.key}</label>

															<ErrorMessage name="gender">
																{(errorMessage) => (
																	<div className="required-notification">
																		{errorMessage}
																	</div>
																)}
															</ErrorMessage>
														</div>
													</Fragment>
												);
											});
										}}
									</Field>
								</div>
								<div className="form-group">
									<Field
										placeholder="Address"
										id="address"
										type="text"
										name="address"
									/>
									<ErrorMessage name="address">
										{(errorMessage) => (
											<div className="required-notification">
												{errorMessage}
											</div>
										)}
									</ErrorMessage>
								</div>
								<div className="form-group">
									<Field placeholder="City" id="city" type="text" name="city" />
									<ErrorMessage name="city">
										{(errorMessage) => (
											<div className="required-notification">
												{errorMessage}
											</div>
										)}
									</ErrorMessage>
								</div>
								<div className="form-group checkbox-sm flex-aC-jFS">
									<Field name="business_traveller">
										{(props) => {
											const { field } = props;
											//return checkboxOptionsBTraveller.map((option, i) => {
											return (
												<Fragment>
													<input
														type="checkbox"
														id="id_checkbox_BT"
														{...field}
														value={field.value ? field.values : false}
														checked={
															(field.value === "true") === ["true"] ||
															field.value === "True" ||
															field.value === true
																? true
																: false
														}
													/>
													<label
														htmlFor="id_checkbox_BT"
														className="label--tstatus"
													>
														Business traveller?
													</label>
												</Fragment>
											);
											//});
										}}
									</Field>
								</div>
								{registerForBooking && (
									<div className="form-group">
										<button
											className="utl-btn utl-btn-fifth width-lg"
											type="submit"
										>
											Save & Change
										</button>
									</div>
								)}
							</div>
						</div>

						{!registerForBooking && (
							<div className="profile-row">
								<div className="profile-row-head">
									<h3>For when you book</h3>
									<p>
										This information is only used to autofill your details and
										make it quicker for you to book. Your details will be stored
										securely and won't be shared publicly.
									</p>
								</div>
								<div className="form-wrapper">
									<div className="form-group">
										<Field
											placeholder="User Name "
											id="display_full_name"
											type="text"
											name="display_full_name"
										/>
										<ErrorMessage name="display_full_name">
											{(errorMessage) => (
												<div className="required-notification">
													{errorMessage}
												</div>
											)}
										</ErrorMessage>
									</div>

									<div className="form-group">
										<Field
											placeholder="email@gmail.com "
											id="display_email"
											type="text"
											name="display_email"
										/>
										<ErrorMessage name="display_email">
											{(errorMessage) => (
												<div className="required-notification">
													{errorMessage}
												</div>
											)}
										</ErrorMessage>
									</div>
									<div className="form-group">
										<Field
											placeholder="phone number"
											id="display_phone_number"
											type="text"
											name="display_phone_number"
										/>
										<ErrorMessage name="display_phone_number">
											{(errorMessage) => (
												<div className="required-notification">
													{errorMessage}
												</div>
											)}
										</ErrorMessage>
									</div>
									<div className="form-group">
										<Field
											placeholder="City"
											id="display_city"
											type="text"
											name="display_city"
										/>
										<ErrorMessage name="display_city">
											{(errorMessage) => (
												<div className="required-notification">
													{errorMessage}
												</div>
											)}
										</ErrorMessage>
									</div>
									<div className="form-group">
										<Field
											placeholder="Country"
											id="display_country"
											type="text"
											name="display_country"
										/>
										<ErrorMessage name="display_country">
											{(errorMessage) => (
												<div className="required-notification">
													{errorMessage}
												</div>
											)}
										</ErrorMessage>
									</div>

									<div className="form-group">
										<button className="utl-btn utl-btn-fifth" type="submit">
											Save & Change
										</button>
									</div>
								</div>
							</div>
						)}
					</Form>
				</Formik>
			</div>
		</>
	);
};

export default ProfileDashboard;
