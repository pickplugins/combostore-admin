import PropTypes from "prop-types";
import React from "react";
import { useState, useEffect } from "react";
import { IconLibraryPhoto, IconCheckbox, IconSquare, IconFidgetSpinner, IconTrash, IconStarFilled, IconStar, IconX } from "@tabler/icons-react";


const PopoverButton = (props) => {




	var onTriggerOpen = props?.onTriggerOpen;

	var title = props.title;
	var prams = props.prams;
	var buttonIcon = props.buttonIcon;
	var wrapperClass = props.wrapperClass;
	var children = props.children;
	var buttonLabel = props.buttonLabel ? props.buttonLabel : "Click";
	var buttonClass = props.buttonClass ? props.buttonClass : "hover:bg-gray-400 rounded-sm cursor-pointer px-4 py-2 bg-gray-600 text-white";
	var position = props.position;
	var enableCloseBtn = props.enableCloseBtn ?? true;
	var popoverClass = props.popoverClass ? props.popoverClass : `max-h-[600px] bg-white overflow-y-auto z-[999] border-2 border-solid border-indigo-600 rounded-sm ${position ? "absolute" : "mx-auto sm:w-3/4 md:w-2/4 fixed inset-x-0 top-10"} `;

	const [isOpen, setIsOpen] = useState(false);

	var positionClass = "";

	if (position == 'topLeft') {
		var positionClass = "left-0 bottom-full";

	}
	if (position == 'topRight') {
		var positionClass = " bottom-full right-0";

	}
	if (position == 'bottomLeft') {
		var positionClass = " left-0 top-full";

	}
	if (position == 'bottomRight') {
		var positionClass = "right-0 top-full";

	}


	return <div className={`relative ${wrapperClass}`}>

		<div className={`${buttonClass} flex gap-2 w-max`} onClick={ev => {
			if (onTriggerOpen) {
				onTriggerOpen(isOpen, prams)
			}

			setIsOpen(!isOpen)
		}}>
			{buttonIcon}
			{buttonLabel}</div>

		{isOpen && (
			<div className={` ${popoverClass} ${positionClass} `}>

				<div className="flex justify-between bg-gray-700 p-2">
					<div className="text-white">{title}</div>
					{enableCloseBtn && (
						<div className=" bg-red-400 text-white px-1 py-1 rounded-sm cursor-pointer" onClick={ev => {

							if (onTriggerOpen) {
								onTriggerOpen(isOpen, prams)
							}
							setIsOpen(!isOpen)

						}}>
							<IconX />
						</div>
					)}

				</div>
				<div>
					{children}
				</div>
			</div>

		)}

	</div>;
};



export default PopoverButton;
