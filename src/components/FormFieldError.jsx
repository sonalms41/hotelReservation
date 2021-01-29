import React from "react";

const FormFieldError = (props) => {
	const { message } = props;
	return <div className="required-notification">{message}</div>;
};

export default FormFieldError;
