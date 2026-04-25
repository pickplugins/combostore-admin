"use client";
import React, { useState } from "react";


const Tabs = (props) => {

  var children = props.children;
  var tabs = props.tabs;
  var orientation = props.orientation;

  var wrapperClass = props.wrapperClass;
  var navsWrapperClass = props.navsWrapperClass;
  var tabPanelClass = props.tabPanelClass;
  var navsItemClass = props.navsItemClass;
  var navsItemActiveClass = props.navsItemActiveClass;


  const [activeTab, setActiveTab] = useState(props?.activeTab);
  const childrenArray = React.Children.toArray(children);


  return (
    <div className={`${wrapperClass} w-full  mx-auto ${orientation == 'vertical' ? "lg:flex align-top" : ""}`}>
      <div className={`flex ${orientation == 'vertical' ? " lg:flex-col mb-4 lg:flex-nowrap flex-wrap" : ""} ${navsWrapperClass}`}>
        {tabs.map((tab, index) => (
          <div
            key={index}
            className={`cursor-pointer ${navsItemClass}  ${activeTab === index
              ? navsItemActiveClass
              : " "
              }`}
            onClick={() => setActiveTab(index)}
          >
            <div>{tab.icon}</div>

            <div>{tab.label}</div>
          </div>
        ))}
      </div>
      <div className={`${tabPanelClass} ${orientation == 'vertical' ? "flex-1 " : ""}`}>
        {childrenArray.find(child => child.props.index === activeTab)}
      </div>
    </div>


  );
};

export default Tabs;
