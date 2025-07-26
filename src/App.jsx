import { useEffect } from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";

import Header from "./components/Header.jsx";
import Admin from "./pages/Admin.jsx";
import Login from "./pages/Login.jsx";
import PrivateRoute from "./pages/PrivateRoute.jsx";
import { initAuth } from "./stores/authStore";
import useCompanyStore from "./stores/companyStore.js";

import "./App.css";

function App() {
	// Fetch companies when the app starts
	const { fetchCompanies } = useCompanyStore();

	useEffect(() => {
		fetchCompanies();
		initAuth(); // 🔐 Start listening to auth state
	}, []);

	return (
		<Router>
			<div className="app">
				<Header />
				<Routes>
					<Route path="/login" element={<Login />} />
					<Route
						path="/admin"
						element={
							<PrivateRoute>
								<Admin />
							</PrivateRoute>
						}
					/>
					{/* Optional: redirect unknown routes */}
					<Route path="*" element={<Login />} />
				</Routes>
			</div>
		</Router>
	);
}

export default App;
