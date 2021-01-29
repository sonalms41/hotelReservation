import React from "react";
import ProfileDashboard from "./ProfileDashboard";
import ProfileLayout from "./ProfileLayout";

const UserProfile = () => {
	return (
		<>
			<ProfileLayout>
				<ProfileDashboard className="profile-bookingentry" />
			</ProfileLayout>
		</>
	);
};

export default UserProfile;
