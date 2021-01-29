import React, { useState } from "react";
import PageLayout from "../../HOC/PageLayout";
import ProfileNavBar from "./ProfileNavBar";
const ProfileLayout = (props) => {
	const [showMNav, setShowMNav] = useState(false);
	//useEffect(() => {
	//	console.clear();
	//}, [props]);

	return (
		<PageLayout innerPage={true}>
			<div className="user-profile">
				<div className="container container--min-height">
					<div className="user-profile__header flex-aC-jSB">
						<span className="title">My Account </span>
						<span
							className="profile-mobile-nav"
							onClick={() => setShowMNav(!showMNav)}
						>
							<span
								className={`nav-icon ${showMNav ? "active-nav" : ""}`}
							></span>
						</span>
					</div>
					<div className="user-profile__body">
						<div className="col-wrapper ">
							<div className="col-item col-item--lg-3">
								<div
									className={`user-profile__sidebar ${
										showMNav ? "visible-m-nav" : ""
									}`}
								>
									<ProfileNavBar />
								</div>
							</div>
							<div className="col-item col-item--lg-9">{props.children}</div>
						</div>
					</div>
				</div>
			</div>
		</PageLayout>
	);
};

export default ProfileLayout;
