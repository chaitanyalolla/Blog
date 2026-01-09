"use client";

import { useAuth } from "@/lib/context/auth";
import { useTheme } from "@/lib/context/theme";
import { SunIcon, MoonIcon } from "@heroicons/react/24/solid";
import { useState } from "react";
import Modal from "@/app/components/Modal";

export default function Header() {
	const { user, logout } = useAuth();
	const { theme, toggleTheme } = useTheme();
	const [showLogout, setShowLogout] = useState(false);

	const handleLogout = () => {
		logout();
		router.push("/login");
	};
	return (
		<div className="flex justify-between items-center mb-8">
			<div>
				<h1 className="text-4xl font-bold">BlogApp</h1>
				<p className="text-sm mt-1">Welcome, {user?.name}</p>
			</div>
			<div className="flex gap-6">
				<button onClick={toggleTheme} className="cursor-pointer">
					{theme === "light" ? (
						<MoonIcon className="size-6" />
					) : (
						<SunIcon className="size-6" />
					)}
				</button>
				<button
					onClick={() => setShowLogout(true)}
					className="bg-gray-600 hover:bg-gray-700 text-white font-semibold px-6 py-2 rounded-lg transition-colors cursor-pointer"
				>
					Logout
				</button>
			</div>
			<Modal
				isOpen={showLogout}
				onClose={() => setShowLogout(false)}
				onConfirm={handleLogout}
				title="Logout"
				message="Are you sure you want to logout?"
			/>
		</div>
	);
}
