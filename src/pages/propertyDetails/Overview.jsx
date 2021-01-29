import React, { Fragment, useState, useEffect } from "react";

import MapBox from "./../../components/MapBox";
import ModalPopUp from "./../../components/ModalPopUp";
import PhotoGallery from "./../../components/PhotoGallery";
import TruncateContent from "./../../components/TruncateContent";
import defaultImg from "./../../assets/images/image-default.png";
import { toastNotification } from "../../utilities";
import { PlaceholderCard } from "../../components/CustomPlaceholder";
const PropertyDetailOverview = ({ propertyDetail, isLoading, viewOnMap }) => {
	const [showPhotoGallery, setShowPhotoGallery] = useState(false);
	const [startThumbnailIndex, setStartThumbnailIndex] = useState();
	const infoNoImages = () => {
		toastNotification.info("Image not available !");
	};
	const [viewMap, setViewMap] = useState(false);

	const handleImageGallery = (index) => {
		setShowPhotoGallery(true);
		setStartThumbnailIndex(index);
	};
	useEffect(() => {
		setViewMap(viewOnMap);
	}, [viewOnMap]);
	return (
		<div id="prop-detail-overview">
			<div className="prop-detail-row prop-photo-gallery prop-photo-gallery--parent ">
				{isLoading && (
					<Fragment>
						<div className="gallery-col-1 ">
							<div className="photo-expo p-cover-lg ">
								<PlaceholderCard count={1} />
							</div>
						</div>
						<div className=" gallery-col-2">
							<ul className="photo-list-ul">
								<li className="photo-item p-cover-sm ">
									<PlaceholderCard count={1} />
								</li>
								<li className="photo-item p-cover-sm ">
									<PlaceholderCard count={1} />
								</li>
								<li className="photo-item p-cover-sm ">
									<PlaceholderCard count={1} />
								</li>
								<li className="photo-item p-cover-sm ">
									<PlaceholderCard count={1} />
								</li>
							</ul>
						</div>
					</Fragment>
				)}
				{propertyDetail && (
					<>
						<div className="gallery-col-1 ">
							{propertyDetail.prop_image && (
								<div
									onClick={
										propertyDetail.prop_image[0]
											? () => handleImageGallery(0)
											: infoNoImages
									}
									className="photo-expo col-inline-bg"
									style={{
										backgroundImage: `${
											propertyDetail.prop_image[0]
												? `url(${process.env.REACT_APP_API_BASE_URL}${propertyDetail.prop_image[0]})`
												: `url(${defaultImg})`
										}`,
									}}
								></div>
							)}
						</div>
						<div className=" gallery-col-2">
							{propertyDetail.prop_image && (
								<ul className="photo-list-ul">
									<li className="photo-item ">
										<div
											onClick={
												propertyDetail.prop_image[1]
													? () => handleImageGallery(1)
													: infoNoImages
											}
											className="photo-expo col-inline-bg"
											style={{
												backgroundImage: `${
													propertyDetail.prop_image[1]
														? `url(${process.env.REACT_APP_API_BASE_URL}${propertyDetail.prop_image[1]})`
														: `url(${defaultImg})`
												}`,
											}}
										></div>
									</li>
									<li className="photo-item ">
										<div
											onClick={
												propertyDetail.prop_image[2]
													? () => handleImageGallery(2)
													: infoNoImages
											}
											className="photo-expo col-inline-bg"
											style={{
												backgroundImage: `${
													propertyDetail.prop_image[2]
														? `url(${process.env.REACT_APP_API_BASE_URL}${propertyDetail.prop_image[2]})`
														: `url(${defaultImg})`
												}`,
											}}
										></div>
									</li>
									<li className="photo-item ">
										<div
											onClick={
												propertyDetail.prop_image[3]
													? () => handleImageGallery(3)
													: infoNoImages
											}
											className="photo-expo col-inline-bg"
											style={{
												backgroundImage: `${
													propertyDetail.prop_image[3]
														? `url(${process.env.REACT_APP_API_BASE_URL}${propertyDetail.prop_image[3]})`
														: `url(${defaultImg})`
												}`,
											}}
										></div>
									</li>
									<li className="photo-item ">
										<div
											onClick={
												propertyDetail.prop_image[4]
													? () => handleImageGallery(4)
													: infoNoImages
											}
											className="photo-expo col-inline-bg"
											style={{
												backgroundImage: `${
													propertyDetail.prop_image[4]
														? `url(${process.env.REACT_APP_API_BASE_URL}${propertyDetail.prop_image[4]})`
														: `url(${defaultImg})`
												}`,
											}}
										></div>
									</li>
								</ul>
							)}
						</div>{" "}
						<span className="overlay-rest-photo-no">
							<span className="icon-img-no">
								<img
									src={require("./../../assets/images/icon-count-photo-no.svg")}
									alt="Count"
								/>
							</span>
							{propertyDetail && (
								<span>
									{propertyDetail.prop_image &&
									propertyDetail.prop_image.length > 5
										? `${propertyDetail.prop_image.length - 5} +`
										: 0}
								</span>
							)}
						</span>
					</>
				)}
			</div>
			{propertyDetail && (
				<div className="prop-detail-row prop-detail-general col-wrapper  utl-row-2 flex-jSB">
					<div className="col-item col-item--lg-5 ">
						<div className="prop-description utl-col">
							<h4 className="heading-fourth">Description</h4>
							<TruncateContent
								lines={5}
								more="Read more"
								children={propertyDetail.description}
								less="Show less"
							/>
						</div>
					</div>
					<div className="col-item col-item--lg-3 ">
						<div className="prop-check-time utl-col">
							<div className="utl-row utl-row-1 ">
								<h4>Check in Time</h4>
								<div className="flex-aC-jSB">
									<span className=" col-sm-box-1  flex-aC-jC">
										{propertyDetail.property_checkin}
									</span>
									<span className="txt">To</span>
									<span className="checkin-end col-sm-box-1  flex-aC-jC">
										{propertyDetail.property_checkin_end}
									</span>
								</div>
							</div>
							<div className="utl-row utl-row-2 ">
								<h4>Check out Time</h4>
								<div className="flex-aC-jSB">
									<span className=" col-sm-box-1  flex-aC-jC">
										{propertyDetail.property_checkout}
									</span>
									<span className="txt">To</span>
									<span className="checkin-end col-sm-box-1  flex-aC-jC">
										{propertyDetail.property_checkout_end}
									</span>
								</div>
							</div>
						</div>
					</div>
					<div className="col-item col-item--lg-4 ">
						<div className="prop-map utl-col flex-ffC flex-jSB">
							<div className="utl-row-1">
								{propertyDetail.latitude && propertyDetail.longitude && (
									<>
										<MapBox
											zoom={5}
											height="20rem"
											width="100%"
											propertyDetail={[
												{
													...propertyDetail,
												},
											]}
											draggable={false}
											showPrice={false}
											viewDetail={false}
										/>
									</>
								)}
							</div>
							<div className="utl-row-2 text-center">
								<span className="utl-anchor" onClick={() => setViewMap(true)}>
									View on map
								</span>
							</div>
						</div>
					</div>
				</div>
			)}
			{showPhotoGallery && (
				<div className="admin-image-gallery">
					<PhotoGallery
						showIndex={true}
						slideOnThumbnailOver={false}
						infinite={true}
						galleryTitle="Property Photo Gallery"
						autoPlay={false}
						startIndex={startThumbnailIndex}
						showPlayButton={false}
						closeGallery={() => setShowPhotoGallery(false)}
						prop_images={propertyDetail && propertyDetail.prop_image}
					/>
				</div>
			)}

			<ModalPopUp
				visibleModal={viewMap}
				closeModal={() => {
					setViewMap(false);
				}}
				className="modal-view-map"
			>
				<MapBox
					zoom={5}
					height="90vh"
					width="100%"
					propertyDetail={[
						{
							...propertyDetail,
						},
					]}
					draggable={false}
					showPrice={false}
					viewDetail={false}
				/>
			</ModalPopUp>
		</div>
	);
};

export default PropertyDetailOverview;
