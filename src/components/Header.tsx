import { signOut } from "firebase/auth";
import { type ReactElement } from "react";

import "@/css/header.css";
import { auth } from "@/data/firebase";
import useAuthStore from "@/stores/authStore";
import Logo from "@/assets/logo.svg";

const Header = (): ReactElement => {
  const { user } = useAuthStore();

  const handleLogout = (): void => {
    void signOut(auth);
  };

  const extractUserName = (email: string): string => {
    const namePart = email.split("@")[0] || "";
    const firstName = namePart.split(".")[0] || "";
    return firstName.charAt(0).toUpperCase() + firstName.slice(1);
  };

  return (
    <header className="header">
      <div className="header-inner">
        <img src={Logo} alt="Norrkatalogens logga" />
        <h1>ADMIN</h1>
      </div>
      <div className="user-info-container">
        {user && (
          <p className="user-info">
            Inloggad som: {extractUserName(user.email || "")}
          </p>
        )}

        {user && (
          <button className="logout-btn" onClick={handleLogout}>
            Logga ut
          </button>
        )}
      </div>
    </header>
  );
};

export default Header;
