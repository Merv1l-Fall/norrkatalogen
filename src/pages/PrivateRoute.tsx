import { useNavigate } from "react-router-dom";
import { useEffect, type ReactNode, type ReactElement } from "react";
import useAuthStore from "@/stores/authStore";

interface PrivateRouteProps {
  children: ReactNode;
}

const PrivateRoute = ({ children }: PrivateRouteProps): ReactElement => {
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
    return (
      <div>
        <p className="loading-text">Omdirigerar</p>
      </div>
    );
  }

  return <>{children}</>;
};

export default PrivateRoute;
