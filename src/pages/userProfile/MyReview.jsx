import React, { useEffect, useState } from "react";
import services from "../../services";
import { toastNotification, USER_AUTH } from "../../utilities";
import ProfileLayout from "./ProfileLayout";

const MyReview = () => {
	const userId = USER_AUTH.getUserID();
	const [reviewData, setReviewData] = useState(null);
	useEffect(() => {
		services.GET.guestReviews(userId)
			.then((response) => {
				const data = response.data;
				if (data.status_code === 400) {
					toastNotification.warn(data.message);
				}
				if (data.status_code === 200) {
					setReviewData(data.result);
				}
			})
			.catch((errors) => {
				console.error(errors);
			});
	}, []);
	return (
		<ProfileLayout>
			<h2 className="user-profile__page-title">My Review</h2>
			<ul className="review-ul">
				{reviewData ? (
					reviewData.map((review) => {
						return (
							<li className="review-item flex-ffC flex-aFS">
								<span className="review-item__rating utl-rating-box margin-b-15 ">
									{review.rating}/5
								</span>
								<span className="review-item__prop">
									{review.property_name}
								</span>
								<span className="review-item__cmt">{review.comment}</span>
							</li>
						);
					})
				) : (
					<p className="info-notfound">Review not available</p>
				)}
			</ul>
		</ProfileLayout>
	);
};

export default MyReview;
