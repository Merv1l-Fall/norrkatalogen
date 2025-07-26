import { useState, useEffect } from "react";
import { signInWithEmailAndPassword } from "firebase/auth";
import { auth } from "../data/firebase";
import { useNavigate } from "react-router-dom";
import  loginSchema  from "../validation/loginSchema"; 
import useAuthStore from "../stores/authStore.js";
import "../css/Login.css";

const Login = () => {
	const {user} = useAuthStore();
	const navigate = useNavigate();
	
	const [email, setEmail] = useState("");
	const [password, setPassword] = useState("");
	const [error, setError] = useState("");

	useEffect(() => {
		if (user) {
		navigate("/admin");
	}
	}, [user, navigate]);

	const handleSubmit = async (e) => {
		e.preventDefault();
		setError("");

		const { error: validationError } = loginSchema.validate({ email, password });
		if (validationError) {
			setError(validationError.message);
			return;
		}

		try {
			await signInWithEmailAndPassword(auth, email, password);
			navigate("/admin");
		} catch (err) {
			console.error("Login error:", err);
			setError("Invalid email or password.");
		}
	};

	return (
		<div className="login-container">
			<h2>Login</h2>
			<form onSubmit={handleSubmit}>
				<div className="form-group">
					<label htmlFor="email">Email:</label>
					<input
						type="email"
						id="email"
						value={email}
						onChange={(e) => setEmail(e.target.value)}
					/>
				</div>
				<div className="form-group">
					<label htmlFor="password">Password:</label>
					<input
						type="password"
						id="password"
						value={password}
						onChange={(e) => setPassword(e.target.value)}
					/>
				</div>
				{error && <p className="error-message">{error}</p>}
				<button className="login-btn" type="submit">Login</button>
			</form>
		</div>
	);
}

export default Login;