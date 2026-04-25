"use client";

import Link from "next/link";
import React from "react";
import { useState, useEffect, useContext } from "react";
import EntriesTable from "../../components/EntriesTable";
import DropDown from "../../components/DropDown";
import { useCounterStore } from '../../store/useCounterStore'
const serverUrl = process.env.NEXT_PUBLIC_SERVER_URL;

import { IconCopy, IconEyeShare, IconDotsVertical, IconEdit, IconTrash, IconStarFilled, IconStar, IconFileDollar, IconExclamationCircle, IconRosetteDiscountCheck, IconX, IconZoomExclamationFilled, IconPlaylistX } from "@tabler/icons-react";
import PopoverButton from "../../components/PopoverButton";
import ProductEdit from "../../components/shop-elements/ProductEdit";
import ProductBulkUpdate from "../../components/shop-elements/ProductBulkUpdate";

import Image from "next/image";


const page = () => {



	const { token, appData, notifications, addNotification, userDataX, setUserDataX, paymentGateways } = useCounterStore()



	var [queryPrams, setqueryPrams] = useState({ is_admin: true, category: "", tag: null, keyword: "", paged: 1, orderby: "date", order: "DESC", per_page: 20, price: "" });
	var [editProduct, seteditProduct] = useState({ id: null });




	var [productsData, setproductsData] = useState({ posts: [], total: 20, maxPages: 1 });



	var [loading, setloading] = useState(false);
	var [selectedRows, setselectedRows] = useState([]);

	var [queryTerms, setqueryTerms] = useState({ taxonomy: 'product_cat', order: "DESC", per_page: 99, });
	var [querybrands, setquerybrands] = useState({ taxonomy: 'product_brand', order: "DESC", per_page: 99, });
	var [terms, setterms] = useState([]);
	var [brands, setbrands] = useState([]);



	function onSelectRows(rows) {
		setselectedRows(rows);
	}


	var columns = {
		check: { id: "check", label: ("Check"), },
		id: { id: "id", label: ("Product"), callback: callbackTitle, classes: "w-96  text-gray-600" },
		categories: { id: "categories", label: ("Categories"), callback: callbackCategories, classes: "text-left text-gray-600" },
		// brands: { id: "brands", label: ("Brands"), callback: callbackBrands, classes: "text-left text-gray-600" },
		// tags: { id: "tags", label: ("Tags"), callback: callbackTags, classes: "text-left" },
		// brands: { id: "Brands", label: ("Brands"), callback: callbackBrands, classes: "text-left" },
		// brands: { id:"brands",label: ("Brands"), callback: callbackBrands, classes: "text-left" },
		// sku: { id:"sku",label: ("SKU"), },
		stockCount: { id: "stockCount", label: ("Stock"), callback: callbackStock, classes: "text-center text-gray-600" },
		price: { id: "price", label: ("Price"), callback: callbackPrice, classes: "text-center text-gray-600" },
		// type: { id:"check",label: "Type", callback: callbackType },

		// refunded_total: { id:"check",label: "Refunded" },
		// visibility: { id: "visibility", label: ("Visibility"), callback: callbackVisibility },
		// status: { id: "status", label: ("Status"), callback: callbackStatus },
		actions: { label: ("Actions"), callback: callbackActions, classes: "text-right pr-2 text-gray-600" },

	};



	async function fetchPosts() {





		// if (!token) {
		// 	//throw new Error("No token found");
		// }


		if (queryPrams.paged < 0) {
			return;
		}


		var postData = JSON.stringify(queryPrams);
		setloading(true);

		console.log("Fetching products with params:", queryPrams);

		fetch(serverUrl + "wp-json/combo-store/v2/get_products", {
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


						var posts = res?.posts;
						var total = res?.total;
						var max_pages = res?.max_pages;

						console.log(posts);


						setproductsData({ posts: posts, total: total, maxPages: max_pages })
						//setqueryPrams({ ...queryPrams, loading: false })
						setloading(false);


						setTimeout(() => {
						}, 500);
					});
				}
			})
			.catch((_error) => {
				//this.saveAsStatus = 'error';
				// handle the error
			});

	}


	function fetchTerms() {



		var postData = {
			taxonomy: queryTerms.taxonomy,
			per_page: queryTerms.per_page,
			paged: queryTerms.paged,
			order: queryTerms.order,
			hierarchical: true,
		};
		postData = JSON.stringify(postData);

		fetch(serverUrl + "wp-json/combo-store/v2/get_terms", {
			method: "POST",
			headers: {
				'Content-Type': 'application/json',
				// 'Authorization': `Bearer ${token}`
			},
			body: postData,
		})
			.then((response) => {

				if (!response.ok) {
					throw new Error('Token validation failed');
				}

				if (response.ok && response.status < 400) {
					response.json().then((res) => {


						var terms = res?.terms;
						var total = res?.total;
						var max_pages = res?.max_pages;




						var termsX = [];

						Object.entries(terms).map(args => {
							var index = args[0]
							var item = args[1]
							termsX.push(item)
						})


						setterms(termsX)


						setTimeout(() => {
						}, 500);
					});
				}
			})
			.catch((_error) => {
				//this.saveAsStatus = 'error';
				// handle the error
			});

	}
	function fetchBrands() {







		var postData = {
			taxonomy: querybrands.taxonomy,
			per_page: querybrands.per_page,
			paged: querybrands.paged,
			order: querybrands.order,
			hierarchical: true,
		};
		postData = JSON.stringify(postData);

		fetch(serverUrl + "wp-json/combo-store/v2/get_terms", {
			method: "POST",
			headers: {
				'Content-Type': 'application/json',
				// 'Authorization': `Bearer ${token}`
			},
			body: postData,
		})
			.then((response) => {

				if (!response.ok) {
					throw new Error('Token validation failed');
				}

				if (response.ok && response.status < 400) {
					response.json().then((res) => {


						var terms = res?.terms;
						var total = res?.total;
						var max_pages = res?.max_pages;




						var termsX = [];

						Object.entries(terms).map(args => {
							var index = args[0]
							var item = args[1]
							termsX.push(item)
						})


						setbrands(termsX)


						setTimeout(() => {
						}, 500);
					});
				}
			})
			.catch((_error) => {
				//this.saveAsStatus = 'error';
				// handle the error
			});

	}


	async function delete_products(ids) {


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
	async function duplicate_product(id) {


		if (!token) {
			//throw new Error("No token found");
		}

		if (queryPrams.paged < 0) {
			return;
		}



		var postData = {
			id: id,
		};
		postData = JSON.stringify(postData);
		setloading(true);
		fetch(serverUrl + "wp-json/combo-store/v2/duplicate_product", {
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

	async function add_product() {


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
		fetch(serverUrl + "wp-json/combo-store/v2/add_product", {
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

	const [debouncedQuery, setDebouncedQuery] = useState(queryPrams);


	useEffect(() => {
		const handler = setTimeout(() => {
			setDebouncedQuery(queryPrams); // update debounced value after delay
		}, 1000); // 500ms debounce delay

		// Cleanup function: cancels the timeout if query changes before 500ms
		return () => clearTimeout(handler);
	}, [queryPrams]); // run effect when query changes



	useEffect(() => {
		if (debouncedQuery) {

			fetchPosts();

		}
	}, [debouncedQuery]);








	// useEffect(() => {

	// 	fetchPosts();
	// }, [queryPrams]);


	function onChangeQueryPrams(queryPrams) {
		if (queryPrams) {
			setqueryPrams(queryPrams)
			//fetchPosts();
		}

	}

	function onRefreshRequest(rows) {
		fetchPosts();
	}

	useEffect(() => {
		fetchPosts();
		fetchTerms();
		fetchBrands();
	}, []);


	function callbackActions(entry, columnIndex) {


		var orderItems = entry?.order_items

		const excludeInSearch = entry?.visibility.some(item => item.slug === "exclude-from-search");
		const excludeInShop = entry?.visibility.some(item => item.slug === "exclude-from-catalog");


		return (
			<td data-label="Actions" className="text-sm"
				key={columnIndex}>
				<div className="sm:flex gap-2 justify-end sm:pr-5 text-sm">




					{excludeInSearch && (
						<div title="exclude-from-search" className="bg-white text-gray-400 hover:bg-gray-200 rounded-sm p-1 hover:text-gray-600 cursor-pointer justify-end"><IconZoomExclamationFilled /></div>
					)}
					{excludeInShop && (
						<div title="exclude-from-catalog" className="bg-white text-gray-400 hover:bg-gray-200 rounded-sm p-1 hover:text-gray-600 cursor-pointer justify-end"	><IconPlaylistX /></div>
					)}







					<PopoverButton buttonLabel={" "} buttonIcon={<IconEdit />} title={"Edit Product"} position={""} popoverClass={`mx-auto w-3/4  fixed inset-x-0 top-10 h-[700px] overflow-y-auto z-[999] border-2 border-solid border-indigo-600 rounded-sm`} buttonClass={`bg-white  text-gray-400 hover:bg-gray-200 rounded-sm p-1 hover:text-gray-600 cursor-pointer justify-end`}>

						<div className="p-5 bg-gray-200 text-left">
							<ProductEdit id={entry?.id} />
						</div>

					</PopoverButton>


					<PopoverButton wrapperClass={`bg-white flex justify-end `} buttonLabel={" "} buttonIcon={<IconDotsVertical />} title={"Actions"} position={"bottomRight"} buttonClass={`bg-white  text-gray-400 hover:bg-gray-200 rounded-sm p-1 hover:text-gray-600 cursor-pointer justify-end`}>

						<div className="p-2 w-[400px] bg-gray-200">

							<div className="flex gap-2 mb-3">
								<div className="flex w-fit items-center gap-2 text-white bg-gray-400 text-xs px-1 py-1 rounded-sm cursor-pointer" onClick={() => {

									if (confirm("Please confirm?")) {
										duplicate_product(entry.id);
									}
								}}>
									<IconCopy size={16} /> Duplicate
								</div>
								<Link className=" flex w-fit items-center gap-2 text-white bg-gray-400 text-xs px-1 py-1 rounded-sm cursor-pointer" href={`/products/${entry.id}`}>
									<IconEyeShare size={16} /> View
								</Link>
								<div className=" flex w-fit items-center gap-2 text-white bg-red-400 text-xs px-1 py-1 rounded-sm cursor-pointer" onClick={() => {
									if (confirm("Please confirm?")) {
										delete_products([entry.id]);
									}


								}}>
									<IconTrash size={16} /> Delete
								</div>


							</div>





						</div>

					</PopoverButton>


				</div>

			</td>

		);
	}


	function callbackTitle(entry, columnIndex) {




		return (
			<td className="text-center pl-5 py-3"
				key={`title-${entry?.id}`}>

				<div className="flex gap-2 items-center">

					<div className="flex items-center gap-2">

						{entry?.featured && (
							<div className="text-amber-500"><IconStarFilled /></div>
						)}
						{!entry?.featured && (
							<div className="text-gray-400"><IconStar /></div>
						)}

						<div className="w-18 h-18 overflow-hidden border" >
							{entry?.post_thumbnail_url && (
								<Image className="w-full" src={entry?.post_thumbnail_url} width={100} height={100} alt={``} />

							)}
						</div>

					</div>

					<div className="text-left flex flex-col gap-2 flex-wrap flex-1 group ">
						<Link className="text-left text-sm text-gray-600 font-medium " href={`/products/${entry?.id}`}>
							{entry?.title}

						</Link>

						<div className="flex gap-3 text-xs text-gray-500 ">

							<div>#{entry?.id}</div>
							{entry?.status === "draft" && (
								<div className="font-bold text-gray-500"> Draft</div>
							)}
							{entry?.status === "pending" && (
								<div className="font-bold text-gray-500"> Pending</div>
							)}


							{/* <div className=" ">{entry?.sku}</div> */}




						</div>
					</div>
				</div>
			</td>

		);
	}
	function callbackPrice(entry, columnIndex) {

		var type = entry.type;
		var salePrice = entry.salePrice;
		var regularPrice = entry.regularPrice;

		return (
			<td className=" pl-5"
				key={columnIndex}>
				<div className="flex gap-2 justify-center text-sm">

					{salePrice && (
						<>
							<span>${salePrice}</span>
							<span className="line-through">${regularPrice}</span>

						</>
					)}
					{!salePrice && (
						<>
							<span>${regularPrice}</span>
						</>
					)}



				</div>
			</td>

		);
	}



	function callbackCategories(entry, columnIndex) {


		return (
			<td className="text-center "
				key={`category-${entry?.id}`}
			>
				<div className="flex flex-col gap-2">

					{entry?.categories.length > 0 && (
						<div className="flex text-sm flex-wrap gap-2">
							{entry?.categories?.map((item, index) => {

								return (
									<div key={index} className="">
										<span dangerouslySetInnerHTML={{ __html: item.name }}></span>
										{entry?.categories?.length > (index + 1) && (
											<span className="pr-1">, </span>
										)}
									</div>
								)

							})}
						</div>
					)}

					{entry?.brands.length > 0 && (
						<div className="flex text-sm flex-wrap gap-2">
							<div className="text-sm font-bold">Brands: </div>
							{entry?.brands.map((item, index) => {
								return (
									<div key={index}>
										<span>{item.name}</span>
										{entry?.brands.length > (index + 1) && (
											<span className="pr-1">, </span>
										)}
									</div>
								)
							})}
						</div>
					)}









				</div>
			</td>

		);
	}
	function callbackBrands(entry, columnIndex) {


		return (
			<td className="text-center pl-5"
				key={`category-${entry?.id}`}
			>
				<div className="flex flex-col gap-2">



					{entry?.brands.length > 0 && (
						<div className="flex text-sm flex-wrap gap-2">
							{entry?.brands.map((item, index) => {
								return (
									<div key={index}>
										<span>{item.name}</span>
										{entry?.brands.length > (index + 1) && (
											<span className="pr-1">, </span>
										)}
									</div>
								)
							})}
						</div>
					)}









				</div>
			</td>

		);
	}




	function callbackStock(entry, columnIndex) {

		return (
			<td className="text-center pl-5"
				key={`stock-${entry?.id}`}

			>

				<div className="text-center text-sm">
					{entry.stockStatus == 'instock' && (
						<span className="">{entry.stockCount}</span>
					)}

					{entry.stockStatus == 'outofstock' && (
						<span className="bg-red-400 px-3 py-1 rounded-sm text-white">Out of Stock</span>
					)}
				</div>

			</td>

		);
	}


	function callbackVisibility(entry, columnIndex) {


		const excludeInSearch = entry?.visibility.some(item => item.slug === "exclude-from-search");
		const excludeInShop = entry?.visibility.some(item => item.slug === "exclude-from-catalog");

		return (
			<td className="text-center pl-5"
				key={`status-${entry?.id}`}
			>


				{/* {entry?.visibility.map(item => item.name).join(", ")} */}
				<div className="flex gap-2 justify-center text-gray-500">

					{excludeInSearch && (
						<div title="exclude-from-search"><IconZoomExclamationFilled /></div>
					)}
					{excludeInShop && (
						<div title="exclude-from-catalog"><IconPlaylistX /></div>
					)}

				</div>

			</td>

		);
	}











	// function callbackStock(entry, columnIndex) {

	// 	return (
	// 		<td className="text-center pl-5"
	// 			key={columnIndex}>

	// 			{entry?.stockCount}
	// 		</td>

	// 	);
	// }
	function callbackType(entry, columnIndex) {

		return (
			<td className="text-center pl-5"
				key={columnIndex}>

				{entry.type == 'physical' && (
					<span className="">Physical</span>
				)}

				{entry.type == 'digital' && (
					<span className="">Digital</span>
				)}
			</td>

		);
	}


	var orderStatusPrams = [
		{ label: 'All', value: '' },
		{ label: 'Pending', value: 'pending' },
		{ label: 'Completed', value: 'completed' },
		{ label: 'Canceled', value: 'canceled' },
		{ label: 'Refunded', value: 'refunded' },
		{ label: 'Failed', value: 'failed' },
		{ label: 'Processing', value: 'processing' },
		{ label: 'Hold', value: 'hold' }
	]
	var stockStatusOptions = {
		instock: { label: 'In Stock', value: 'instock' },
		outofstock: { label: 'Out of Stock', value: 'outofstock' }
	}




	var paymentStatusPrams = [

		{
			"label": "All",
			"value": "",

		},
		{
			"label": "Pending",
			"value": "pending",

		},
		{
			"label": "Paid",
			"value": "paid",

		},
		{
			"label": "Failed",
			"value": "failed",

		},
		{
			"label": "Delayed",
			"value": "delayed",
		},
		{
			"label": "Due",
			"value": "due",
		},

	]


	function onFilterByStatus(args) {

		setqueryPrams({ ...queryPrams, status: args, paged: 1 })
	}
	function onFilterByStockStatus(args) {

		setqueryPrams({ ...queryPrams, stockStatus: args?.value, paged: 1 })
	}
	function onFilterByPaymentStatus(args) {

		setqueryPrams({ ...queryPrams, payment_status: args, paged: 1 })
	}




	return (

		<div className="bg-gray-300 flex flex-col gap-5 xl:p-5 p-2">

			<div className="flex justify-between  ">

				<div className="flex flex-wrap gap-3  ">
					<div className="  text-white bg-gray-600  px-3 py-2 rounded-sm cursor-pointer" onClick={ev => {
						add_product();
					}}>Add Product</div>



					<select name="" id="" className="!border-2 border-solid !border-gray-600 !shadow-none xl:w-56 w-full" onChange={ev => {

						var value = ev.target.value;

						setqueryPrams({ ...queryPrams, category: value, paged: 1 });

					}}>
						<option value={""}>{("All Categories")}</option>

						{terms?.map(item => {

							var children = item?.children;

							if (children) {

								return (

									<optgroup label={`${item.name}(${item.count})`} key={item.term_id}>
										<option value={item.slug} key={item.slug}>
											{item.name}({item.count})
										</option>


										{children?.map(childItem => {

											return (
												<option value={childItem.slug} key={childItem.term_id}>
													{childItem.name}({childItem.count})
												</option>

											)
										})}

									</optgroup>


								)

							}
							if (!children) {
								return (
									<option value={item.slug} key={item.term_id}>
										{item.name}({item.count})
									</option>
								)
							}




						})}

					</select>
					<select name="" id="" className="!border-2 border-solid !border-gray-600 !shadow-none xl:w-56 w-full" onChange={ev => {

						var value = ev.target.value;

						setqueryPrams({ ...queryPrams, brand: value, paged: 1 });

					}}>
						<option value={""}>{("All Brands")}</option>

						{brands?.map(item => {

							var children = item?.children;

							if (children) {

								return (

									<optgroup label={`${item.name}(${item.count})`} key={item.term_id}>
										<option value={item.slug} key={item.slug}>
											{item.name}({item.count})
										</option>


										{children?.map(childItem => {

											return (
												<option value={childItem.slug} key={childItem.term_id}>
													{childItem.name}({childItem.count})
												</option>

											)
										})}

									</optgroup>


								)

							}
							if (!children) {
								return (
									<option value={item.slug} key={item.term_id}>
										{item.name}({item.count})
									</option>
								)
							}




						})}

					</select>


					<PopoverButton wrapperClass={`bg-white `} enableCloseBtn={false} buttonLabel={("Filter Orders")} buttonIcon={<IconFileDollar />} title={"Filter Products"} position={"leftTop"}>

						<div className="p-5 bg-gray-200 w-[400px]">
							<div className="flex flex-col  gap-3 ">
								<div className="flex justify-between">
									<div>Order Status</div>
									<div>
										<DropDown multiple={false} value={queryPrams?.status} options={orderStatusPrams} label={`Choose Status`} onOptionsChoose={onFilterByStatus} />
									</div>
								</div>
								<div className="flex justify-between">
									<div>Stock Status</div>
									<div>
										<DropDown multiple={false} value={queryPrams?.stockStatus} options={stockStatusOptions} label={`Choose Stock Status`} onOptionsChoose={onFilterByStockStatus} />
									</div>
								</div>
								<div className="flex justify-between">
									<div>Payment Status</div>
									<div>
										<DropDown multiple={false} value={queryPrams?.payment_status} options={paymentStatusPrams} label={`ChoosePayment Status`} onOptionsChoose={onFilterByPaymentStatus} />
									</div>
								</div>








							</div>
						</div>

					</PopoverButton>



				</div>




				<div className="flex gap-3 items-center justify-end ">
					{selectedRows.length > 0 && (
						<div
							className="px-3 py-[5px] rounded-sm bg-red-600 hover:bg-red-500 text-white cursor-pointer"
							onClick={() => {
								delete_products();
							}}>
							{("Delete Products")}
						</div>
					)}

					{selectedRows.length > 0 && (

						<PopoverButton buttonLabel={("Bulk Update")} buttonClass={`px-3 py-[5px] rounded-sm bg-gray-600 hover:bg-gray-500 text-white cursor-pointer`} buttonIcon={``} title={"Bulk Update"} position={""} popoverClass={`mx-auto w-3/4  fixed inset-x-0 top-10 h-[700px] overflow-y-auto z-[999] border-2 border-solid border-indigo-600 bg-white rounded-sm`} >

							<div className="p-5 bg-gray-200">

								<ProductBulkUpdate ids={selectedRows} />









							</div>

						</PopoverButton>
					)}




				</div>
			</div>



			<EntriesTable
				queryPrams={queryPrams}
				columns={columns}
				entries={productsData}
				itemPath={""}
				onChange={onChangeQueryPrams}
				loading={loading}
				selectedRows={selectedRows}
				onSelectRows={onSelectRows}
				onRefreshRequest={onRefreshRequest}

			/>
		</div>



	);
};

export default page;
