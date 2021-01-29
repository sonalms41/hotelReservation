/**********************************************
 * Find out the current latitude and longitude
 **********************************************/
export const currentLocation = {
	latitude: navigator.geolocation.getCurrentPosition((position) => {
		return position.coords.latitude;
	}),

	longitude: navigator.geolocation.getCurrentPosition((position) => {
		return position.coords.longitude;
	}),
};
