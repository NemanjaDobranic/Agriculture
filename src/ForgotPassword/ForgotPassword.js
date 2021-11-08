//Imports
import { useState } from "react";
import "../Form/Form.css";
import "./ForgotPassword.css";
import post from "../post";
import forgot_password from "../Images/forgot_password.png"; // Tell Webpack this JS file uses this image
import AlertServer from "../Alerts/AlertServer";
import { Button } from "react-bootstrap";
import LoadingCircle from "../LoadingCircle";
import { useHistory } from "react-router";

const ForgotPassword = () => {
  //States
  const [alert, setAlert] = useState(null);
  const [email, setEmail] = useState("");
  const [isPending, setIsPending] = useState(false);

  //Alert object.
  const alertObj = {
    heading: "",
    body: "",
    type: "",
  };

  //History object.
  const history = useHistory();

  //Handles
  const handleCloseAlert = () => {
    setAlert(null);
  };
  const handleAlert = (alert) => {
    setAlert(alert);
  };
  const handleChnagePassword = (e) => {
    e.preventDefault();

    setIsPending(true);
    post("http://127.0.0.1:5000/getTempPassword", email).then(
      (data) => {
        if (!data.includes(email)) {
          alertObj.heading = "Uspješno slanje!";
          alertObj.body = `${data}`;
          alertObj.type = "success";
        } else {
          alertObj.heading = "Upozorenje!";
          alertObj.body = `${data}`;
          alertObj.type = "warning";
        }
        handleAlert(alertObj);
        setIsPending(false);
      },
      (error) => {
        alertObj.heading = "Greška servera!";
        alertObj.body = `Dogodila se greška. Greška: ${error}. Obratite se administratoru.`;
        alertObj.type = "danger";
        handleAlert(alertObj);
        setIsPending(false);
      }
    );
  };
  //Return
  return (
    <div className="wrapper">
      {alert && (
        <AlertServer alert={alert} handleCloseAlert={handleCloseAlert} />
      )}
      <div id="formContent">
        <Button
          variant="contained forgotPassClose"
          onClick={() => {
            history.push("/");
          }}
        >
          Zatvori
        </Button>
        <div className="forgotPasswordImg">
          <img src={forgot_password} alt="User Icon" />
        </div>
        <div className="second forgotPasswordDiv">
          <p className="forgotPasswordParagraph">
            Unesite adresu e-pošte i privremena lozinka će biti poslata na
            unijetu adresu e-pošte.
            <br />
            <span>Prilikom sljedeće prijave</span> od Vas će biti zatraženo da
            unesete novu lozinku!
          </p>
          <form id="formForgotPass" onSubmit={handleChnagePassword}>
            <input
              type="Email"
              id="email"
              name="email"
              placeholder="Email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
            {!isPending && <input type="submit" id="fpBttn" value="Pošalji" />}
            {isPending && <LoadingCircle />}
          </form>
        </div>
      </div>
    </div>
  );
};

export default ForgotPassword;
