import { useEffect, useState } from "react";
import { useHistory } from "react-router";
import Password from "../Password";
import "../Form/Form.css";
import "../ForgotPassword/ForgotPassword.css";
import post from "../post";
import new_password from "../Icons/new_password.svg"; // Tell Webpack this JS file uses this image
import AlertServer from "../Alerts/AlertServer";
import { Button } from "react-bootstrap";
import LoadingCircle from "../LoadingCircle";
import ReactSession from "react-client-session/dist/ReactSession";

const NewPassword = () => {
  //History object.
  const history = useHistory();

  //Check if there is session
  useEffect(() => {
    if (!ReactSession.get("email")) {
      history.push("/");
    }
  }, []);

  //States
  const [alert, setAlert] = useState(null);
  const [password, setPassword] = useState("");
  const [isPending, setIsPending] = useState(false);

  //Alert object.
  const alertObj = {
    heading: "",
    body: "",
    type: "",
  };

  //Handles
  const handlePassword = (password_val) => {
    setPassword(password_val);
  };

  const handleCloseAlert = () => {
    setAlert(null);
  };
  const handleAlert = (alert) => {
    setAlert(alert);
  };
  const handleChnagePassword = (e) => {
    e.preventDefault();
    const user = {
      email: ReactSession.get("email"),
      password: password,
    };
    setIsPending(true);
    post("http://127.0.0.1:5000/setNewPassword", user).then(
      (data) => {
        if (!data.includes(user.email)) {
          alertObj.heading = "Uspjeh!";
          alertObj.body = `${data}`;
          alertObj.type = "success";
        } else {
          alertObj.heading = "Greška!";
          alertObj.body = `Lozinka je već promijenjena.`;
          alertObj.type = "danger";
        }
        handleAlert(alertObj);
        setIsPending(false);
      },
      (error) => {
        alert.heading = "Greška srevera";
        alert.body = `Dogodila se greška. Greška: ${error}. Obratite se administratoru.`;
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
          variant="contained first forgotPassClose"
          onClick={() => {
            history.push("/");
          }}
        >
          Zatvori
        </Button>
        <div className="forgotPasswordImg">
          <img src={new_password} alt="User Icon" />
        </div>
        <div className="forgotPasswordDiv">
          <p className="forgotPasswordParagraph">
            Unijeli ste privremenu lozinku.
            <br />
            <span>Unesite novu lozinku!</span>
          </p>
          <form id="formForgotPass" onSubmit={handleChnagePassword}>
            <Password
              placeholder="Nova lozinka"
              handlePassword={handlePassword}
              required="true"
            />
            {!isPending && <input type="submit" value="Podnesi" />}
            {isPending && <LoadingCircle />}
          </form>
        </div>
      </div>
    </div>
  );
};
export default NewPassword;
