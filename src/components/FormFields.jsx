import React from "react";
import FormFieldError from "./FormFieldError";
export const FormFieldInput = (props) => {
	const {
		label,
		name,
		placeholder,
		id,
		type,
		onChange,
		className,
		errors,
		disabled,
	} = props;

	return (
		<div className={`form-group ${className ? className : ""}`}>
			<label htmlFor={id}>{label}</label>
			<input
				type={type}
				id={id}
				name={name}
				placeholder={placeholder}
				onChange={onChange}
				autoComplete="off"
				disabled={disabled}
			/>
			{errors && <FormFieldError message={errors} />}
		</div>
	);
};
export const FormFieldRadio = (props) => {
	const {
		label,
		name,
		id,
		onClick,
		value,
		className,
		checked,
		disabled,
	} = props;

	return (
		<div className={`form-group ${className ? className : ""}`}>
			<input
				type="radio"
				id={id}
				name={name}
				value={value}
				checked={checked}
				onClick={onClick}
				disabled={disabled}
			/>

			<label htmlFor={id}>{label}</label>
		</div>
	);
};
// Check-box tab
export const FormFieldCheckbox = (props) => {
	const {
		label,
		name,
		id,
		onChange,
		value,
		className,
		disabled,
		checked,
	} = props;

	return (
		<div className={`form-group ${className ? className : ""}`}>
			<input
				type="checkbox"
				id={id}
				name={name}
				value={value}
				onChange={onChange}
				disabled={disabled}
				checked={checked}
			/>
			<label htmlFor={id}>{label}</label>
		</div>
	);
};

// Textarea
export const FormFieldTextarea = (props) => {
	const {
		label,
		name,
		placeholder,
		value,
		id,
		onChange,
		className,
		disabled,
	} = props;

	return (
		<div className={`form-group ${className ? className : ""}`}>
			<textarea
				id={id}
				name={name}
				placeholder={placeholder}
				onChange={onChange}
				value={value}
				disabled={disabled}
			/>
		</div>
	);
};

// Select
export const FormFieldSelect = (props) => {
	const {
		label,
		name,
		placeholder,
		id,
		value,
		type,
		onChange,
		options,
		className,
		disabled,
	} = props;

	return (
		<div className={`form-group ${className ? className : ""}`}>
			<label htmlFor={id}>{label}</label>
			<select
				id={id}
				type={type}
				placeholder={placeholder}
				onChange={onChange}
				value={value}
				name={name}
				disabled={disabled}
			>
				{options.map((option, i) => {
					return (
						<option key={`sdfdsf-${i}`} value={option}>
							{option}
						</option>
					);
				})}
			</select>
		</div>
	);
};
