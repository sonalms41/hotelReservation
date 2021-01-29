import React, { useState } from "react";
import Truncate from "react-truncate";
const TruncateContent = (props) => {
	const { children, lines, more, less } = props;
	const [truncated, setTruncated] = useState(false);
	const [expanded, setExpanded] = useState(false);

	const handleTruncate = (truncatedVal) => {
		if (truncated !== truncatedVal) {
			setTruncated(truncatedVal);
		}
	};

	const toggleLines = (e) => {
		e.preventDefault();
		setExpanded(!expanded);
	};

	return (
		<div>
			<Truncate
				lines={!expanded && lines}
				ellipsis={
					<span>
						...
						<a className="utl-anchor" href="#" onClick={toggleLines}>
							{more}
						</a>
					</span>
				}
				onTruncate={handleTruncate}
			>
				{children}
			</Truncate>
			{!truncated && expanded && (
				<span>
					<a className="utl-anchor" href="#" onClick={toggleLines}>
						{less}
					</a>
				</span>
			)}
		</div>
	);
};

export default TruncateContent;
