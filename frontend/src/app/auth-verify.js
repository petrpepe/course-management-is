import { jwtDecode } from "jwt-decode";
import { useEffect } from "react";
import { useSelector } from "react-redux";
import { useLocation, useNavigate } from "react-router-dom";

const AuthVerify = () => {
  const navigate = useNavigate();
  const { user } = useSelector((state) => state.auth);
  const location = useLocation();

  useEffect(() => {
    if (!user && !location.pathname.includes("forgottenPassword")) {
      navigate("/login");
    } else if (!user && location.pathname.includes("forgottenPassword")) {
      const decodedJwt = jwtDecode(
        location.pathname.replace("/forgottenPassword/", "")
      );
      if (decodedJwt.exp * 1000 < Date.now()) {
        navigate("/login");
      }
    } else if (user && !user.token) navigate("/logout");
    else if (user && user.token) {
      const decodedJwt = jwtDecode(user.token);
      if (decodedJwt.exp * 1000 < Date.now()) {
        navigate("/logout");
      }
    }
  }, [user, location.pathname, navigate]);
};

export default AuthVerify;
