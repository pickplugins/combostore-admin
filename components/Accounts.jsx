"use client";
import { useContext, useEffect, useState } from "react";
import Link from 'next/link';
import { useAuth } from "./auth-context";

import {
	IconLogout,
	IconDatabaseSmile,
	IconShoppingCart,
} from "@tabler/icons-react";
import { useCounterStore } from '../store/useCounterStore'

//hello
const Accounts = () => {


	const serverUrl = process.env.NEXT_PUBLIC_SERVER_URL;
	const { token, appData, notifications, addNotification, cartItems, addCartItems, removeCartItems, resetCartItems, updateCartItems, userDataX, setUserDataX, navToggle, setnavToggle } = useCounterStore()


	const { user, handleLogout } = useAuth();



	var [buyCreditsPrams, setbuyCreditsPrams] = useState({ showPopup: false });
	var [hasCredit, sethasCredit] = useState(true);
	const [creditShow, setCreditShow] = useState(false);

	// useEffect(() => {
	// 	var remining = userDataX?.total_credit - userDataX?.total_credit_used;

	// 	if (remining <= 0) sethasCredit(false);
	// }, [hasCredit]);








	return (
		<div className="border-t pt-4">

			<div className="flex gap-3 flex-col">


				{userDataX?.id && (
					<div className="flex items-center gap-4 flex-wrap">

						<div className="flex w-full justify-between items-center gap-2">
							<div className="flex items-center gap-3">
								<div className="rounded-full overflow-hidden border border-gray-500 w-10 h-10">
									<img
										className=""
										src={userDataX?.avatar}
										alt={userDataX?.name}
									/>
								</div>
								<div className="text-white">{userDataX?.name}</div>
							</div>
							<div
								className="p-2 inline hover:bg-red-600 rounded-sm cursor-pointer px-4 bg-red-400 text-white"
								onClick={(ev) => {
									handleLogout();
								}}>
								<IconLogout size={16} />
							</div>
						</div>

					</div>
				)}

				{JSON.stringify(token)}


				{!userDataX?.id && (
					<div
						className="p-2 hover:bg-gray-400 rounded-sm cursor-pointer px-4 bg-gray-600 text-white"
						onClick={(ev) => {
							handleLogout();
						}}>
						{("Logout")}
					</div>
				)}


			</div>
		</div>
	);
};

export default Accounts;
