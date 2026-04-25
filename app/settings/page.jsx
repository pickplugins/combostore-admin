import Link from "next/link";
import React from "react";
import SettingsGlobal from '../../components/SettingsGlobal';

const page = () => {
	return (
		<div className="p-5 grid grid-cols-1 gap-5 max-w-[1200px]  mx-auto">

			<SettingsGlobal />

		</div>
	);
};

export default page;
