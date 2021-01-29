import React from "react";
import PageHeader from "../pages/PageHeader";
import PageFooter from "../pages/PageFooter";

const PageLayout = (props) => {
	const { innerPage } = props;
	//useEffect(() => {
	//	console.clear();
	//}, [props]);

	return (
		<>
			<PageHeader innerPage={innerPage} />
			<main id="page-main">{props.children}</main>
			<PageFooter />
		</>
	);
};
export default PageLayout;
