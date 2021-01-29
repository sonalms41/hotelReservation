import React, { useState, useEffect, useContext } from "react";
import Select from "react-select";
import { SelectDestinationContext } from "../HOC/Context";
import services from "../services";

import iconLocation from "./../assets/images/icon-location.svg";
import iconHotel from "./../assets/images/icon-hotel.svg";
const SelectDestination = (props) => {
	const {
		onInputChange,
		defaultInputValue,
		onChange,
		primaryLayout,
		value,
	} = props;
	const { handleChangeSelectDestination } = useContext(
		SelectDestinationContext,
	);
	const [selectedVal, setSelectedVal] = useState(null);
	const [isLoading, setIsLoading] = useState(false);
	const [options, setOptions] = useState(null);
	const [inputVal, setInputVal] = useState("");
	//const options = [
	//	{ value: "chocolate", label: "Chocolate" },
	//	{ value: "strawberry", label: "Strawberry" },
	//	{ value: "vanilla", label: "Vanilla" },
	//];

	// RECOMMENDED DESTINATION
	useEffect(() => {
		setIsLoading(true);
		services.GET.nearestHotels()
			.then((response) => {
				const data = response.data;
				if (data.status_code === 200) {
					setIsLoading(false);
					const properties = data.result;
					const arrOptions = [];

					const hotelOptions = [];
					const citiesOptions = [];
					const countriesOptions = [
						{
							label: "Nepal",
							value: "Nepal",
						},
					];

					for (let i = 0; i < properties.length; i++) {
						const optionsHotels = {
							label: (
								<span className="label">
									<span className="label__img">
										<img src={iconHotel} alt="Hotel" />
									</span>
									<span className="label__txt">
										<span className="value">{properties[i].property_name}</span>{" "}
										<span className="location">
											{properties[i].city}
											{properties[i].country && `, ${properties[i].country}`}
										</span>
									</span>
								</span>
							),

							value: `${properties[i].property_name}`,
						};
						hotelOptions.push(optionsHotels);
					}
					setOptions(hotelOptions);
				}
			})
			.catch((errors) => {
				console.error(errors);
				setIsLoading(false);
			});
	}, []);

	// ON-CHANGE
	const handleChange = ({ label, value }) => {
		handleChangeSelectDestination(label, value);
	};

	// ON-INPUT-CHANGE
	const handleInputChange = (value) => {
		setInputVal(value);
		//setInputVal(value);

		services.GET.searchSuggestion(value)
			.then((response) => {
				const { data } = response;
				if (data.status_code === 200) {
					const { cities, hotels } = data;
					const hotelOptions = [];
					const citiesOptions = [];
					const countriesOptions = [
						{
							label: "Nepal",
							value: "Nepal",
						},
					];
					for (let i = 0; i < hotels.length; i++) {
						const optionsHotels = {
							label: (
								<div className="label">
									<span className="label__img">
										<img src={iconHotel} alt="Hotel" />
									</span>
									<span className="label__txt">
										<span className="value">{hotels[i].hotel_name}</span>
										<span className="location">
											{hotels[i].city}
											{hotels[i].country && `, ${hotels[i].country}`}
										</span>
									</span>
								</div>
							),
							value: `${hotels[i].hotel_name}`,
						};
						hotelOptions.push(optionsHotels);
					}
					for (let i = 0; i < cities.length; i++) {
						const optionsCities = {
							label: (
								<span className="label">
									<span className="label__img">
										<img src={iconLocation} alt="City" />
									</span>
									<span className="label__txt">
										<span className="value value--city">{cities[i]}</span>
									</span>
								</span>
							),
							value: cities[i],
						};
						citiesOptions.push(optionsCities);
					}

					const groupOptions = [
						{
							label: "Hotels",
							options: hotelOptions,
						},
						{
							label: "Cities",
							options: citiesOptions,
						},
						//{
						//	label: "Country",
						//	options: countriesOptions,
						//},
					];
					setOptions(groupOptions);
				}
			})
			.catch((errors) => {
				console.error(errors);
			});
	};

	const formatGroupLabel = (data) => (
		<div className="select-destination__group-title">{data.label}</div>
	);

	const customStyles = {
		valueContainer: (provided, state) => {
			const opacity = state.isDisabled ? 0.5 : 1;
			const transition = "opacity 300ms";

			return { ...provided, opacity, transition };
		},
	};

	return (
		<>
			<div
				className={`select-destination  ${
					primaryLayout
						? "select-destination--primary"
						: "select-destination--secondary"
				}`}
			>
				<Select
					options={options}
					onChange={onChange}
					onInputChange={handleInputChange}
					placeholder={
						defaultInputValue ? (
							<span className="placeholder--default-input">
								{defaultInputValue}
							</span>
						) : (
							<span className="placeholder">Where are you going?</span>
						)
					}
					react-select-container
					className="select-destination-container"
					classNamePrefix="select-destination"
					autoFocus={true}
					backspaceRemovesValue={true}
					blurInputOnSelect={false}
					formatGroupLabel={formatGroupLabel}
					styles={customStyles}
					//menuIsOpen={options ? true : false}
					isSearchable
				/>
			</div>
		</>
	);
};

export default SelectDestination;
