import React, { useState, useEffect, useContext } from "react";
import ImageGallery from "react-image-gallery";
import { Tab, Tabs, TabList, TabPanel } from "react-tabs";
import ImgGallery1 from "./../assets/images/img-propgallery1.jpg";
import { v4 as uuidv4 } from "uuid";

import "react-tabs/style/react-tabs.css";

const PhotoGallery = (props) => {
	const [selectedTabIndex, setSelectedTabIndex] = useState(null);
	const [initialThumbnailIndex, setInitialThumbnailIndex] = useState(null);

	const {
		showIndex,
		slideOnThumbnailOver,
		infinite,
		autoPlay,
		startIndex,
		closeGallery,
		prop_images,
	} = props;
	console.log("photo-images:", prop_images);

	const images = [
		{
			tags: "Images",
			images: prop_images.map((image) => {
				return {
					original: image,
					thumbnail: image,
				};
			}),
		},
	];

	const handleSelectedTabInde = (tabIndex) => {
		setSelectedTabIndex(tabIndex);
		setInitialThumbnailIndex(0);
		console.log(tabIndex);
	};
	return (
		<>
			<div id="connecting-image-gallery">
				<div className="connecting-gallery-body">
					<Tabs className="gallery-filter-nav-wrapper">
						{/*Display image tag-name with total number of images under the particular image tag*/}
						<TabList className="gallery-filter-nav">
							<div className="gallery-filter-nav__lists">
								{images &&
									images.map((photo) => {
										return (
											<Tab key={uuidv4()} className="gallery-filter-nav__item">
												{photo.tags} ({[photo.images.length]})
											</Tab>
										);
									})}
							</div>
							<button className="button-close-gallery" onClick={closeGallery}>
								x
							</button>
						</TabList>

						{/*Display images  under the particular image tag*/}
						{images &&
							images.map((arrayOfImages) => {
								return (
									<TabPanel className="filter-result" key={uuidv4()}>
										<ImageGallery
											items={arrayOfImages.images.map((image, i) => {
												return {
													original: `${process.env.REACT_APP_API_BASE_URL}${image.original}`,
													thumbnail: `${process.env.REACT_APP_API_BASE_URL}${image.thumbnail}`,
												};
											})}
											showIndex={showIndex ? showIndex : false}
											slideOnThumbnailOver={
												slideOnThumbnailOver ? slideOnThumbnailOver : false
											}
											infinite={infinite ? infinite : true}
											originalClass="connecting-gallery-image"
											autoPlay={autoPlay}
											disableThumbnailScroll={false}
											startIndex={startIndex}
											showPlayButton={false}
											showFullscreenButton={false}
										/>
									</TabPanel>
								);
							})}
					</Tabs>
				</div>
			</div>
		</>
	);
};

export default PhotoGallery;
