"use client";

import { useState } from "react";
import { useAuth } from "./auth-context";
import { useRouter } from "next/navigation";

export default function Login() {



	const { user, handleLogin, logging } = useAuth();
	const router = useRouter();

	const [username, setUsername] = useState("");
	const [password, setPassword] = useState("");
	const [error, setError] = useState("");

	const onSubmit = (e) => {
		e.preventDefault();
		const success = handleLogin(username, password);

		// if (success) {
		// 	router.push("/"); // redirect after login
		// } else {
		// 	setError("Invalid username or password");
		// }
	};

	if (user) {
		return <p>You are already logged in as {user.name}</p>;
	}

	return (
		<form onSubmit={onSubmit} className="  ">
			{error && <p className="text-red-500">{error}</p>}

			<div className="mb-3">
				<label className="block mb-1">Username</label>
				<input
					type="text"
					value={username}
					onChange={(e) => setUsername(e.target.value)}
					className="!shadow-none bg-white px-2 py-1 rounded-sm w-full !border-2 border-solid border-gray-400  !outline-none focus:border-0"
				/>
			</div>

			<div className="mb-3">
				<label className="block mb-1">Password</label>
				<input
					type="password"
					value={password}
					onChange={(e) => setPassword(e.target.value)}
					className="!shadow-none bg-white px-2 py-1 rounded-sm w-full !border-2 border-solid border-gray-400  !outline-none focus:border-0"
				/>
			</div>

			<button
				className="!shadow-none bg-white px-2 py-1 rounded-sm w-full !border-2 border-solid border-gray-400  !outline-none focus:border-0"
				type="submit">
				{("Login")}


			</button>

			<div className="my-5">{logging && ("Please Wait...")}</div>
		</form>
	);
}
