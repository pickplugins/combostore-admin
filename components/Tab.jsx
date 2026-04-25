"use client";
import React, { useState } from "react";


const Tab = ({ index, children }) => {
  const [activeTab, setActiveTab] = useState(0);


  return (
    <div index={index}>{children}</div>

  );
};

export default Tab;
