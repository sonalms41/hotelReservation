import React from "react";
import TawkTo from "../components/TawkTo";
import { COMPANY_INFO, EXTERNAL_LINKS } from "../utilities";
import logoApple from "./../assets/images/logo-apple.svg";
import logoPlaystore from "./../assets/images/logo-playstore.svg";

const PageFooter = () => {
	return (
		<footer id="page-footer">
			<div className="footer-row-1">
				<div className="container">
					<div className="footer-wrapper flex-aFS-jSB col-wrapper ">
						<div className="col-item ">
							<h4>About {COMPANY_INFO.name}l</h4>
							<ul className="flex-aFS-jFS flex-ffC">
								<li>
									{/*<Link to="/aboutUs" >About Us</Link>*/}
									<a>About Us</a>
								</li>
								<li>
									{/*<Link to="/contactUs">Contact Us</Link>*/}
									<a>Contact Us</a>
								</li>
								<li>
									<a>Terms of Services</a>
									{/*<Link to="termsAndCondition">Terms of Services</Link>*/}
								</li>
							</ul>
						</div>
						<div className="col-item ">
							<h4>Partner</h4>
							<ul className="flex-aFS-jFS flex-ffC">
								{/*<li>
									<a>Add Your Property</a>
								</li>*/}
								<li>
									<a href={EXTERNAL_LINKS.yourProperty} target="_blank">
										Sign In Your Property
									</a>
								</li>
							</ul>
						</div>
						<div className="col-item ">
							<h4>Help and Support</h4>
							<ul className="flex-aFS-jFS flex-ffC">
								<li className="footer-call-list">
									Call Us:
									<a href={`tel:+977 ${COMPANY_INFO.phoneNumber}`}>
										{COMPANY_INFO.phoneNumber}
									</a>
								</li>
								<li className="footer-call-list">
									Email:
									<a
										href={`mailto:${COMPANY_INFO.email}`}
										//onClick={sendMail("info@hamrohotel.com")}
									>
										{COMPANY_INFO.email}
									</a>
								</li>
							</ul>
						</div>
						<div className="col-item ">
							<h4>Download Our App</h4>
							<ul className="flex-aFS-jFS flex-ffC footer-appstore">
								<li>
									<a>
										<img src={logoApple} alt="apple" />
									</a>
								</li>
								<li>
									<a target="_blank" href={EXTERNAL_LINKS.androidAppDownload}>
										<img src={logoPlaystore} alt="playstore" />
									</a>
								</li>
							</ul>
						</div>
					</div>
				</div>
			</div>

			<div className="footer-row-2">
				<div className="container">
					<div className="copuright flex-aC-jSB">
						<p>Powered By: {COMPANY_INFO.name}</p>
						<p className="col-text-right">
							©{new Date().getFullYear()} {COMPANY_INFO.name}, All Rights
							Reserved
						</p>
					</div>
				</div>
			</div>
			<TawkTo />
		</footer>
	);
};

export default PageFooter;
