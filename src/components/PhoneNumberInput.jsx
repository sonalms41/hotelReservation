import React, { useState } from "react";
import "react-phone-number-input/style.css";
import PhoneInput, {
	isPossiblePhoneNumber,
	isValidPhoneNumber,
} from "react-phone-number-input";

const PhoneNumberInput = (props) => {
	const countries = ["NP"];
	const { onChange, defaultCountry, value, disabled } = props;
	return (
		<>
			<PhoneInput
				placeholder="Enter phone number"
				onChange={onChange}
				defaultCountry={defaultCountry}
				value={value}
				disabled={disabled}
				countries={countries}
				addInternationalOption={false}
				//displayInitialValueAsLocalNumber
			/>
		</>
	);
};

export default PhoneNumberInput;
