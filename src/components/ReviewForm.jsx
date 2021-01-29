import React, { useState } from "react";
import { FormFieldTextarea } from "./FormFields";
import ModalPopUp from "./ModalPopUp";
import { toastNotification } from "./../utilities";
import services from "../services";
import Rating from "react-rating";

const ReviewForm = (props) => {
	const { propertyId, userId, visibleModal, closeModal, guestId } = props;
	const [reviewStar, setReviewStar] = useState();
	const [showModal, setShowModal] = useState(null);
	const [starStatus, setStarStatus] = useState("");
	const [nLetters, setNLetters] = useState(0);
	const [reviewDescription, setReviewDescription] = useState("");

	const starGrey = (
		<svg
			width="46"
			height="42"
			viewBox="0 0 46 42"
			fill="none"
			xmlns="http://www.w3.org/2000/svg"
		>
			<path
				d="M23 0L28.3883 15.8926H45.8254L31.7185 25.7148L37.1068 41.6074L23 31.7852L8.89315 41.6074L14.2815 25.7148L0.174644 15.8926H17.6117L23 0Z"
				fill="#C4C4C4"
			/>
		</svg>
	);
	const starYellow = (
		<svg
			width="46"
			height="42"
			viewBox="0 0 46 42"
			fill="none"
			xmlns="http://www.w3.org/2000/svg"
		>
			<path
				d="M23 0L28.3883 15.8926H45.8254L31.7185 25.7148L37.1068 41.6074L23 31.7852L8.89315 41.6074L14.2815 25.7148L0.174644 15.8926H17.6117L23 0Z"
				fill="#FFC800"
			/>
		</svg>
	);
	const handleChangeTextarea = (e) => {
		const value = e.target.value;
		const nLetters = value.split("").length;
		setNLetters(nLetters);
		setReviewDescription(value);
	};
	// POST-REVIEW
	const handlePostReview = () => {
		// Check numbers of character of description
		const nCharacters = reviewDescription.split("").length;
		nCharacters > 500 &&
			toastNotification.warn("Description should be less then 500 character!");

		// Notify if try to post without select star
		reviewStar === null && toastNotification.warn("Please select a star");
		if (nCharacters <= 500 && reviewStar !== null) {
			const postValue = {
				property_id: propertyId,
				user_id: parseInt(userId),
				comment: reviewDescription,
				rating: parseInt(reviewStar),
				guest_id: guestId,
			};
			services.POST.guestReview(postValue)
				.then((response) => {
					const data = response.data;
					if (data.status_code === 200) {
						toastNotification.success(data.message);
						setReviewDescription("");
						setNLetters(0);
					}
					if (data.status_code === 400) {
						toastNotification.warn(data.message);
					}
				})
				.catch((errors) => {
					const m = errors;
				});
		}
	};

	const handleRatingClick = (starValue) => {
		setReviewStar(starValue);
		starValue === 1 && setStarStatus("Poor");
		starValue === 2 && setStarStatus("Mediocre");
		starValue === 3 && setStarStatus("Okay");
		starValue === 4 && setStarStatus("Good");
		starValue === 5 && setStarStatus("Excellent");
	};
	const handleHoverStar = (starVal) => {
		starVal === 1 && setStarStatus("Poor");
		starVal === 2 && setStarStatus("Mediocre");
		starVal === 3 && setStarStatus("Okay");
		starVal === 4 && setStarStatus("Good");
		starVal === 5 && setStarStatus("Excellent");
		if (starVal === undefined) {
			reviewStar === 1 && setStarStatus("Poor");
			reviewStar === 2 && setStarStatus("Mediocre");
			reviewStar === 3 && setStarStatus("Okay");
			reviewStar === 4 && setStarStatus("Good");
			reviewStar === 5 && setStarStatus("Excellent");
			reviewStar === undefined && setStarStatus("");
		}
	};

	return (
		<ModalPopUp
			visibleModal={showModal !== null ? showModal : visibleModal}
			closeModal={closeModal}
			className="review-container"
		>
			<div className="guest-review">
				<h3>Write a Rating and Review</h3>

				<div className="guest-review__header margin-b-15">
					<h4>Rate this hotel service</h4>
					<p>Tab in the star</p>
				</div>
				<div className="guest-review__rating flex-aC-jFS flex-ffC margin-b-15">
					<div className="stars">
						<Rating
							emptySymbol={starGrey}
							fullSymbol={starYellow}
							stop={5}
							start={0}
							onClick={handleRatingClick}
							placeholderSymbol={starYellow}
							placeholderRating={reviewStar}
							onHover={handleHoverStar}
						/>
					</div>
					<span className="status">{starStatus}</span>
				</div>
				<div className="guest-review__description">
					<h4 className="margin-b-15">Write a descripton</h4>
					<FormFieldTextarea
						placeholder="Describe you experience(Optional)"
						value={reviewDescription}
						onChange={handleChangeTextarea}
						label={`${nLetters} / 500`}
					/>
				</div>
				<div className="guest-review__btn flex-aC-jFE">
					<button className="utl-btn utl-btn-fifth" onClick={handlePostReview}>
						Post
					</button>
				</div>
			</div>
		</ModalPopUp>
	);
};

export default ReviewForm;
