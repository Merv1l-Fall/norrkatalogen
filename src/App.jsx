import { useEffect } from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";

import Header from "./components/Header.jsx";
import Admin from "./pages/Admin.jsx";
import Login from "./pages/Login.jsx";
import PrivateRoute from "./pages/PrivateRoute.jsx";
import { initAuth } from "./stores/authStore";
import useCompanyStore from "./stores/companyStore.js";
import useAuthStore from "./stores/authStore";
import NewCompany from "./pages/NewCompany.jsx";

import "./App.css";

function App() {
	// start auth process when the app starts
	const { fetchCompanies } = useCompanyStore();
	const { user } = useAuthStore();

	useEffect(() => {
		initAuth(); // Start listening to auth state
	}, []);

	// Fetch companies when user is authenticated
	useEffect(() => {
		if (user) {
			fetchCompanies();
		}
	}, [user]);

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
					<Route
						path="/nytt-foretag"
						element={
							<PrivateRoute>
								<NewCompany />
							</PrivateRoute>
						}
					/>
					<Route path="*" element={<Login />} />
				</Routes>
			</div>
		</Router>
		// <div className="app">

		// 	<Header />
		// 	<NewCompany />
		// </div>
	);
}

export default App;
