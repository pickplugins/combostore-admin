import PropTypes from "prop-types";
import React from "react";

const Popover = ({ children, className }) => {
	return <div className={`absolute z-10 shadow-lg min-w-[300px] ${className}`}>{children}</div>;
};

Popover.defaultProps = {
	className: "",
};

Popover.propTypes = {
	className: PropTypes.string,
	children: PropTypes.node.isRequired,
};

export default Popover;
