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
			<div className="user-info-container">
				{user && (
					<p className="user-info">
						Inloggad som: {user.email.split('@')[0].split('.')[0].charAt(0).toUpperCase() + user.email.split('@')[0].split('.')[0].slice(1)}
					</p>
				)}


				{user && <button className="logout-btn" onClick={handleLogout}> Logga ut </button>}

			</div>
		</header>
	)
}

export default Header