import React from "react";

export const ButtonPrimary = ({ title, className, onClick, widthAuto }) => {
	return (
		<button
			onClick={onClick}
			style={{ width: widthAuto ? "auto" : "100%" }}
			className={`utl-btn-primary utl-btn ${className ? className : ""}`}
		>
			{title}
		</button>
	);
};
