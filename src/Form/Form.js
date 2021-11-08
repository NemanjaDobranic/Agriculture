import { useState } from "react";
import "./Form.css";
import InputFields from "./InputFields";
import AlertServer from "../Alerts/AlertServer";
import { Link } from "react-router-dom";
import React from "react";
import user_logo from "../Images/user.png";
const Form = () => {
  const [SignIn, setSignIn] = useState("active");
  const [SignUp, setSignUp] = useState("inactive underlineHover");
  const [option, setOption] = useState("Prijava");
  const [alert, setAlert] = useState(null);

  const handleSignIn = (e) => {
    if (SignUp === "active") {
      setSignIn("active");
      setSignUp("inactive underlineHover");
      setOption(e.target.innerHTML);
    }
  };
  const handleSignUp = (e) => {
    if (SignIn === "active") {
      setSignUp("active");
      setSignIn("inactive underlineHover");
      setOption(e.target.innerHTML);
    }
  };
  const handleAlert = (alert) => {
    setAlert(alert);
    if (alert.type === "success") {
      document.getElementById("SignIn").click();
    }
  };
  const handleCloseAlert = () => {
    setAlert(null);
  };
  return (
    <div className="wrapper">
      {alert && (
        <div style={{ width: "100%", maxWidth: "450px", position: "relative" }}>
          <AlertServer alert={alert} handleCloseAlert={handleCloseAlert} />
        </div>
      )}
      <div id="formContent">
        <h2 className={SignIn} id="SignIn" onClick={(e) => handleSignIn(e)}>
          Prijava
        </h2>
        <h2 className={SignUp} onClick={(e) => handleSignUp(e)}>
          Registracija
        </h2>

        <div>
          <img src={user_logo} alt="User Icon" />
        </div>

        <InputFields opt_name={option} handleAlert={handleAlert} />

        <div id="formFooter">
          <Link className="underlineHover" to={`/forgotPassword`}>
            Zaboravili ste lozinku?
          </Link>
        </div>
      </div>
    </div>
  );
};

export default Form;
