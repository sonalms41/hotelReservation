import React, { useState, useEffect } from "react";
import logoHamroHotel from "./../assets/images/logo-hamroHotel.svg";
import logoApple from "./../assets/images/logo-apple.svg";
import logoPlaystore from "./../assets/images/logo-playstore.svg";
import { Link, useLocation, Redirect } from "react-router-dom";
import services from "../services";
import { USER_AUTH, EXTERNAL_LINKS, LOCAL_STORAGE } from "../utilities";
import { IMEpay } from "../components/paymentGateway";

const PageHeader = (props) => {
	const urlPath = useLocation().pathname;
	const { innerPage } = props;
	const [redirectToRoot, setRedirectToRoot] = useState(false);
	const [showDropdown, seShowDeopDown] = useState(false);
	const toggleShowDropdown = () => {
		seShowDeopDown(!showDropdown);
	};
	useEffect(() => {
		const val = "202012241054509392��";
		const arr = val.toString().split("");
		console.log("val:", val);
		console.log("parse:", val.replace(/[^0-9]/g, ""));
	}, []);
	const [registeredUser, setRegisteredUser] = useState(null);
	// Get detail of registered-user
	useEffect(() => {
		let userId = USER_AUTH.getUserID();
		if (userId) {
			services.GET.registeredUser(userId)
				.then((response) => {
					const data = response.data;
					if (data.status_code === 200) {
						setRegisteredUser(data.result);
					}
				})
				.catch((errors) => {});
		}
	}, []);

	// Log-out
	const handleLogOut = () => {
		let arrUrlPath = urlPath.split("/");
		LOCAL_STORAGE.clear();
		setRegisteredUser(null);

		if (arrUrlPath[1] !== "") {
			setRedirectToRoot(true);
		}
		if (arrUrlPath[1] === "") {
			window.location.reload();
		}
	};

	if (redirectToRoot) {
		return <Redirect to="/" />;
	}

	return (
		<header
			id="page-header"
			className={`${innerPage ? "header-inner-page" : ""}`}
		>
			{/*<IMEpay />*/}
			<div className="container">
				<div className="page-header__container">
					<div className="col-wrapper flex-aC-jSB">
						<div className="col-item flex-aC-jFS">
							<Link to="/" className="site-logo">
								<img src={logoHamroHotel} alt="logo" />
							</Link>

							<ul className="nav hader-nav flex-aC-jFS">
								{/*<li>
									<a to="#" className="disable">
										Today's deals
									</a>
								</li>
								<li>
									<a to="#" className="disable">
										About
									</a>
								</li>*/}
							</ul>
						</div>
						<div className="col-item apps">
							<ul className="flex-aC-jFS app-stores">
								<li>
									<img src={logoApple} alt="apple logo" />
								</li>
								<li>
									<a href={EXTERNAL_LINKS.androidAppDownload} target="_blank">
										<img src={logoPlaystore} alt="playstore logo" />
									</a>
								</li>
							</ul>
						</div>
						<div className="col-item">
							<ul className="flex-aC-jFS user">
								<li className="view-property">
									<button className="utl-btn utl-btn-tertiary">
										<a target="_blank" href={EXTERNAL_LINKS.yourProperty}>
											Your Property
										</a>
									</button>
								</li>
								<li>
									{registeredUser === null && (
										<Link to={"/login"}>Sign in</Link>
									)}

									{registeredUser && (
										<div className="header-user">
											<span className="u-icon">
												<svg
													xmlns="http://www.w3.org/2000/svg"
													width="9.95"
													height="10.678"
													viewBox="0 0 9.95 10.678"
												>
													<g id="user" transform="translate(0 0)">
														<path
															id="Path_434"
															data-name="Path 434"
															d="M19.6,241.894c-3.209,0-4.975,1.52-4.975,4.274a.383.383,0,0,0,.39.39H24.19a.383.383,0,0,0,.39-.39C24.579,243.414,22.813,241.894,19.6,241.894Z"
															transform="translate(-14.629 -235.88)"
															fill="#fff"
														/>
														<path
															id="Path_435"
															data-name="Path 435"
															d="M113.344,5.443a2.7,2.7,0,0,0,2.585-2.806,2.585,2.585,0,1,0-5.17,0A2.7,2.7,0,0,0,113.344,5.443Z"
															transform="translate(-108.369 0)"
															fill="#fff"
														/>
													</g>
												</svg>
											</span>

											<span
												className={`user-name ${
													showDropdown ? "show-dropdown" : ""
												}`}
												onClick={toggleShowDropdown}
											>
												{registeredUser.user_first_name}{" "}
												{registeredUser.user_last_name}
											</span>
											<ul
												className={`user-ul ${
													showDropdown ? "show-dropdown" : ""
												}`}
											>
												<li>
													<Link to="/userProfile/dashboard">Profile</Link>{" "}
												</li>
												<li onClick={handleLogOut}>
													<span>Log out</span>
												</li>
											</ul>
										</div>
									)}
								</li>
							</ul>
						</div>
					</div>
				</div>
			</div>
		</header>
	);
};

export default PageHeader;
