"use client";

import { createContext, useState, useContext, ReactNode } from "react";

const ThemeContext = createContext();

export function ThemeProvider({ children }: { children: ReactNode }) {
	const [theme, setTheme] = useState("light");

	const toggleTheme = () => {
		setTheme((prev) => (prev === "light" ? "dark" : "light"));
	};

	return (
		<ThemeContext.Provider value={{ theme, toggleTheme }}>
			{children}
		</ThemeContext.Provider>
	);
}

export function useTheme() {
	const context = useContext(ThemeContext);
	if (!context) {
		throw new Error("useTheme must be used within theme provider");
	}
	return context;
}
