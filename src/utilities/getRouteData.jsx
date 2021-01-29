import { useParams } from "react-router-dom";

// GET: Get data coming-through URL

export const ROUTE_DATA = {
	getPropertyId: function () {
		return useParams().id;
	},
};
