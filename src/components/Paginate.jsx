import React from "react";
import ReactPaginate from "react-paginate";

const Paginate = (props) => {
	const { className, pageCount, handlePageClick } = props;
	return (
		<div className={` ${className}`}>
			<ReactPaginate
				previousLabel={"previous"}
				nextLabel={"next"}
				breakLabel={"..."}
				breakClassName={"break-me"}
				pageCount={pageCount}
				marginPagesDisplayed={5}
				pageRangeDisplayed={9}
				onPageChange={handlePageClick}
				containerClassName={"pagination-ul"}
				subContainerClassName={"pages pagination"}
				activeClassName={"active"}
			/>
		</div>
	);
};

export default Paginate;
