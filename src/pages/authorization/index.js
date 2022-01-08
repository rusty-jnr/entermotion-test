import React, { useEffect } from "react";
import { Dropbox } from "dropbox";
import "./style.css";
import { GrDropbox } from "react-icons/gr";

function Authorization() {
  const dbx = new Dropbox({ clientId: process.env.REACT_APP_CLIENT_ID });

  useEffect(() => {
    dbx.auth
      .getAuthenticationUrl("http://localhost:3000/auth")
      .then((authUrl) => {
        document.getElementById("authlink").href = authUrl;
      });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <div className="authorization">
      <a href="/" id="authlink">
        Dropbox Authorization <GrDropbox size={20} />
      </a>
    </div>
  );
}

export default Authorization;
