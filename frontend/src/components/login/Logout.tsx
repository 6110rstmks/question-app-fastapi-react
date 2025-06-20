// Logout.tsx
import { useAuth } from "../../context/AuthContext";
import { useNavigate } from "react-router";

const Logout: React.FC = () => {
  const navigate = useNavigate();
  const { setIsAuth } = useAuth();

  const logout = async () => {
    try {
      const res = await fetch("http://localhost:8000/auth/logout", {
        method: "POST",
        credentials: "include",
      });

      if (res.ok) {
        setIsAuth(false);
        navigate("/login");
      } else {
        console.error("Logout failed:", await res.text());
      }
    } catch (err) {
      console.error("Logout error:", err);
    }
  };

  return (
    <div>
      <p>ログアウトする</p>
      <button onClick={logout}>ログアウト</button>
    </div>
  );
};

export default Logout;
