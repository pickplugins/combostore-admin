"use client";

import Link from "next/link";
import React from "react";
import { useState, useEffect, useContext } from "react";
import ComboshopVercelOnboarding from "../../components/vercel/ComboshopVercelOnboarding";
import { useCounterStore } from '../../store/useCounterStore'
const serverUrl = process.env.NEXT_PUBLIC_SERVER_URL;





const page = () => {



	const { token, appData, notifications, addNotification, userDataX, setUserDataX } = useCounterStore()



	var [productsData, setproductsData] = useState({ posts: [], total: 20, maxPages: 1 });
	var [queryPrams, setqueryPrams] = useState({ keyword: "", paged: 1, order: "DESC", per_page: 10, });

	var [loading, setloading] = useState(false);
	var [selectedRows, setselectedRows] = useState([]);
	function onSelectRows(rows) {
		setselectedRows(rows);
	}



	function delete_products(ids) {


		if (!token) {
			//throw new Error("No token found");
		}

		if (queryPrams.paged < 0) {
			return;
		}

		ids = ids != undefined ? ids : selectedRows;



		var postData = {
			ids: ids,
		};
		postData = JSON.stringify(postData);
		setloading(true);
		fetch(serverUrl + "wp-json/combo-store/v2/delete_products", {
			method: "POST",
			headers: {
				"Content-Type": "application/json",
				Authorization: `Bearer ${token}`,
			},
			body: postData,
		})
			.then((response) => {
				if (!response.ok) {
					throw new Error("Token validation failed");
				}

				if (response.ok && response.status < 400) {
					response.json().then((res) => {
						var errors = res?.errors;
						var success = res?.success;

						setloading(false);

						fetchPosts();




					});
				}
			})
			.catch((_error) => {
				//this.saveAsStatus = 'error';
				// handle the error
			});
	}

	function add_product() {


		// if (!token) {
		// 	//throw new Error("No token found");
		// }

		if (queryPrams.paged < 0) {
			return;
		}

		var postData = {
			ids: selectedRows,
		};
		postData = JSON.stringify(postData);
		setloading(true);
		fetch(serverUrl + "wp-json/combo-store/v2/add_coupon", {
			method: "POST",
			headers: {
				"Content-Type": "application/json",
				Authorization: `Bearer ${token}`,
			},
			body: postData,
		})
			.then((response) => {
				if (!response.ok) {
					throw new Error("Token validation failed");
				}

				if (response.ok && response.status < 400) {
					response.json().then((res) => {
						var errors = res?.errors;
						var success = res?.success;

						setloading(false);

						fetchPosts();




					});
				}
			})
			.catch((_error) => {
				//this.saveAsStatus = 'error';
				// handle the error
			});
	}












	// function fetchPosts() {



	// 	if (!token) {
	// 		//throw new Error("No token found");
	// 	}


	// 	if (queryPrams.paged < 0) {
	// 		return;
	// 	}


	// 	var postData = JSON.stringify(queryPrams);
	// 	setloading(true);

	// 	fetch(serverUrl + "wp-json/combo-store/v2/get_coupons", {
	// 		method: "POST",
	// 		headers: {
	// 			'Content-Type': 'application/json',
	// 			'Authorization': `Bearer ${token}`
	// 		},
	// 		body: postData,
	// 	})
	// 		.then((response) => {

	// 			if (!response.ok) {
	// 				throw new Error('Token validation failed');
	// 			}

	// 			if (response.ok && response.status < 400) {
	// 				response.json().then((res) => {




	// 					var posts = res?.posts;
	// 					var total = res?.total;
	// 					var max_pages = res?.max_pages;

	// 					setproductsData({ posts: posts, total: total, maxPages: max_pages })
	// 					//setqueryPrams({ ...queryPrams, loading: false })
	// 					setloading(false);


	// 					setTimeout(() => {
	// 					}, 500);
	// 				});
	// 			}
	// 		})
	// 		.catch((_error) => {
	// 			//this.saveAsStatus = 'error';
	// 			// handle the error
	// 		});

	// }


	// useEffect(() => {

	// 	fetchPosts();
	// }, [queryPrams]);




	useEffect(() => {
		//checkUser();
	}, []);

	const copyData = (data) => {
		navigator.clipboard
			.writeText(data)
			.then(() => {
			})
			.catch((err) => { });
	};







	return (



		<div className="bg-gray-300 flex flex-col gap-5 xl:p-5 p-2">


			<ComboshopVercelOnboarding


			/>
		</div>




	);
};

export default page;
