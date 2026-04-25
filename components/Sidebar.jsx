"use client";
import Image from "next/image";

import Link from 'next/link';
import React from 'react'
import ToggleNavs from "./ToggleNavs";
import Accounts from "./Accounts";
import {
	IconBasketCheck,
	IconStarHalfFilled,
	IconAdjustmentsAlt,
	IconTrolley,
	IconDashboard,
	IconSnowboarding,
	IconRotateRectangle,
	IconX,
	IconSubtask,
	IconShoppingBagHeart, IconMessageUser,
	IconBuildingStore,
	IconTags,
	IconUserPin,
	IconTruckDelivery,
	IconRosetteDiscount,
	IconBike,
	IconReceiptRefund,
	IconUserDollar,
	IconBox,
	IconNews,
	IconMessage,
	IconList,
	IconDeviceDesktopAnalytics,
	IconActivityHeartbeat,
	IconUsersGroup,
} from "@tabler/icons-react";

import { useCounterStore } from '../store/useCounterStore'

import VersionUpdateBanner from "./VersionUpdateBanner";



const Sidebar = () => {


	const serverUrl = process.env.NEXT_PUBLIC_SERVER_URL;
	const { token, appData, notifications, addNotification, cartItems, addCartItems, removeCartItems, resetCartItems, updateCartItems, userDataX, setUserDataX, navToggle, setnavToggle } = useCounterStore()

	var navs = [
		{ label: ("Dashboard"), value: "/", icon: <IconDashboard />, roles: ['administrator'] },

		{ label: ("Onboard"), value: "onboard", icon: <IconSnowboarding />, roles: ['administrator'] },

	];








	return (
		<>
			{navToggle && (
				<aside className="flex flex-col gap-4 w-[300px] bg-gray-700 text-gray-800 p-4">


					<div className=" pb-3 block mb-5 border-b relative">


						<div className="flex gap-3 justify-between items-center mb-3">

							<div
								className={` md:block text-3xl flex gap-3 justify-between items-center w-full`}>
								<div className="flex gap-3 items-center justify-between">
									<Link href={`/`} className="text-center">
										<Image

											src="/logo-h.png"
											className="mx-auto" width={200} height={`50`} alt=""
											priority
										/>
									</Link>
								</div>
							</div>

							<div
								onClick={() => setnavToggle(!navToggle)}
								className="md:hidden p-1 rounded-lg text-error-500  bg-red-500 !hover:bg-red-600 text-white">
								<IconX className=" text-white" />
							</div>
						</div>




					</div>
					{/* 
			{JSON.stringify(userDataX)}
			{JSON.stringify(token)} */}



					<div>

						<ToggleNavs navs={navs} key={`hello`} />
						<Accounts />
					</div>

					{/* 
					{token && (
						<div>

							<ToggleNavs navs={navs} key={`hello`} />
							<Accounts />
						</div>
					)} */}

					<VersionUpdateBanner />






				</aside>
			)}

		</>
	);
}

export default Sidebar