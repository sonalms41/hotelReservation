import React, { Fragment, useEffect, useState } from "react";
import Paginate from "./../../components/Paginate";
import { v4 as uuidv4 } from "uuid";

const PropertyDetailReview = (props) => {
	const { propertyDetails } = props;
	const [allReviews, setAllReviews] = useState([]);
	const [visiblePage, setVisiblePage] = useState(1);
	const nReviewsPerPage = 10;
	const [currentVisibleReview, setCurrentVisibleReview] = useState([]);

	const [allStars, setAllStars] = useState([]);
	const [reviewStatus, setReviewStatus] = useState(null);

	const reviewCategories = [
		"5 - Excellent",
		"4 - Good",
		"3 - Okay",
		"2 - Mediocre",
		"1 - Poor",
	];
	useEffect(() => {
		const rating = propertyDetails.hotel_rating;
		rating > 0 && rating <= 1 && setReviewStatus("Poor");
		rating > 1 && rating <= 2 && setReviewStatus("Mediocre");
		rating > 2 && rating <= 3 && setReviewStatus("Okay");
		rating > 3 && rating <= 4 && setReviewStatus("Good");
		rating > 4 && rating <= 5 && setReviewStatus("Excellent");

		const allReviews = propertyDetails.all_reviews;
		const allStars = propertyDetails.all_stars;
		if (allStars) {
			setAllStars(allStars.reverse());
		}
		if (allReviews !== undefined) {
			setAllReviews(allReviews);
		}
	}, [propertyDetails, nReviewsPerPage]);

	// Get Current visible review
	useEffect(() => {
		const indexOfLastVisibleReview = visiblePage * nReviewsPerPage;
		const indexOfFirstVisibleReview =
			indexOfLastVisibleReview - nReviewsPerPage;
		const currentVisibleReview = allReviews.slice(
			indexOfFirstVisibleReview,
			indexOfLastVisibleReview,
		);
		setCurrentVisibleReview(currentVisibleReview);
	}, [visiblePage, allReviews]);

	const handlePageClick = (data) => {
		setVisiblePage(data.selected);
	};

	return (
		<div id="prop-detail-review" className="prop-detail-row prop-detail-review">
			<h3 className="heading-tertiary"> Reviews</h3>
			<div className="flex-aFS-jSB review-wrapper">
				<div className="review-col-1 utl-col">
					<div className="margin-b-20 flex-aFS-jFS ">
						<span className="col-sm-box-2">{propertyDetails.hotel_rating}</span>
						<div className="flex-ffC flex-jC flex-aFS">
							<span className="review-status">{reviewStatus}</span>
							<span className="review-no">
								{propertyDetails.total_review} Reviews
							</span>
						</div>
					</div>
					<ul className="review-chart">
						{allStars &&
							allStars.map((star, i) => {
								return (
									<Fragment key={uuidv4()}>
										<div className="review-chart__status flex-aC-jSB">
											<span>{reviewCategories[i]}</span>
											<strong>{star.counts}</strong>
										</div>
										<li className="review-chart__item">
											<span
												className="review-chart__progress"
												style={{
													width: `${
														100 - propertyDetails.total_review / star.counts + 1
													}%`,
												}}
											></span>
										</li>
									</Fragment>
								);
							})}
					</ul>
				</div>
				<div className="review-col-2 utl-col">
					<ul className="review-ul">
						{currentVisibleReview &&
							currentVisibleReview.map((review, i) => {
								return (
									<>
										<li key={uuidv4()}>
											<div className="utl-row flex-jFS">
												<span className="col-sm-box-2">{`${review.rate} / 5`}</span>
											</div>

											<div className="utl-row flex-ffC flex-jFS">
												<span className="review-date">{review.date}</span>
												<span className="review-name">{review.full_name}</span>
												<span className="review-address">
													{review.city !== " " && review.city !== undefined
														? `${review.city},`
														: ""}{" "}
													{review.country !== " " && review.country !== null
														? `${review.country}`
														: ""}
												</span>
											</div>
											<p>{review.coment}</p>
										</li>
									</>
								);
							})}
					</ul>
					{allReviews.length >= 1 && (
						<Paginate
							pageCount={Math.ceil(allReviews.length / nReviewsPerPage)}
							handlePageClick={handlePageClick}
							className="review-pagination"
						/>
					)}
				</div>
			</div>
		</div>
	);
};

export default PropertyDetailReview;
