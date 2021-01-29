import React, { useState, useContext, useEffect, useRef } from "react";
import ReactMapGl, { Marker, FlyToInterpolator } from "react-map-gl";
import useSupercluster from "use-supercluster";
import { Link } from "react-router-dom";
import iconLocationMarker from "./../assets/images/icon-location-marker.png";
import defaultImg from "./../assets/images/image-default.png";
import { PropertyContext } from "../HOC/Context";
import CustomLoader from "./CustomLoader";
import { v4 as uuidv4 } from "uuid";
const MapBox = ({
	zoom,
	width,
	height,
	draggable,
	propertyDetail,
	showPrice,
}) => {
	// Default
	const NEPAL_LATITUDE = 28.3949;
	const NEPAL_LONGITUDE = 84.124;
	const MAPBOX_KEY =
		"pk.eyJ1IjoiY29ubmVjdGluZy1uZXBhbCIsImEiOiJja2IwcHBhazcwYm83MzRxdWc5ZTYza280In0.05ijnx-qeemBNuT6wVHvaQ";
	const MAPBOX_STYLE =
		"mapbox://styles/connecting-nepal/ckh5xnnxv0p1519t9dsb6k97w";

	// Initial-viewport
	const [viewport, setViewport] = useState({
		width: width ? width : "85vw",
		height: height ? height : "90vh",
		latitude: NEPAL_LATITUDE,
		longitude: NEPAL_LONGITUDE,
		zoom: zoom ? zoom : 1,
	});

	const linkToPropertyDetailRef = useRef();
	const mapRef = useRef();
	const [isLoading, setIsLoading] = useState(false);
	const [propertyId, setPropertyId] = useState(null);
	const { propertyDetailContext } = useContext(PropertyContext);
	const [selectedProperty, setSelectedProperty] = useState(null);
	useEffect(() => {
		setSelectedProperty(propertyDetailContext);
	}, [propertyDetailContext]);

	// Slice some properties (in case of large number of data: show shorten list of properties)
	const properties = propertyDetail ? propertyDetail.slice(0, 100) : [];

	// Super cluster
	const locations = properties.map((item) => ({
		type: "Feature",
		properties: {
			cluster: false,
			locationId: uuidv4(),
			category: "Property Location",
		},
		geometry: {
			type: "Point",
			coordinates: [item.longitude, item.latitude],
		},
	}));

	// Get map-bounds
	const mapBounds = mapRef.current
		? mapRef.current.getMap().getBounds().toArray().flat()
		: null;

	// Get clusters
	//const { clusters } = useSupercluster({
	//	points: locations,
	//	zoom: viewport.zoom,
	//	bounds: mapBounds,
	//	options: { radius: 80, maxZoom: 20 },
	//});
	//console.log("clusters:", clusters);

	const handleRedirectViwDetail = (propertyId) => {
		setIsLoading(true);
		setPropertyId(propertyId);
		setTimeout(() => {
			linkToPropertyDetailRef.current.click();
			setIsLoading(false);
		}, 250);
	};

	return (
		<>
			<CustomLoader isLoading={isLoading} />
			<div className="map-box">
				{properties && properties.length >= 1 && (
					<ReactMapGl
						{...viewport}
						mapboxApiAccessToken={MAPBOX_KEY}
						onViewportChange={(viewport) => setViewport(viewport)}
						mapStyle={MAPBOX_STYLE}
						antialias={true}
						hash={true}
						maxZoom={20}
						ref={mapRef}
					>
						{properties.map((property) => {
							return (
								<Marker
									key={uuidv4()}
									latitude={property.latitude}
									longitude={property.longitude}
									draggable={draggable}
								>
									{!showPrice && (
										<span className="location-icon">
											<img src={iconLocationMarker} alt="Location" />
										</span>
									)}
									{showPrice && (
										<span
											className={`location-marker ${
												selectedProperty &&
												selectedProperty.property_name ===
													property.property_name
													? "active"
													: ""
											}`}
											onMouseOver={() =>
												setSelectedProperty({
													...property,
												})
											}
											onMouseLeave={() => setSelectedProperty(null)}
											onClick={() =>
												handleRedirectViwDetail(property.property_id)
											}
										>
											NPR {property.total_price}
										</span>
									)}
									<Link
										ref={linkToPropertyDetailRef}
										to={`/propertyDetail/${propertyId}`}
										target="_blank"
									/>
								</Marker>
							);
						})}
						{selectedProperty ? (
							//<Popup
							//	latitude={selectedProperty.latitude}
							//	longitude={selectedProperty.longitude}
							//>
							<div className="map-box__property flex-aFS-jFS">
								<div className="col-1">
									<span
										className="map-box__prop-img col-inline-bg"
										style={{
											backgroundImage: selectedProperty.prop_image
												? `url(${process.env.REACT_APP_API_BASE_URL}${selectedProperty.prop_image})`
												: `url(${defaultImg})`,
										}}
									></span>
								</div>
								<div className="col-2">
									<h2 className="map-box__prop-name">
										{selectedProperty.property_name}
									</h2>
									<div className="flex-aFS flex-ffC">
										<div className="utl-star utl-star-y">
											{selectedProperty.star} Star Hotel
										</div>
										<div className="utl-location">
											{selectedProperty.street_address !== " " &&
												`${selectedProperty.street_address}, `}
											{selectedProperty.city !== " " &&
												`${selectedProperty.city}, `}
											{selectedProperty.country !== " " &&
												`${selectedProperty.country}`}
										</div>
									</div>
								</div>
							</div>
						) : /*</Popup>*/

						null}

						{/*<GeolocateControl
						positionOptions={{ enableHighAccuracy: false }}
						trackUserLocation={true}
						auto={true}
					/>*/}
					</ReactMapGl>
				)}
			</div>
		</>
	);
};

export default MapBox;
