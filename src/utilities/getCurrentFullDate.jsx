import React from "react";
import moment from "moment";

export const getCurrentFullDate = () => {
	var today = new Date();
	var date =
		today.getFullYear() + "/" + (today.getMonth() + 1) + "/" + today.getDate();
	return moment(date);
};
