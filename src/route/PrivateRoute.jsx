import React from "react";
import { Route, Redirect } from "react-router-dom";
import { USER_AUTH } from "../utilities";

const PrivateRoute = ({ component: Component, ...rest }) => {
	return (
		<Route
			{...rest}
			component={(props) =>
				USER_AUTH.getUserID() && USER_AUTH.getToken() ? (
					<>
						<Component {...props} />
					</>
				) : (
					<Redirect to="/" />
				)
			}
		/>
	);
};

export default PrivateRoute;
