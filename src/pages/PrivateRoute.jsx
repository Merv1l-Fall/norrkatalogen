import { useNavigate } from "react-router-dom";
import { useEffect } from "react";
import  useAuthStore  from "../stores/authStore.js";

const PrivateRoute = ({ children }) => {
	const { user, loading } = useAuthStore();
	const navigate = useNavigate();

	useEffect(() => {
		if (!loading && !user) {
			navigate("/login", { replace: true });
		}
	}, [user, loading, navigate]);
	if (loading) {
		return (
			<div>
				<p className="loading-text">Laddar</p>
			</div>
		);
	}

	if (!user) {
		return(
		<div>
			<p className="loading-text">Omdirigerar</p>
		</div>
		);
	}

	return children;
};

export default PrivateRoute;
