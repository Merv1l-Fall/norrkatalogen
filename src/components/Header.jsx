import "../css/header.css";
import { signOut } from "firebase/auth";
import { auth } from "../data/firebase";
import useAuthStore from "../stores/authStore";

const Header = () => {
	const { user } = useAuthStore();
	const handleLogout = () => {
		signOut(auth)
	}

	return (
		<header className="header">
			<div className="header-inner">
				<img src="src/assets/logo.svg" alt="Norrkatalogens logga" />
				<h1>ADMIN</h1>
			</div>
			{user && <button className="logout-btn" onClick={handleLogout}> Logga ut </button>}
		</header>
	)
}

export default Header