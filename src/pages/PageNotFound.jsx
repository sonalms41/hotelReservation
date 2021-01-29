import React from "react";
import PageLayout from "../HOC/PageLayout";

const PageNotFound = () => {
	return (
		<>
			<PageLayout innerPage={true}>
				<div className="page-not-found">
					<div className="container">
						<h1>404 Page NotFound !! </h1>
					</div>
				</div>
			</PageLayout>
		</>
	);
};

export default PageNotFound;
