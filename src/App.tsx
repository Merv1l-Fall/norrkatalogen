import { useEffect, type ReactElement } from "react";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
} from "react-router-dom";

import Header from "@/components/Header";
import PrivateLayout from "@/components/PrivateLayout";
import Admin from "@/pages/Admin";
import Login from "@/pages/Login";
import PrivateRoute from "@/pages/PrivateRoute";
import { initAuth } from "@/stores/authStore";
import useCompanyStore from "@/stores/companyStore";
import useAuthStore from "@/stores/authStore";
import NewCompany from "@/pages/NewCompany";

import "./App.css";

function App(): ReactElement {
  const { fetchCompanies } = useCompanyStore();
  const { user } = useAuthStore();

  useEffect(() => {
    initAuth();
  }, []);

  useEffect(() => {
    if (user) {
      void fetchCompanies();
    }
  }, [user, fetchCompanies]);

  return (
    <Router>
      <div className="app">
        <Header />
        <Routes>
          <Route path="/login" element={<Login />} />
          <Route
            element={
              <PrivateRoute>
                <PrivateLayout />
              </PrivateRoute>
            }
          >
            <Route path="/admin" element={<Admin />} />
            <Route path="/nytt-foretag" element={<NewCompany />} />
          </Route>
          <Route path="*" element={<Navigate to="/login" replace />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;
