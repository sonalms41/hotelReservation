import React from "react";
import { css } from "@emotion/core";
import { BeatLoader } from "react-spinners";

const CustomLoader = (props) => {
	const { isLoading } = props;
	const override = css`
		display: block;
		margin: 0 auto;
		border-color: red;
	`;

	return (
		<>
			{isLoading && (
				<div className="custom-loader">
					<BeatLoader css={override} size={30} color="#6C63FF" loading={true} />
				</div>
			)}
		</>
	);
};

export default CustomLoader;
