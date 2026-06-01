import {
  useState,
  useEffect,
  type ChangeEvent,
  type FormEvent,
  type ReactElement,
} from "react";
import { signInWithEmailAndPassword } from "firebase/auth";
import { auth } from "@/data/firebase";
import { useNavigate } from "react-router-dom";
import loginSchema from "@/validation/loginSchema";
import useAuthStore from "@/stores/authStore";
import "@/css/Login.css";
import type { LoginFormData } from "@/types";

const Login = (): ReactElement => {
  const { user } = useAuthStore();
  const navigate = useNavigate();

  const [email, setEmail] = useState<string>("");
  const [password, setPassword] = useState<string>("");
  const [error, setError] = useState<string>("");

  useEffect(() => {
    if (user) {
      navigate("/admin");
    }
  }, [user, navigate]);

  const handleSubmit = async (e: FormEvent<HTMLFormElement>): Promise<void> => {
    e.preventDefault();
    setError("");

    const loginData: LoginFormData = { email, password };
    const { error: validationError } = loginSchema.validate(loginData);
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

  const handleEmailChange = (e: ChangeEvent<HTMLInputElement>): void => {
    setEmail(e.target.value);
  };

  const handlePasswordChange = (e: ChangeEvent<HTMLInputElement>): void => {
    setPassword(e.target.value);
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
            onChange={handleEmailChange}
          />
        </div>
        <div className="form-group">
          <label htmlFor="password">Password:</label>
          <input
            type="password"
            id="password"
            value={password}
            onChange={handlePasswordChange}
          />
        </div>
        {error && <p className="error-message">{error}</p>}
        <button className="login-btn" type="submit">
          Login
        </button>
      </form>
    </div>
  );
};

export default Login;
