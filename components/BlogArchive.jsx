"use client";
import { useEffect, useState } from "react";

import {
	IconCheckbox,
	IconSquare,
	IconArrowNarrowLeftDashed,
	IconArrowNarrowRightDashed,
	IconRefresh,
	IconLink,
	IconSortDescending,
	IconSortAscending,
} from "@tabler/icons-react";
import Link from 'next/link';
import Spinner from "/components/Spinner";
import Image from "next/image";

import { useCounterStore } from 'store/useCounterStore'


const BlogArchive = (props) => {

	const serverUrl = process.env.NEXT_PUBLIC_SERVER_URL;
	const { appData, notifications, addNotification, cartItems, addCartItems, removeCartItems, resetCartItems, updateCartItems, userDataX, setUserDataX } = useCounterStore()


	var onRefreshRequest = props.onRefreshRequest;
	// var onChange = props.onChange;
	var columns = props.columns;
	var loading = props.loading;
	var [entries, setentries] = useState(props.entries);
	var [queryPrams, setqueryPrams] = useState(props?.queryPrams ? props?.queryPrams : { category: null, tag: null, keyword: "", paged: 1, order: "DESC", orderby: 'date', per_page: 15, });
	var [loading, setloading] = useState(false);







	function get_posts() {



		// if (!token) {
		// 	//throw new Error("No token found");
		// }

		if (queryPrams.paged < 0) {
			return;
		}


		var postData = JSON.stringify(queryPrams);
		setloading(true);

		fetch(serverUrl + "wp-json/combo-store/v2/get_posts", {
			method: "POST",
			cache: "no-store", // disables caching

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




						var posts = res?.posts;
						var total = res?.total;
						var max_pages = res?.max_pages;




						setentries({ posts: posts, total: total, maxPages: max_pages })
						setloading(false);


						setTimeout(() => {
						}, 500);
					});
				}
			})
			.catch((_error) => {
				//this.saveAsStatus = 'error';
				// handle the error
				setloading(false);

			});

	}


	// useEffect(() => {

	// 	get_posts();
	// }, [queryPrams]);
	// }, [queryPrams, category]);






	const [debouncedQuery, setDebouncedQuery] = useState(queryPrams);


	useEffect(() => {
		const handler = setTimeout(() => {
			setDebouncedQuery(queryPrams); // update debounced value after delay
		}, 2000); // 500ms debounce delay

		// Cleanup function: cancels the timeout if query changes before 500ms
		return () => clearTimeout(handler);
	}, [queryPrams]); // run effect when query changes



	useEffect(() => {
		if (debouncedQuery) {

			get_posts();

		}
	}, [debouncedQuery]);










	// function onChangeQueryPrams(queryPramsX) {

	// 	setqueryPrams(queryPramsX)

	// }

	// function onRefreshRequest(rows) {
	// 	get_posts();
	// }






	function loopLayout(entry, columnIndex) {

		return (
			<div className="bg-[#9a90ff] text-[#1b0e9f] "
				key={columnIndex}>



				<div className="flex flex-col relative">
					<div className="w-full overflow-hidden bg-[#fff]  p-2">
						{entry?.post_thumbnail_url && (
							<Link className="cursor-pointer" href={`/blog/${entry.slug}/`} >
								<Image className=" w-full" src={entry?.post_thumbnail_url} width={300} height={300} alt={entry?.title} />



							</Link>

						)}
						{!entry?.post_thumbnail_url && (
							<Link className=" cursor-pointer opacity-45" href={`/blog/${entry.slug}/`} >
								<Image className="object-contain h-full w-full " src={`/thumb.png`} width={200} height={200} alt={entry?.title} />

							</Link>

						)}




					</div>



					<div className="text-left flex flex-col gap-3 flex-1 p-3">
						<Link className="text-left text-sm lg:text-base  cursor-pointer" href={`/blog/${entry.slug}/`} >

							<span dangerouslySetInnerHTML={{ __html: entry?.title }}></span>

						</Link>



					</div>





				</div>
			</div>

		);
	}







	return (
		<div className="w-full  xl:p-5  p-2">

			<div>
				<h1 className="text-2xl font-bold">Blog</h1>
			</div>


			<div className=" p-3 my-5 flex justify-between  flex-wrap gap-3 px-5 bg-[#9a90ff]   rounded-md">
				<div className="flex flex-wrap gap-3 items-center">
					<input
						className="!border-2 border-solid !border-[#1b0e9f] !shadow-none"
						type="text"
						placeholder={("Search")}
						value={queryPrams?.keyword}
						onChange={(ev) => {
							setqueryPrams({ ...queryPrams, keyword: ev.target.value, paged: 1 });
						}}
					/>


					{queryPrams?.keyword.length > 0 && (
						<div className="text-red-400 cursor-pointer" onClick={ev => {
							setqueryPrams({ ...queryPrams, keyword: "", paged: 1, });

						}}>Reset</div>
					)}



				</div>



				<div className="flex flex-wrap gap-3 items-center ">
					{loading && (
						<>
							<Spinner />
						</>
					)}

					<div> {entries?.total} {("Items")}</div>

					<div>
						{queryPrams?.paged} / {entries?.maxPages}
					</div>

					{onRefreshRequest && (

						<div
							onClick={() => {
								onRefreshRequest();
							}}
							className="!border-2 border-solid !border-[#1b0e9f] !shadow-none px-2 py-1 rounded-sm cursor-pointer">
							<IconRefresh />
						</div>
					)}

					<select
						name=""
						id=""
						className="!border-2 border-solid !border-[#1b0e9f] !shadow-none"
						value={queryPrams?.order}
						onChange={(ev) => {
							setqueryPrams({ ...queryPrams, order: ev.target.value });




						}}>
						<option value="DESC">{("DESC")}</option>
						<option value="ASC">{("ASC")}</option>
					</select>

					<select
						name=""
						id=""
						className="!border-2 border-solid !border-[#1b0e9f] !shadow-none"
						value={queryPrams?.per_page}
						onChange={(ev) => {
							setqueryPrams({ ...queryPrams, per_page: ev.target.value });
						}}>
						<option value="10">10</option>
						<option value="20">20</option>
						<option value="50">50</option>
						<option value="100">100</option>
						<option value="200">200</option>
					</select>

					<div className="
					flex items-center gap-3 ">
						<div
							className="!border-2 border-solid border-[#1b0e9f] !shadow-none px-2 py-1 rounded-sm cursor-pointer"
							onClick={(ev) => {
								var paged = queryPrams.paged;


								if (paged == 1) return;
								setqueryPrams({ ...queryPrams, paged: queryPrams.paged - 1 });
							}}>
							<IconArrowNarrowLeftDashed />
						</div>

						<div>
							<input className="!border-2 border-solid !border-[#1b0e9f] !shadow-none px-2 py-1 rounded-sm cursor-pointer w-16 text-center" type="text" value={queryPrams.paged} onChange={ev => {
								var value = parseInt(ev.target.value)

								if (value > entries?.maxPages) return;
								setqueryPrams({ ...queryPrams, paged: value });

							}} />
						</div>

						<div
							className="!border-2 border-solid border-[#1b0e9f] !shadow-none px-2 py-1 rounded-sm cursor-pointer"
							onClick={(ev) => {
								var paged = queryPrams.paged + 1;



								if (paged > entries?.maxPages) return;
								setqueryPrams({ ...queryPrams, paged: paged });
							}}>
							<IconArrowNarrowRightDashed />
						</div>
					</div>
				</div>
			</div>

			<div className="overflow-x-auto w-full ">
				<div className=" w-full text-center border-collapse">

					<div className="grid grid-cols-2 xl:grid-cols-4 2xl:grid-cols-5  gap-4">


						{(entries == null || entries?.posts?.length == 0) && (

							<div className="col-span-4 py-3 ">
								{("No items found")}
							</div>

						)}
						{entries?.posts?.map((entry, loopIndex) => {
							return (
								<div
									key={loopIndex}
									className=" ">


									{loopLayout(entry, loopIndex)}

								</div>
							);
						})}
					</div>

				</div>
			</div>

			{/* {JSON.stringify(queryPrams)} */}



			<div className=" p-3 mt-10 flex justify-center xl:justify-between  flex-wrap gap-3 px-5 bg-[#9a90ff]   rounded-md">
				<div className="flex flex-wrap gap-3 items-center">

				</div>

				<div className="flex flex-wrap gap-3 items-center ">
					{loading && (
						<>
							<Spinner />
						</>
					)}

					<div> {entries?.total} {("Items")}</div>

					<div>
						{queryPrams?.paged} / {entries?.maxPages}
					</div>

					{onRefreshRequest && (

						<div
							onClick={() => {
								onRefreshRequest();
							}}
							className="!border-2 border-solid !border-[#1b0e9f] !shadow-none px-2 py-1 rounded-sm cursor-pointer">
							<IconRefresh />
						</div>
					)}

					<select
						name=""
						id=""
						className=""
						value={queryPrams?.order}
						onChange={(ev) => {
							setqueryPrams({ ...queryPrams, order: ev.target.value });




						}}>
						<option value="DESC">{("DESC")}</option>
						<option value="ASC">{("ASC")}</option>
					</select>

					<select
						name=""
						id=""
						className=""
						value={queryPrams?.per_page}
						onChange={(ev) => {
							setqueryPrams({ ...queryPrams, per_page: ev.target.value });
						}}>
						<option value="10">10</option>
						<option value="20">20</option>
						<option value="50">50</option>
						<option value="100">100</option>
						<option value="200">200</option>
					</select>

					<div className="
					flex items-center gap-3 ">
						<div
							className="!border-2 border-solid border-[#1b0e9f] !shadow-none px-2 py-1 rounded-sm cursor-pointer"
							onClick={(ev) => {
								var paged = queryPrams.paged;


								if (paged == 1) return;
								setqueryPrams({ ...queryPrams, paged: queryPrams.paged - 1 });
							}}>
							<IconArrowNarrowLeftDashed />
						</div>

						<div>
							<input className=" px-2 py-1 rounded-sm cursor-pointer w-16 text-center" type="text" value={queryPrams.paged} onChange={ev => {
								var value = parseInt(ev.target.value)
								var paged = value;



								if (paged > entries?.maxPages) return;
								setqueryPrams({ ...queryPrams, paged: paged });

							}} />
						</div>

						<div
							className="!border-2 border-solid border-[#1b0e9f] !shadow-none px-2 py-1 rounded-sm cursor-pointer"
							onClick={(ev) => {
								var paged = queryPrams.paged + 1;



								if (paged > entries?.maxPages) return;
								setqueryPrams({ ...queryPrams, paged: paged });
							}}>
							<IconArrowNarrowRightDashed />
						</div>
					</div>
				</div>
			</div>

		</div>
	);
};









export default BlogArchive;
