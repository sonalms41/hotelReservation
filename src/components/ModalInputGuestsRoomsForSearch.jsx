import React, { useState } from "react";
import Modal from "@material-ui/core/Modal";

const ModalInputGuestsRoomsForSearch = (props) => {
	const {
		updateSearchGRinputField,
		guestsAndRooms,
		setGuestsAndRooms,
		showModal,
		closeModal,
	} = props;
	const addAdult = (i) => {
		const updatedGuests = [...guestsAndRooms];
		updatedGuests[i].nAdults += 1;
		setGuestsAndRooms(updatedGuests);
	};
	const reduceAdult = (i) => {
		const updatedGuests = [...guestsAndRooms];
		updatedGuests[i].nAdults =
			updatedGuests[i].nAdults <= 1 ? 1 : updatedGuests[i].nAdults - 1;
		setGuestsAndRooms(updatedGuests);
	};
	const addChild = (i) => {
		const updatedGuests = [...guestsAndRooms];
		updatedGuests[i].nChilds += 1;
		setGuestsAndRooms(updatedGuests);
	};
	const reduceChild = (i) => {
		const updatedGuests = [...guestsAndRooms];
		updatedGuests[i].nChilds =
			!updatedGuests[i].nChilds <= 0 ? updatedGuests[i].nChilds - 1 : 0;
		setGuestsAndRooms(updatedGuests);
	};

	const handleRemoveRoom = (roomIndex) => {
		const filterRoom = guestsAndRooms.filter((item) => {
			return guestsAndRooms.indexOf(item) !== roomIndex;
		});
		setGuestsAndRooms(filterRoom);
	};
	return (
		<Modal open={showModal} className="os-modal-primary">
			<div className="entry-card entry-search-guest">
				<div className="entry-card__header flex-aC-jSB">
					<h3>Guests & Rooms</h3>
					<button className="utl-btn-colose-modal" onClick={closeModal}>
						X
					</button>
				</div>
				<div className="entry-card__body">
					<div className="card__row ">
						{guestsAndRooms &&
							guestsAndRooms.map((guest, i) => {
								return (
									<div
										className={`entry-card__search-item entry-card-${i + 1}`}
										key={`sdfdsfs-${i}`}
									>
										<div className="item__row">
											<h3 className="flex-aC-jSB">
												<span>Room {i + 1}</span>
											</h3>
										</div>
										<div className="item__row flex-aC-jSB">
											<div className="guest-category">
												<span>Adult</span>
											</div>
											<div className="guest-number-as flex-aC-jSB">
												<button
													className="utl-btn-fourth  utl-btn"
													onClick={() => reduceAdult(i)}
												>
													-
												</button>
												<span className="guest-no">{guest.nAdults}</span>
												<button
													className="utl-btn-fourth  utl-btn"
													onClick={() => addAdult(i)}
												>
													+
												</button>
											</div>
										</div>
										<div className="item__row flex-aC-jSB">
											<div className="guest-category flex-ffC">
												<span>Child</span>
												<span className="child-age">2-12 years</span>
											</div>
											<div className="guest-number-as flex-aC-jSB">
												<button
													className="utl-btn-fourth utl-btn "
													onClick={() => reduceChild(i)}
												>
													-
												</button>
												<span className="guest-no">{guest.nChilds}</span>
												<button
													className="utl-btn-fourth utl-btn "
													onClick={() => addChild(i)}
												>
													+
												</button>
											</div>
										</div>
										<div className="item__row item__row-last">
											<span onClick={() => handleRemoveRoom(i)}>
												Remove This Room
											</span>
										</div>
									</div>
								);
							})}
					</div>
					<div className="card__row">
						<button
							className="utl-btn-fourth utl-btn btn-add-room"
							onClick={() => {
								setGuestsAndRooms([
									...guestsAndRooms,
									{
										nRooms: guestsAndRooms.length + 1,
										nChilds: 0,
										nAdults: 0,
									},
								]);
							}}
						>
							+ Add Room
						</button>
					</div>
					<div className="card__row">
						<button
							className="utl-btn utl-btn-primary"
							onClick={updateSearchGRinputField}
						>
							Update
						</button>
					</div>
				</div>
			</div>
		</Modal>
	);
};

export default ModalInputGuestsRoomsForSearch;
