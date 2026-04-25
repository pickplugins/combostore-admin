import { useEffect, useState } from "react";

const CURRENT_VERSION = process.env.NEXT_PUBLIC_APP_VERSION;

// 🔁 Replace with your real repo
const GITHUB_RELEASE_API =
	"https://api.github.com/repos/pickplugins/comboshop.com.bd-dashboard/releases/latest";

export default function VersionUpdateBanner() {
	const [latestVersion, setLatestVersion] = useState(null);
	const [dismissed, setDismissed] = useState(false);

	useEffect(() => {
		fetch(GITHUB_RELEASE_API)
			.then((res) => res.json())
			.then((data) => {

				console.log(data);


				if (data?.tag_name) {
					setLatestVersion(data.tag_name.replace("v", ""));
				}
			})
			.catch(() => { });
	}, []);

	if (
		dismissed ||
		!latestVersion ||
		latestVersion === CURRENT_VERSION
	) {
		return null;
	}

	return (
		<div
			className="text-white bg-black p-4"
		>
			<span>
				🚀 New dashboard version available ({latestVersion})
			</span>

			<div>
				<button
					onClick={() => window.location.reload()}
					style={{
						marginRight: 10,
						padding: "6px 12px",
						background: "#22c55e",
						color: "#000",
						borderRadius: 4,
						border: "none",
						cursor: "pointer",
					}}
				>
					Refresh
				</button>

				<button
					onClick={() => setDismissed(true)}
					style={{
						padding: "6px 10px",
						background: "transparent",
						color: "#fff",
						border: "1px solid #555",
						borderRadius: 4,
						cursor: "pointer",
					}}
				>
					Dismiss
				</button>
			</div>
		</div>
	);
}
