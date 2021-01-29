import React from "react";
import PageLayout from "../HOC/PageLayout";
import { COMPANY_INFO } from "../utilities";

const ContactUs = () => {
	return (
		<>
			<PageLayout innerPage={true}>
				<div className="contact-us utl-mini-height">
					<div className="container">
						<h2>Contact us</h2>
						<ul className="contact">
							<li className="contact__item">
								<strong>Email:</strong>{" "}
								<a href={`mailto:${COMPANY_INFO.email}`}>
									{COMPANY_INFO.email}
								</a>
							</li>
						</ul>
					</div>
				</div>
			</PageLayout>
		</>
	);
};

export default ContactUs;
