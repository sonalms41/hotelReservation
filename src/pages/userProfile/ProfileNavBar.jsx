import React, { useState } from "react";
import { Link, NavLink, Redirect } from "react-router-dom";
import { LOCAL_STORAGE } from "../../utilities";

const ProfileNavBar = () => {
	const [logOut, setLogOut] = useState(false);
	const handleLogOut = () => {
		LOCAL_STORAGE.clear();
		setLogOut(true);
	};
	if (logOut) {
		return <Redirect to="/" />;
	}
	return (
		<ul className="profile-nav-ul">
			<div className="nav-ul-row-1">
				<li className="nav-li nav-li-dashboard">
					<NavLink to="/userProfile/dashboard">
						<span>Profile</span>
					</NavLink>
				</li>
				<li className="nav-li nav-li-bookings">
					<NavLink to="/userProfile/booking">
						<span>My Bookings</span>
					</NavLink>
				</li>

				<li className="nav-li nav-li-saved">
					<NavLink to="/userProfile/savedHotel">
						<span>Saved</span>
					</NavLink>
				</li>
				<li className="nav-li nav-li-review">
					<NavLink to="/userProfile/review">
						<span>Review</span>
					</NavLink>
				</li>
				<li className="nav-li nav-li-settings">
					<NavLink to="/userProfile/setting">
						<span>Settings</span>
					</NavLink>
				</li>
			</div>
			<div className="nav-ul-row-2">
				<li>
					<Link>About Booking</Link>
				</li>
				<li>
					<Link>Privacy</Link>
				</li>
				<li>
					<Link>Terms & Condition</Link>
				</li>
				<li>
					<Link>Feedback</Link>
				</li>
				<li className="logout">
					<Link onClick={handleLogOut}>Logout</Link>
				</li>
			</div>
		</ul>
	);
};

export default ProfileNavBar;
