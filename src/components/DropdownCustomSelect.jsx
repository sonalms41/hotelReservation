import React, { useEffect, useState } from "react";
import { Dropdown } from "semantic-ui-react";
import { toastNotification } from "../utilities";
import services from "./../services";
import CustomLoader from "./CustomLoader";

const DropdownCustomSelect = (props) => {
	const { onChange, onClick, value } = props;
	const [isLoading, setIsLoading] = useState(false);
	const [destination, setDestination] = useState();

	useEffect(() => {
		setIsLoading(true);
		services.GET.topDestinations()
			.then((response) => {
				const data = response.data;
				if (data.status === 200) {
					const data = response.data.result;
					const arrObj = [];
					for (let i = 0; i < data.length; i++) {
						arrObj.push({
							key: i,
							value: data[i].city,
							img: `${process.env.REACT_APP_API_BASE_URL}${data[i].image}`,
							text: data[i].city,
						});
					}
					setDestination(arrObj);
				}
			})
			.catch((errors) => {
				toastNotification.error(errors);
			});
		setIsLoading(false);
	}, []);
	const handleChange = (event, data) => {
		console.log("change-value", event.target.name);
	};

	return (
		<>
			<CustomLoader isLoading={isLoading} />

			<Dropdown
				placeholder="Where are you going"
				fluid
				search
				selection
				options={destination && destination}
				onChange={onChange}
				onClick={onClick}
				value={value}
				onInputChange={() => {
					console.log("input change");
				}}
			/>
		</>
	);
};

export default DropdownCustomSelect;
