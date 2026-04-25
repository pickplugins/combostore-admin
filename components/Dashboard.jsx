"use client";
import { useState, useEffect, Component } from "react";
import Image from "next/image";
import NumberFlow from '@number-flow/react'

import {
  IconClipboardList,
  IconPackages,
  IconCreditCardRefund,
  IconAdjustmentsHorizontal,
  IconRosetteDiscount,
  IconTruckDelivery,
  IconRefresh,
  IconDeviceDesktopAnalytics,
  IconFilterStar,
  IconTax,
  IconChevronLeft,
  IconChevronRight,
  IconUserCircle,
  IconBasketCheck,
  IconBasketDollar,
  IconShoppingBagExclamation,
  IconChartInfographic,
  IconCreditCardPay,
} from "@tabler/icons-react";
import Spinner from '../components/Spinner';
import WidgetWrapper from '../components/WidgetWrapper';
import PopoverButton from '../components/PopoverButton';
import { useCounterStore } from '../store/useCounterStore'
import { useUtilsStore } from '../store/useUtilsStore';


const serverUrl = process.env.NEXT_PUBLIC_SERVER_URL;


const Dashboard = (props) => {

  const { token, settings, appData, notifications, addNotification, userDataX, setUserDataX } = useCounterStore()
  const { wrapCurrency } = useUtilsStore()




  var [queryPrams, setqueryPrams] = useState({ keyword: "", range: '7days', paged: 1, order: "DESC", per_page: 10, first_date: "", last_date: "" });








  return (
    <div className="">

      {token && (
        <div className="p-5 lg:p-10 bg-gray-300">



          Dashboard







        </div>
      )}


    </div>
  );
};

export default Dashboard;