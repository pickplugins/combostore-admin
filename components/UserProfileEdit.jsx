"use client";

import { useState, useEffect, useContext } from "react";
import Spinner from "../components/Spinner";
import { IconChevronDown, IconChevronUp, IconSquare, IconFidgetSpinner, IconTrash, IconStarFilled, IconStar, IconClockPause, IconExclamationCircle, IconRosetteDiscountCheck, IconX } from "@tabler/icons-react";
import { useCounterStore } from '../store/useCounterStore'

import LocationPicker from "../components/LocationPicker";
import WidgetWrapper from '../components/WidgetWrapper';


const UserProfileEdit = ({ userid }) => {




	const serverUrl = process.env.NEXT_PUBLIC_SERVER_URL;
	const { token, appData, notifications, addNotification, cartItems, addCartItems, removeCartItems, resetCartItems, updateCartItems, userDataX, setUserDataX, navToggle, setnavToggle } = useCounterStore()



	var [editUserData, seteditUserData] = useState(null);
	var [passwordData, setpasswordData] = useState({ currentPass: "", newPass1: "", newPass2: "", passMatched: false, passUpdate: false, loading: false });

	const [loading, setloading] = useState(false);




	function updateUserProfile() {
		setloading(true);



		if (!token) {
			//throw new Error("No token found");
		}
		var postData = {
			id: userid,
			userData: editUserData,

		};


		postData = JSON.stringify(postData);

		fetch(serverUrl + "wp-json/combo-store/v2/update_user_profile", {
			method: "POST",
			headers: {
				'Content-Type': 'application/json',
				'Authorization': `Bearer ${token}`
			},
			body: postData,
		})
			.then((response) => {

				if (!response.ok) {
					throw new Error('Token validation failed');
				}

				if (response.ok && response.status < 400) {
					response.json().then((res) => {

						addNotification({ type: 'success', title: 'Profile Updated', content: "Your information updated successful." })

						setTimeout(() => {
							setloading(false);
						}, 500);
					});
				}
			})
			.catch((_error) => {
				//this.saveAsStatus = 'error';
				// handle the error
			});

	}

	function getUserProfile() {


		if (!token) {
			//throw new Error("No token found");
		}

		setloading(true);


		var postData = {
			id: userid,

		};

		postData = JSON.stringify(postData);

		fetch(serverUrl + "wp-json/combo-store/v2/get_customer", {
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


						seteditUserData({ ...res.customer })


						setTimeout(() => {
							setloading(false);

						}, 500);
					});
				}
			})
			.catch((_error) => {
				//this.saveAsStatus = 'error';
				// handle the error
			});

	}
	function updateUserPassword() {


		if (!token) {
			throw new Error("No token found");
		}
		if (passwordData.newPass1 !== passwordData.newPass2) {
			setpasswordData({ ...passwordData, passMatched: false, errors: ("Password doesn't match."), passUpdate: false, });

			addNotification({ type: 'error', title: 'Password update failed', content: "Password doesn't match." })

			return;
		}


		setpasswordData({ ...passwordData, loading: true, });

		setloading(true);


		var postData = {
			id: userDataX.id,
			old_password: passwordData.currentPass,
			new_password: passwordData.newPass1,


		};

		postData = JSON.stringify(postData);

		fetch(serverUrl + "wp-json/combo-store/v2/update_user_password", {
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



						var success = res?.success
						var errors = res?.errors


						if (errors?.length > 0) {
							setpasswordData({ ...passwordData, passUpdate: false, loading: false, });
							addNotification({ type: 'error', title: 'Update failed', content: errors })
						}
						if (success?.length > 0) {
							setpasswordData({ ...passwordData, passUpdate: true, loading: false, });
							addNotification({ type: 'success', title: 'Password updated', content: success })
						}








						setTimeout(() => {
							setloading(false);

						}, 500);
					});
				}
			})
			.catch((_error) => {
				//this.saveAsStatus = 'error';
				// handle the error
			});

	}


	useEffect(() => {
		getUserProfile();
	}, []);





	return (
		<div className=" ">
			<div className="lg:w-[900px] mx-auto">
				<div className="flex flex-col gap-5">





					<WidgetWrapper collapsible={true} title="General Information">

						<div className=" flex items-center justify-end gap-2">

							{loading && (

								<div className="bg-[#1b0e9f] px-2 py-2 rounded-sm"><Spinner /></div>

							)}

							<div

								onClick={(ev) => {
									ev.preventDefault();

									updateUserProfile();
								}}
								className="p-2 inline hover:bg-[#1b0e9f] rounded-sm cursor-pointer px-4 bg-[#1b0e9f] text-white"
							>
								{("Update Profile")}

							</div>

						</div>




						<form action="" className="p-5">

							<div className="flex flex-col gap-10">

								<div className="grid grid-cols-1 lg:grid-cols-2 gap-8">



									<div className="">
										<label htmlFor="" className=" ">
											{("User Name")}
										</label>
										<input
											type="text"
											name="name"
											className=" px-2 py-1 rounded-sm w-full !border-2 border-solid border-gray-400 !shadow-none !outline-none focus:border-0"
											value={editUserData?.name}
											onChange={(ev) => {
												const { name, value } = ev.target;
												seteditUserData(prev => ({
													...prev,
													[name]: value
												}));

											}}
										/>
									</div>
									{/* <div className="">
									<label htmlFor="" className=" ">
										{("First Name")}
									</label>
									<input
										type="text"
											name="first_name"

										className=" px-2 py-1 rounded-sm w-full !border-2 border-solid border-gray-400 !shadow-none !outline-none focus:border-0"
										value={editUserData?.first_name}
										onChange={(ev) => {
											const { name, value } = ev.target;
												seteditUserData(prev => ({
													...prev,
													[name]: value
												}));
										}}
									/>
								</div>

								<div className="">
									<label htmlFor="" className=" text-lg">
										{("Last Name")}
									</label>
									<input
										type="text"
											name="last_name"

										className=" px-2 py-1 rounded-sm w-full !border-2 border-solid border-gray-400 !shadow-none !outline-none focus:border-0"
										value={editUserData?.last_name}
										onChange={(ev) => {
										const { name, value } = ev.target;
												seteditUserData(prev => ({
													...prev,
													[name]: value
												}));
										}}
									/>
								</div> */}
									<div className="">
										<label htmlFor="" className=" ">
											{("Email")}
										</label>
										<input
											type="text"
											name="email"

											disabled
											className=" px-2 py-1 rounded-sm w-full  !border-2 border-solid border-gray-400 !shadow-none !outline-none focus:border-0"
											value={editUserData?.email}
											onChange={(ev) => {
												const { name, value } = ev.target;
												seteditUserData(prev => ({
													...prev,
													[name]: value
												}));
											}}
										/>
									</div>


								</div>


								<div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
									<div className="">
										<label htmlFor="" className=" ">
											{("Address 1")}
										</label>
										<input
											type="text"
											name="address_1"

											className=" px-2 py-1 rounded-sm w-full !border-2 border-solid border-gray-400 !shadow-none !outline-none focus:border-0"
											value={editUserData?.address_1}
											onChange={(ev) => {
												const { name, value } = ev.target;
												seteditUserData(prev => ({
													...prev,
													[name]: value
												}));
											}}
										/>
									</div>
									<div className="">
										<label htmlFor="" className=" ">
											{("Address 2")}
										</label>
										<input
											type="text"
											name="address_2"

											className=" px-2 py-1 rounded-sm w-full !border-2 border-solid border-gray-400 !shadow-none !outline-none focus:border-0"
											value={editUserData?.address_2}
											onChange={(ev) => {
												const { name, value } = ev.target;
												seteditUserData(prev => ({
													...prev,
													[name]: value
												}));
											}}
										/>
									</div>

									{/* <div className="">
									<label htmlFor="" className=" ">
										{("Zip Code")}
									</label>
									<input
										type="text"
											name="zip_code"

										className=" px-2 py-1 rounded-sm w-full !border-2 border-solid border-gray-400 !shadow-none !outline-none focus:border-0"
										value={editUserData?.zip_code}
										onChange={(ev) => {
									const { name, value } = ev.target;
												seteditUserData(prev => ({
													...prev,
													[name]: value
												}));
										}}
									/>
								</div> */}
									<div className="">
										<label htmlFor="" className=" ">
											{("City")}
										</label>
										<input
											type="text"
											name="city"

											className=" px-2 py-1 rounded-sm w-full !border-2 border-solid border-gray-400 !shadow-none !outline-none focus:border-0"
											value={editUserData?.city}
											onChange={(ev) => {
												const { name, value } = ev.target;
												seteditUserData(prev => ({
													...prev,
													[name]: value
												}));
											}}
										/>
									</div>
									{/* <div className="">
									<label htmlFor="" className=" ">
										{("Country")}
									</label>
									<input
										type="text"
											name="country"

										className=" px-2 py-1 rounded-sm w-full !border-2 border-solid border-gray-400 !shadow-none !outline-none focus:border-0"
										value={editUserData?.country}
										onChange={(ev) => {
											const { name, value } = ev.target;
												seteditUserData(prev => ({
													...prev,
													[name]: value
												}));
										}}
									/>
								</div> */}

									<div className="">
										<label htmlFor="" className=" ">
											{("Phone")}
										</label>
										<input
											type="text"
											name="phone"

											className=" px-2 py-1 rounded-sm w-full !border-2 border-solid border-gray-400 !shadow-none !outline-none focus:border-0"
											value={editUserData?.phone}
											onChange={(ev) => {
												const { name, value } = ev.target;
												seteditUserData(prev => ({
													...prev,
													[name]: value
												}));
											}}
										/>
									</div>
								</div>
							</div>


						</form>

					</WidgetWrapper>


					<WidgetWrapper collapsible={true} title="Delivery Location">




						<div className="flex flex-col gap-4">

							<div className="flex-col 2xl:flex-row 2xl:flex gap-3 justify-between">

								<div className="flex justify-between items-center gap-4 ">

									<div className="text-red-400 cursor-pointer" onClick={ev => {
										seteditUserData({ ...editUserData, delivery_location: null });

									}}>Reset</div>

									<div

										onClick={(ev) => {
											ev.preventDefault();

											updateUserProfile();
										}}
										className="p-2 inline hover:bg-[#1b0e9f] rounded-sm cursor-pointer px-4 bg-[#1b0e9f] text-white"
									>
										{("Update")}

									</div>


								</div>
							</div>



							{editUserData?.delivery_location && (
								<div className=" bg-[#9a90ff]  rounded-sm p-3">
									<p>You haven't set any delivery location.</p>
								</div>
							)}



							<LocationPicker markerDraggable={true} latlng={editUserData?.delivery_location} onLocationSelect={(coords) => {




								seteditUserData(prev => ({ ...prev, delivery_location: coords }));



							}} />
						</div>


					</WidgetWrapper>

					<WidgetWrapper collapsible={true} title="Change Password">
						<form className="grid grid-cols-1 gap-8">
							<div>
								<label htmlFor="" className="block  ">
									{("Current Password")}
								</label>
								<input
									type="password"
									className=" px-2 py-1 rounded-sm w-full !border-2 border-solid border-gray-400 !shadow-none !outline-none focus:border-0"
									onChange={(ev) => {
										var value = ev.target.value;
										setpasswordData({ ...passwordData, currentPass: value });
									}}
								/>
							</div>
							<div>
								<label htmlFor="" className="block ">
									{("New Password")}
								</label>
								<input
									type="password"
									className=" px-2 py-1 rounded-sm w-full !border-2 border-solid border-gray-400 !shadow-none !outline-none focus:border-0"
									onChange={(ev) => {
										var value = ev.target.value;
										setpasswordData({ ...passwordData, newPass1: value });
									}}
								/>
							</div>
							<div>
								<label htmlFor="" className="block ">
									{("Confirm Password")}
								</label>
								<input
									type="password"
									className=" px-2 py-1 rounded-sm w-full !border-2 border-solid border-gray-400 !shadow-none !outline-none focus:border-0"
									onChange={(ev) => {
										var value = ev.target.value;




										if (passwordData.newPass1 == value) {
											setpasswordData({ ...passwordData, newPass2: value, passMatched: true });

										} else {
											setpasswordData({ ...passwordData, newPass2: value, passMatched: false, errors: ("Password doesn't match.") });

										}


									}}
								/>


							</div>





							<div className="flex items-center gap-2">

								<input
									disabled={!passwordData?.passMatched}
									type="submit"
									value={("Update")}
									className={`${!passwordData?.passMatched ? "opacity-30 !cursor-not-allowed" : ""}`}
									onClick={(ev) => {
										ev.preventDefault();

										updateUserPassword();
									}}
								/>
								{passwordData?.loading && (
									<Spinner />
								)}
							</div>



						</form>
					</WidgetWrapper>

					{/* <WidgetWrapper collapsible={true} title="General Information">
					</WidgetWrapper> */}






				</div>
			</div>
		</div>
	);
}

export default UserProfileEdit