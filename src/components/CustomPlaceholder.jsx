import React, { useState, useEffect } from "react";
import { Grid, Placeholder, Segment, Card } from "semantic-ui-react";

// PLACEHOLDER-GRID
export const PlaceholderGrid = (props) => {
	const { count } = props;
	const [gridCount, setGridCount] = useState([1]);
	useEffect(() => {
		const arrGrid = [];
		for (let i = 0; i < count; i++) {
			arrGrid.push(i);
		}
		setGridCount(arrGrid);
	}, [count]);
	return (
		<Grid columns={count} stackable>
			{gridCount.map((grid, i) => {
				return (
					<Grid.Column key={`g-count-${i}`}>
						<Segment raised>
							<Placeholder>
								<Placeholder.Header image>
									<Placeholder.Line />
									<Placeholder.Line />
								</Placeholder.Header>
								<Placeholder.Paragraph>
									<Placeholder.Line length="medium" />
									<Placeholder.Line length="short" />
								</Placeholder.Paragraph>
							</Placeholder>
						</Segment>
					</Grid.Column>
				);
			})}
		</Grid>
	);
};

// PLACEHOLDER-CARD
export const PlaceholderCard = (props) => {
	const { count } = props;
	const [cardArr, setCardArr] = useState([1]);
	useEffect(() => {
		const arr = [];
		for (let i = 0; i < count; i++) {
			arr.push(i);
		}
		setCardArr(arr);
	}, []);
	return (
		<Card.Group itemsPerRow={count}>
			{cardArr.map((grid, i) => {
				return (
					<Card key={`p-card--${i}`}>
						<Card.Content>
							<Placeholder>
								<Placeholder.Image square />
							</Placeholder>
						</Card.Content>
					</Card>
				);
			})}
		</Card.Group>
	);
};

// PLACEHOLDER-FLUID
export const PlaceholderPluid = (props) => {
	const { count } = props;
	const [cardArr, setCardArr] = useState([1]);
	useEffect(() => {
		const arr = [];
		for (let i = 0; i < count; i++) {
			arr.push(i);
		}
		setCardArr(arr);
	}, []);
	return (
		<Placeholder fluid>
			<Placeholder.Header image>
				<Placeholder.Line />
				<Placeholder.Line />
			</Placeholder.Header>
			<Placeholder.Paragraph>
				<Placeholder.Line />
				<Placeholder.Line />
				<Placeholder.Line />
			</Placeholder.Paragraph>
		</Placeholder>
	);
};
