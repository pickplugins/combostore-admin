"use client";
import React, { useState } from "react";
import { IconChevronDown, IconChevronUp, IconSquare, IconUsersPlus, IconTrash, IconTrolley, IconClockPause, IconExclamationCircle, IconRosetteDiscountCheck, IconX, IconSquareRoundedPlusFilled, IconSquareRoundedMinusFilled, IconStarFilled, IconStar, IconSearch, IconShoppingCartCancel, IconLetterX, IconArrowNarrowRightDashed, IconArrowNarrowLeftDashed, IconMail, IconPhone, IconAddressBook, IconGrid3x3 } from "@tabler/icons-react";


const WidgetWrapper = (props) => {

  var title = props.title;
  var children = props.children;
  var collapsible = props.collapsible;
  var customHeader = props.customHeader;

  const [isCollapsed, setIsCollapsed] = useState(true);

  return (
    <div className="flex flex-col gap-4 bg-white rounded-sm shadow-sm">

      <div className="flex p-3 items-center justify-between border-b border-gray-200">

        {customHeader && (
          <>{customHeader}</>
        )}
        {!customHeader && (
          <h2 className="text-xl font-semibold text-gray-600">{title}</h2>

        )}



        {collapsible && (
          <div className="flex items-center gap-2 cursor-pointer">
            {isCollapsed && (<IconChevronUp onClick={() => setIsCollapsed(false)} />
            )}
            {!isCollapsed && (
              <IconChevronDown onClick={() => setIsCollapsed(true)} />
            )}
          </div>
        )}
      </div>

      {collapsible && (
        <>
          {isCollapsed && (
            <div className="p-3">
              {children}
            </div>
          )}




        </>
      )}
      {!collapsible && (
        <div className="p-3">
          {children}
        </div>
      )}




    </div>

  );
};

export default WidgetWrapper;
