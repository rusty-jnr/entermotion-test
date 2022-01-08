import React, { useState, useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import "./style.css";

function Auth() {
  const [error, setError] = useState(false);
  const [token, setToken] = useState("");
  let navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    const params = new URLSearchParams(location.hash);
    const paramsArray = [...params.entries()];
    if (paramsArray[0][1] === "access_denied") {
      setError(true);
    } else {
      setToken(paramsArray[1][1]);
      setError(false);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const AccessDenied = () => {
    return (
      <div className="access_denied">
        <p>Access Denied</p>
        <button onClick={() => navigate("/")}>Return to Authorization</button>
      </div>
    );
  };

  const AccessGranted = () => {
    return (
      <div className="access_denied">
        <p>Authorization Successful</p>
        <button
          onClick={() => {
            localStorage.setItem("access_token", token);
            window.location.reload();
          }}
        >
          Login
        </button>
      </div>
    );
  };

  return (
    <div className="auth">{!error ? <AccessGranted /> : <AccessDenied />}</div>
  );
}

export default Auth;
