import Axios from "axios";
import { USER_AUTH } from "../utilities";

// Base-URL
const baseUrl = process.env.REACT_APP_API_BASE_URL;
const urlSaveHotel = `${baseUrl}/client/saved-hotels/`;
const urlSearchSuggestion = `${baseUrl}/client/search-suggestion`;
const urlSearchFilter = `${baseUrl}/client/search-filter/`;
const urlSavedSubAminities = `${baseUrl}/super-admin/save-subaminities/`;
const urlPropertyType = `${baseUrl}/super-admin/property-type/`;
const urlTopDestinations = `${baseUrl}/client/top-destinations/`;
const urlPropertyRoomDetail = `${baseUrl}/client/property-detail/`;
const urlPropDetail = `${baseUrl}/client/prop-detail/`;
const urlClientRegistration = `${baseUrl}/client/registration/`;
const urlBookingEntryForm = `${baseUrl}/client/booking-form/`;
const urlBookingConfirm = `${baseUrl}/client/booking/`;
const urlCancelBooking = `${baseUrl}/client/guest-delete/`;

const urlUpcommingProperty = `${baseUrl}/client/property-upcomming/`;
const urlCancelledProperty = `${baseUrl}/client/property-deleted/`;
const urlCompletedProperty = `${baseUrl}/client/property-completed/`;

const urlPhoneToOTP = `${baseUrl}/client/phone-otp/`;
const urlCheckPhoneValidate = `${baseUrl}/client/phone-validate/`;
const urlGoogleAuth = `${baseUrl}/client/google-auth/`;

const urlBookingPending = `${baseUrl}/client/property-request/`;
const urlBookingDetail = `${baseUrl}/client/booking-detail/`;

const urlPostReview = `${baseUrl}/client/user-rating/`;
const urlGetAllReviews = `${baseUrl}/client/user-rating/`;
const urlMostViedHotels = `${baseUrl}/client/most-booked-hotel/`;

const urlPayWithKhalti = `${baseUrl}/client/khalti-payment/`;
const urlEsewaVerify = `${baseUrl}/client/esewa/`;
const urlPayWithEsewa = `${baseUrl}/client/esewa-payment/`;
const urlLoginFacebook = `${baseUrl}/client/oauth/login/`;

const urlIMEpayGetToken =
	"https://cors-anywhere.herokuapp.com/https://stg.imepay.com.np:7979/api/Web/GetToken";
const urlIMEpayConfirmationByIME =
	"https://cors-anywhere.herokuapp.com/https://stg.imepay.com.np:7979/api/Web/Recheck";
const urlIMEpayValidationByBackend = `https://cors-anywhere.herokuapp.com/${baseUrl}/client/ime-payment-validation/`;

const services = {
	GET: {
		fileExistsInServer: (fileUrl) => {
			return Axios.get(fileUrl, {
				headers: {
					"Content-Type": "application/json",

					Accept: "application/json",
				},
			});
		},

		mostViewedHotels: () => {
			return Axios.get(urlMostViedHotels, {
				headers: {
					"Content-Type": "application/json",
					Accept: "application/json",
				},
			});
		},
		searchSuggestion: (destination) => {
			return Axios.get(`${urlSearchSuggestion}/?city=${destination}`, {
				headers: {
					"Content-Type": "application/json",
					Accept: "application/json",
				},
			});
		},

		savedHotel: (userId) => {
			return Axios.get(`${urlSaveHotel}?user_id=${userId}`, {
				headers: {
					"Content-Type": "application/json",

					Accept: "application/json",
					Authorization: `Token ${USER_AUTH.getToken()}`,
				},
			});
		},
		propertyDetail: (propertyId) => {
			return Axios.get(`${urlPropDetail}?property_id=${propertyId}`);
		},

		bookingPending: (userId) => {
			return Axios.get(`${urlBookingPending}?user_id=${userId}`, {
				headers: {
					"Content-Type": "application/json",
					Accept: "application/json",
					Authorization: `Token ${USER_AUTH.getToken()}`,
				},
			});
		},
		topDestinations: () => {
			return Axios.get(urlTopDestinations, {
				headers: {
					"Content-Type": "application/json",
					Accept: "application/json",
				},
			});
		},
		registeredUser: (userId) => {
			return Axios.get(`${baseUrl}/client/registration/?user_id=${userId}`, {
				headers: {
					"Content-Type": "application/json",
					Accept: "application/json",
					Authorization: `Token ${USER_AUTH.getToken()}`,
				},
			});
		},

		upcommingProperty: (userId) => {
			return Axios.get(`${urlUpcommingProperty}?user_id=${userId}`, {
				headers: {
					"Content-Type": "application/json",
					Accept: "application/json",
					Authorization: `Token ${USER_AUTH.getToken()}`,
				},
			});
		},
		cancelledProperty: (userId) => {
			return Axios.get(`${urlCancelledProperty}?user_id=${userId}`, {
				headers: {
					"Content-Type": "application/json",
					Accept: "application/json",
					Authorization: `Token ${USER_AUTH.getToken()}`,
				},
			});
		},
		completedProperty: (userId) => {
			return Axios.get(`${urlCompletedProperty}?user_id=${userId}`, {
				headers: {
					"Content-Type": "application/json",
					Accept: "application/json",
					Authorization: `Token ${USER_AUTH.getToken()}`,
				},
			});
		},

		savedSubAmenities: () => {
			return Axios.get(urlSavedSubAminities, {
				headers: {
					"Content-Type": "application/json",
					Accept: "application/json",
				},
			});
		},
		propertyType: (userId) => {
			return Axios.get(urlPropertyType, {
				headers: {
					"Content-Type": "application/json",
					Accept: "application/json",
				},
			});
		},

		nearestHotels: (lat, long) => {
			return Axios.get(
				`${baseUrl}/client/for-you-hotels/?latitude=${lat}&longitude=${long}`,
				//`${baseUrl}/client/for-you-hotels/?latitude=27.7425&longitude=85.3343`,
				{
					headers: {
						"Content-Type": "application/json",
						Accept: "application/json",
					},
				},
			);
		},

		guestReviews: (userId) => {
			return Axios.get(`${urlGetAllReviews}?user_id=${userId}`, {
				headers: {
					"Content-Type": "application/json",
					Accept: "application/json",
					Authorization: `Token ${USER_AUTH.getToken()}`,
				},
			});
		},
	},
	POST: {
		saveHotel: (values) => {
			return Axios.post(urlSaveHotel, values, {
				headers: {
					"Content-Type": "application/json",
					Accept: "application/json",
					Authorization: `Token ${USER_AUTH.getToken()}`,
				},
			});
		},
		facebookLogin: (values) => {
			return Axios.post(urlLoginFacebook, values, {
				headers: {
					"Content-Type": "application/json",
					Accept: "application/json",
				},
			});
		},
		esewaVerify: (values) => {
			return Axios.post(urlEsewaVerify, values, {
				headers: {
					"Content-Type": "application/json",
					Accept: "application/json",
					Authorization: `Token ${USER_AUTH.getToken()}`,
				},
			});
		},
		esewaPay: (values) => {
			return Axios.post(urlPayWithEsewa, values, {
				headers: {
					"Content-Type": "application/json",
					Accept: "application/json",
					Authorization: `Token ${USER_AUTH.getToken()}`,
				},
			});
		},
		googleAuth: (values) => {
			return Axios.post(urlGoogleAuth, values, {
				headers: {
					"Content-Type": "application/json",
					Accept: "application/json",
				},
			});
		},
		phoneToOTP: (values) => {
			return Axios.post(urlPhoneToOTP, values, {
				headers: {
					"Content-Type": "application/json",
					Accept: "application/json",
				},
			});
		},
		validatePhone: (values) => {
			return Axios.post(urlCheckPhoneValidate, values, {
				headers: {
					"Content-Type": "application/json",
					Accept: "application/json",
				},
			});
		},
		searchFilter: (values) => {
			return Axios.post(urlSearchFilter, values, {
				headers: {
					"Content-Type": "application/json",
					Accept: "application/json",
				},
			});
		},
		propertyRoomDetail: (values) => {
			return Axios.post(urlPropertyRoomDetail, values, {
				headers: {
					"Content-Type": "application/json",
					Accept: "application/json",
				},
			});
		},
		clintRegistration: (values) => {
			return Axios.post(urlClientRegistration, values, {
				headers: {
					"Content-Type": "application/json",
					Accept: "application/json",
				},
			});
		},
		bookingEntryForm: (values) => {
			return Axios.post(urlBookingEntryForm, values, {
				headers: {
					"Content-Type": "application/json",
					Accept: "application/json",
					Authorization: `Token ${USER_AUTH.getToken()}`,
				},
			});
		},

		bookingConfirm: (values) => {
			return Axios.post(urlBookingConfirm, values, {
				headers: {
					"Content-Type": "application/json",
					Accept: "application/json",
					Authorization: `Token ${USER_AUTH.getToken()}`,
				},
			});
		},
		cancelBooking: (values) => {
			return Axios.post(urlCancelBooking, values, {
				headers: {
					"Content-Type": "application/json",
					Accept: "application/json",
					Authorization: `Token ${USER_AUTH.getToken()}`,
				},
			});
		},
		payWithKhalti: (values) => {
			return Axios.post(urlPayWithKhalti, values, {
				headers: {
					"Content-Type": "application/json",
					Accept: "application/json",
					Authorization: `Token ${USER_AUTH.getToken()}`,
				},
			});
		},

		bookingDetail: (values) => {
			return Axios.post(urlBookingDetail, values, {
				headers: {
					"Content-Type": "application/json",
					Accept: "application/json",
					Authorization: `Token ${USER_AUTH.getToken()}`,
				},
			});
		},
		guestReview: (values) => {
			return Axios.post(urlPostReview, values, {
				headers: {
					"Content-Type": "application/json",
					Accept: "application/json",
					Authorization: `Token ${USER_AUTH.getToken()}`,
				},
			});
		},
		IMEpayGetToken: (values) => {
			return Axios.post(urlIMEpayGetToken, values, {
				headers: {
					"Content-Type": "application/json",
					Authorization: "Basic aGFtcm9ob3RlbDppbWVAMTIzNA==",
					Module: "SEFNUk9IT1RM",
				},
			});
		},

		IMEpayConfirmationByIME: (values) => {
			return Axios.post(urlIMEpayConfirmationByIME, values, {
				headers: {
					"Content-Type": "application/json",
					Authorization: "Basic aGFtcm9ob3RlbDppbWVAMTIzNA==",
					Module: "SEFNUk9IT1RM",
				},
			});
		},
		IMEpayValidationByBackend: (values) => {
			return Axios.post(urlIMEpayValidationByBackend, values, {
				headers: {
					"Content-Type": "application/json",
					Authorization: "Basic aGFtcm9ob3RlbDppbWVAMTIzNA==",
					Module: "SEFNUk9IT1RM",
				},
			});
		},
	},

	DELETE: {
		roomView: (id) => {
			return Axios.delete(urlSaveHotel, {
				data: { id: id },
				headers: {
					"Content-Type": "application/json",
					Accept: "application/json",
				},
			});
		},
	},
	PUT: {
		occupancy: (values) => {
			return Axios.put(urlSaveHotel, values, {
				headers: {
					"Content-Type": "application/json",
					Accept: "application/json",
				},
			});
		},
	},
	PATCH: {
		propertyType: (values) => {
			return Axios.patch(urlSaveHotel, values, {
				headers: {
					"Content-Type": "application/json",
					Accept: "application/json",
				},
			});
		},
	},
};

export default services;
