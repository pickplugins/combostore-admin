"use client";
import { Component, useContext, useEffect, useState } from "react";

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
import Spinner from "./Spinner";




const EntriesTable = (props) => {



	var onRefreshRequest = props.onRefreshRequest;
	var onSelectRows = props.onSelectRows;
	var onChange = props.onChange;
	var columns = props.columns;
	var entries = props.entries;
	var itemPath = props.itemPath;
	var deleteRow = props.deleteRow;
	var loading = props.loading;
	var [queryPrams, setqueryPrams] = useState(props.queryPrams);
	var [selectedRows, setselectedRows] = useState(props.selectedRows);
	var [selectedAll, setselectedAll] = useState(false);
	var [anchorId, setAnchorId] = useState(null);
	var [lastCheckedId, setLastCheckedId] = useState(null);

	useEffect(() => {
		onChange(queryPrams);


	}, [queryPrams]);

	useEffect(() => {
		if (onSelectRows) {
			onSelectRows(selectedRows);
		}
	}, [selectedRows]);

	const handleRowSelection = (entryId, shiftKey) => {
		var selectedRowsX = [...selectedRows];

		if (shiftKey && lastCheckedId !== null) {
			const currentIndex = entries.posts.findIndex(
				(entry) => entry.id === entryId
			);
			const lastIndex = entries.posts.findIndex(
				(entry) => entry.id === lastCheckedId
			);
			const [start, end] = [
				Math.min(currentIndex, lastIndex),
				Math.max(currentIndex, lastIndex),
			];

			// Clear previous selections
			selectedRowsX = [];

			// Select all items in range
			entries.posts.slice(start, end + 1).forEach((entry) => {
				selectedRowsX.push(entry.id);
			});
		} else {
			const index = selectedRowsX.indexOf(entryId);
			if (index !== -1) {
				selectedRowsX.splice(index, 1);
				setAnchorId(null);
			} else {
				selectedRowsX.push(entryId);
				setAnchorId(entryId);
			}
		}

		setLastCheckedId(entryId);
		setselectedRows(selectedRowsX);
	};


	return (

		<div className="rounded-md bg-white">
			<div className=" p-3 flex justify-between flex-wrap gap-3 px-5 ">
				<div className="flex gap-2 items-center">
					<input
						className="!shadow-none bg-white px-2 py-1 rounded-sm w-full !border-2 border-solid border-gray-400  !outline-none focus:border-0"
						type="text"
						placeholder="Search..."
						value={queryPrams?.keyword}
						name="keyword"
						onChange={(ev) => {
							setqueryPrams({ ...queryPrams, keyword: ev.target.value });
						}}
					/>
				</div>

				<div className="flex flex-wrap gap-3 items-center">
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

						<button
							onClick={() => {
								onRefreshRequest();
							}}
							className="!border-2 border-solid border-gray-400 !shadow-none">
							<IconRefresh />
						</button>
					)}

					<select
						name=""
						id=""
						className="!border-2 border-solid border-gray-400 !shadow-none"
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
						className="!border-2 border-solid border-gray-400 !shadow-none"
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
					flex items-center gap-3">
						<button
							className="!border-2 border-solid border-gray-400 !shadow-none"
							onClick={(ev) => {
								var paged = queryPrams.paged;
								if (paged == 1) return;
								setqueryPrams({ ...queryPrams, paged: queryPrams.paged - 1 });
							}}>
							<IconArrowNarrowLeftDashed />
						</button>
						<button
							className="!border-2 border-solid border-gray-400 !shadow-none"
							onClick={(ev) => {
								var paged = queryPrams.paged + 1;
								if (paged > entries?.maxPages) return;
								setqueryPrams({ ...queryPrams, paged: queryPrams.paged + 1 });
							}}>
							<IconArrowNarrowRightDashed />
						</button>
					</div>
				</div>
			</div>

			<div className="overflow-x-auto w-full">
				<table className="table-auto md:table-fixed w-full text-center border-collapse">
					<thead className="">
						<tr className=" bg-gray-200 border border-solid border-gray-200">
							{Object.entries(columns).map((args) => {
								var columnIndex = args[0];
								var columnData = args[1];

								var classes = columnData?.classes ?? "";
								var order = columnData?.order ?? "";




								return (
									<th
										key={`head-${columnData?.label}`}

										className={` ${classes ? classes : "px-5 py-2 text-gray-600"} ${columnIndex == "check" ? "w-12 " : ""
											}  ${columnIndex == "email" ? "text-left pl-5" : ""
											} ${columnIndex == "title" ? "text-left pl-5" : ""}`}>
										{columnIndex == "check" && (
											<div
												onClick={(ev) => {
													setselectedAll(!selectedAll);
													if (!selectedAll) {
														const ids = entries?.posts.map((entry) => entry.id);
														setselectedRows(ids);
													} else {
														setselectedRows([]);
													}
													setAnchorId(null);
													setLastCheckedId(null);
												}}>
												{selectedAll && (
													<span className="cursor-pointer text-gray-600">
														<IconCheckbox />
													</span>
												)}
												{!selectedAll && (
													<span className="cursor-pointer text-gray-400">
														<IconSquare />
													</span>
												)}
											</div>
										)}
										{columnIndex != "check" && (
											<span
												className={`${order ? "flex items-center justify-center gap-1" : ''}  ${columnIndex == "email" ? "text-left pl-5" : ""
													}`}>
												<span>{columnData.label}</span>

												{order && (

													<span className="text-amazon-600 cursor-pointer hover:text-amazon-700">
														{order == 'DESC' && (<IconSortDescending />)}
														{order == 'ASC' && (<IconSortAscending />)}

													</span>

												)}

											</span>
										)}
									</th>
								);
							})}
							{deleteRow && <th>Delete</th>}
						</tr>
					</thead>
					<tbody>
						{entries == null && (
							<tr>
								<td colSpan={Object.entries(columns)?.length} className="col-span-4 py-3">
									{("No items found")}
								</td>
							</tr>
						)}
						{entries?.posts?.map((entry, index) => {



							return (
								<tr
									className="border-0 border-b border-solid border-gray-200" key={index}>
									{Object.entries(columns).map((args, colIndex) => {
										var columnIndex = args[0];
										var columnData = args[1];

										var linkTo = columnData?.linkTo
										var linkToPath = linkTo?.path;
										var callback = columnData?.callback;



										return (

											<>
												{callback && (
													<>{callback(entry, columnIndex)}</>
												)}
												{!callback && (
													<td
														key={entry.id}
														className={`!px-5 py-2   break-all ${columnIndex == "email" ? "text-left pl-5" : ""
															} ${columnIndex == "title" ? "text-left pl-5" : ""}`}>

														<div className="">
															{/* <div className=" min-w-40 text-left font-bold md:hidden sm:block">{columnData.label}</div> */}

															<div className="">
																{linkTo && (

																	<>

																		{columnIndex == 'id' && (
																			<Link className="flex items-center gap-1 justify-center text-amazon-600" href={`/${linkToPath}/${entry.id}`}>
																				<IconLink />	{entry.id}
																			</Link>
																		)}

																		{columnIndex == 'title' && (
																			<Link className="flex items-center gap-1  text-amazon-600" href={`/${linkToPath}/${entry.id}`}>
																				<IconLink />	{entry.title}
																			</Link>
																		)}

																	</>



																)}
																{!linkTo && (

																	<>


																		{columnIndex == "id" && (
																			<div className="flex items-center gap-2 ">
																				{itemPath.length > 0 && (
																					<Link className="" href={`/${itemPath}/${entry.id}`}>
																						{"#" + entry.id}
																					</Link>
																				)}
																				{itemPath.length == 0 && (
																					<span className="">
																						{"#" + entry.id}
																					</span>
																				)}
																			</div>
																		)}





																		{columnIndex != "check" && columnIndex != 'id' && (
																			<span
																				className={`${columnIndex == "email" ? "text-left pl-5" : ""
																					} `}>


																				{entry[columnIndex]}
																			</span>
																		)}

																	</>
																)}



																{columnIndex == "check" && (
																	<div
																		className="py-2"
																		onClick={(ev) =>
																			handleRowSelection(entry.id, ev.shiftKey)
																		}>
																		{selectedRows?.includes(entry.id) && (
																			<span className="text-gray-600">
																				<IconCheckbox />
																			</span>
																		)}
																		{!selectedRows?.includes(entry.id) && (
																			<span className="cursor-pointer text-gray-400">
																				<IconSquare />
																			</span>
																		)}
																	</div>
																)}
															</div>
														</div>
													</td>
												)}
											</>


										);
									})}
									{deleteRow && (
										<td key={"delete"}>
											<span
												onClick={(ev) => {
													deleteRow(entry.id);
												}}>
												{("Delete")}
											</span>
										</td>
									)}
								</tr>
							);
						})}
					</tbody>
					<thead className="">
						<tr className=" bg-gray-200 border border-solid border-gray-200">
							{Object.entries(columns).map((args) => {
								var columnIndex = args[0];
								var columnData = args[1];

								var classes = columnData?.classes ?? "";
								var order = columnData?.order ?? "";




								return (
									<th
										key={`head-${columnData?.label}`}

										className={` ${classes ? classes : "px-5 py-2 text-gray-600"} ${columnIndex == "check" ? "w-12 " : ""
											}  ${columnIndex == "email" ? "text-left pl-5" : ""
											} ${columnIndex == "title" ? "text-left pl-5" : ""}`}>
										{columnIndex == "check" && (
											<div
												onClick={(ev) => {
													setselectedAll(!selectedAll);
													if (!selectedAll) {
														const ids = entries?.posts.map((entry) => entry.id);
														setselectedRows(ids);
													} else {
														setselectedRows([]);
													}
													setAnchorId(null);
													setLastCheckedId(null);
												}}>
												{selectedAll && (
													<span className="cursor-pointer text-gray-600">
														<IconCheckbox />
													</span>
												)}
												{!selectedAll && (
													<span className="cursor-pointer text-gray-400">
														<IconSquare />
													</span>
												)}
											</div>
										)}
										{columnIndex != "check" && (
											<span
												className={`${order ? "flex items-center justify-center gap-1" : ''}  ${columnIndex == "email" ? "text-left pl-5" : ""
													}`}>
												<span>{columnData.label}</span>

												{order && (

													<span className="text-amazon-600 cursor-pointer hover:text-amazon-700">
														{order == 'DESC' && (<IconSortDescending />)}
														{order == 'ASC' && (<IconSortAscending />)}

													</span>

												)}

											</span>
										)}
									</th>
								);
							})}
							{deleteRow && <th>Delete</th>}
						</tr>
					</thead>
				</table>
			</div>
		</div>

	);
};









export default EntriesTable;
