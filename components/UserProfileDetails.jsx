"use client";
import { useState, useEffect, useContext } from "react";
import Link from "next/link";
import Image from "next/image";
import { useAuth } from "./auth-context";
import { useCounterStore } from 'store/useCounterStore'
import LocationPicker from "./LocationPicker";
import Spinner from "/components/Spinner";


const UserProfileDetails = () => {
	const { handleLogout } = useAuth();

	const serverUrl = process.env.NEXT_PUBLIC_SERVER_URL;
	const { token, appData, notifications, addNotification, cartItems, addCartItems, removeCartItems, resetCartItems, updateCartItems, userDataX, setUserDataX, navToggle, setnavToggle } = useCounterStore()



	const [loading, setloading] = useState(false);
	var [userRoles, setuserRoles] = useState(null);


	useEffect(() => {

		if (userDataX != undefined || userDataX != null) {

			var roles = [];

			Object.entries(userDataX?.roles).map(args => {

				var role = args[1]

				roles.push(role)

			})

			setuserRoles(roles);

		}
	}, [userDataX]);


	function join_as_affiliate() {



		if (!token) {
			throw new Error("No token found");
		}



		var postData = {
			id: userDataX.id,

		};

		postData = JSON.stringify(postData);

		fetch(serverUrl + "wp-json/combo-store/v2/become_affiliates", {
			method: "POST",
			headers: {
				'Content-Type': 'application/json',
				'Authorization': `Bearer ${token}`
			},
			body: postData,
		})
			.then((response) => {
				if (response.ok && response.status < 400) {
					response.json().then((res) => {




						// seteditUserData({ ...res })



						setTimeout(() => {
							//window.location.reload();

						}, 500);
					});
				}
			})
			.catch((_error) => {
				//this.saveAsStatus = 'error';
				// handle the error
			});

	}
	function remove_affiliates() {



		if (!token) {
			throw new Error("No token found");
		}



		var postData = {
			id: userDataX.id,

		};

		postData = JSON.stringify(postData);

		fetch(serverUrl + "wp-json/combo-store/v2/remove_affiliates", {
			method: "POST",
			headers: {
				'Content-Type': 'application/json',
				'Authorization': `Bearer ${token}`
			},
			body: postData,
		})
			.then((response) => {
				if (response.ok && response.status < 400) {
					response.json().then((res) => {




						// seteditUserData({ ...res })



						setTimeout(() => {
							//window.location.reload();

						}, 500);
					});
				}
			})
			.catch((_error) => {
				//this.saveAsStatus = 'error';
				// handle the error
			});

	}







	return (
		<div className=" ">
			<div className="lg:w-[900px] mx-auto">
				<div className="flex flex-col gap-5">

					<div className=" bg-[#9a90ff] rounded-sm p-5 ">
						<div className="flex flex-wrap justify-between">
							<h3 className="mb-5 text-2xl ">{("General Information")}</h3>

							<div className="flex items-center gap-3 mb-5">

								{loading && (

									<div className="bg-[#1b0e9f] px-2 py-2 rounded-sm"><Spinner /></div>

								)}

								<Link className="p-2  rounded-sm cursor-pointer px-4 bg-[#1b0e9f] text-white" href={`/edit-profile/`}>
									{("Edit")}
								</Link>

								<div
									className="p-2 inline hover:bg-red-500 rounded-sm cursor-pointer px-4 bg-red-400 text-white"
									onClick={(ev) => {
										handleLogout();
									}}>
									{("Logout")}
								</div>
							</div>
						</div>

						<div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
							<div className="">
								<label htmlFor="" className="font-bold">
									{("Your Name")}
								</label>
								<div>{userDataX?.name}</div>
							</div>
							{/* <div className="">
								<label htmlFor="" className="font-bold">
									{("First Name")}
								</label>
								<div>{userDataX?.first_name}</div>
							</div>

							<div className="">
								<label htmlFor="" className="font-bold">
									{("Last Name")}
								</label>
								<div>{userDataX?.last_name}</div>
							</div> */}
							<div className="">
								<label htmlFor="" className="font-bold">
									{("Email")}
								</label>
								<div>{userDataX?.email}</div>
							</div>

							<div className="">
								<label htmlFor="" className="font-bold">
									{("Phone")}
								</label>
								<div>{userDataX?.phone}</div>
							</div>
						</div>

						<h3 className="my-10 text-2xl ">Address</h3>

						<div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
							<div className="">
								<label htmlFor="" className="font-bold">
									{("Address 1")}
								</label>
								<div>{userDataX?.address_1}</div>
							</div>
							<div className="">
								<label htmlFor="" className="font-bold">
									{("Address 2")}
								</label>
								<div>{userDataX?.address_2}</div>
							</div>

							{/* <div className="">
								<label htmlFor="" className="font-bold">
									{("Zip Code")}
								</label>
								<div>{userDataX?.zip_code}</div>
							</div> */}
							<div className="">
								<label htmlFor="" className="font-bold">
									{("City")}
								</label>
								<div>{userDataX?.city}</div>
							</div>
							{/* <div className="">
								<label htmlFor="" className="font-bold">
									{("Country")}
								</label>
								<div>{userDataX?.country}</div>
							</div> */}
						</div>



					</div>


					{userDataX?.delivery_location && (
						<div className=" bg-[#9a90ff]  rounded-sm p-5 ">
							<div className="flex-col 2xl:flex-row gap-3 2xl:flex gap-5 justify-between align-middle items-center pb-5">
								<h3 className=" text-2xl ">{("Delivery Location")}</h3>
								<Link className="p-2  rounded-sm cursor-pointer px-4 bg-[#1b0e9f] text-white" href={`/edit-profile/`}>
									{("Edit")}
								</Link>
							</div>

							<LocationPicker enableSearch={false} latlng={userDataX?.delivery_location} />
						</div>
					)}
					{!userDataX?.delivery_location && (
						<div className=" bg-[#9a90ff]  rounded-sm p-5">
							<h3 className="mb-5 text-2xl ">{("Delivery Location")}</h3>

							<p>You haven't set any delivery location.</p>

							<LocationPicker />
						</div>
					)}






				</div>
			</div>
		</div>
	);
}

export default UserProfileDetails