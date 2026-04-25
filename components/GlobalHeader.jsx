"use client";
import Notify from "../components/Notify";
import { useContext, useState, useEffect } from "react";
import Link from "next/link";
import { IconMenu } from "@tabler/icons-react";
import { useCounterStore } from '../store/useCounterStore'

import { usePathname } from 'next/navigation';
import Image from "next/image";
import { useAuth } from "./auth-context";

const GlobalHeader = () => {

	const { token, notifications, addNotification, cartItems, addCartItems, removeCartItems, resetCartItems, updateCartItems, userDataX, setUserDataX, navToggle, setnavToggle, lang, setlang } = useCounterStore()
	const pathname = usePathname();


	const { user, handleLogout } = useAuth();


	var currentLocation = pathname;

	var currentRoutes = currentLocation.split("/");

	currentRoutes = currentRoutes.filter(function (e) {
		return e.replace(/(\r\n|\n|\r)/gm, "");
	});


	var routesArgs = {
		products: { label: ("Products"), value: "products" },
		dashboard: { label: "", value: "dashboard" },
		orders: { label: ("Orders"), value: "orders" },
		tasks: { label: ("Tasks"), value: "tasks" },
		subscriptions: { label: ("Subscriptions"), value: "subscriptions" },
		licenses: { label: ("Licenses"), value: "licenses" },
		apiKeys: { label: ("API Keys"), value: "apiKeys" },
		ValidationRequests: {
			label: ("Validation Requests"),
			value: "ValidationRequests",
		},
	};

	// addNotifications({
	// 	title: "Data Saved!",
	// 	content: "You change successfully saved!.",
	// 	type: "success",
	// });

	// function addNotifications(notification) {
	// 	var notificationsX = [...notifications];
	// 	notificationsX.push(notification);
	// 	setnotifications(notificationsX);
	// }

	// useEffect(() => {



	// }, [token]);


	useEffect(() => {

		if (token == null) {

			handleLogout()
		}


	}, [token]);

	return (
		<div className="flex gap-4 flex-wrap justify-between items-center bg-gray-200 border-b border-gray-400 p-3 px-5  lg:h-[70px] h-auto">
			<div className="flex items-center gap-2">
				<button
					onClick={() => setnavToggle(!navToggle)}
					className="block  p-2 hover:bg-primary-100/10 rounded-lg">
					<IconMenu className="h-8 w-6 text-primary-400" />
				</button>



				<div className="flex gap-2 items-center justify-between text-gray-500">
					<Link href="/dashboard">{("Dashboard")}</Link>

					{currentRoutes.map((route, index) => {
						return (
							<Link key={`index-${index}`} href={`/${route}`}>
								{" "}
								/{" "}
								{routesArgs[route] == undefined ? route : routesArgs[route].label}
							</Link>
						);
					})}
				</div>
			</div>

			<div className="flex items-center  justify-end gap-4" >



				<div>
					<select
						onChange={(e) => {
							setlang(e.target.value);
						}}
						value={lang}
						className="!text-white  bg-gray-600 hover:bg-gray-700 !py-[10px] ">
						<option value="en">English</option>
						<option value="bn">Bangla</option>
						<option value="hi">Hindi</option>
						<option value="zh">Chinese</option>
						<option value="ja">Japanese</option>
						<option value="es">Spanish</option>
					</select>
					<Notify notifications={notifications} />
				</div>


			</div>
		</div>
	);
};

export default GlobalHeader;
