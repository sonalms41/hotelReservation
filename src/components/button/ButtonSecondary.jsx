import { auto } from "@popperjs/core";
import React from "react";

export const ButtonSecondary = ({ title, className, onClick, widthAuth }) => {
	return (
		<button
			onClick={onClick}
			style={{ width: widthAuth ? "auto" : "100%" }}
			className={`utl-btn utl-btn-secondary ${className ? className : ""}`}
		>
			{title}
		</button>
	);
};
