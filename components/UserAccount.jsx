"use client";

import { useState, useEffect, useContext } from "react";
import Spinner from "../components/Spinner";
import { IconChevronDown, IconChevronUp, IconSquare, IconFidgetSpinner, IconTrash, IconStarFilled, IconStar, IconClockPause, IconExclamationCircle, IconRosetteDiscountCheck, IconX } from "@tabler/icons-react";
import { useCounterStore } from '../store/useCounterStore'

import LocationPicker from "../components/LocationPicker";
import WidgetWrapper from '../components/WidgetWrapper';


const UserAccount = ({ userid }) => {




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



				</div>
			</div>
		</div>
	);
}

export default UserAccount