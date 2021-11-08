import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { useHistory } from "react-router";
import post from "../post";
import LoadingCircle from "../LoadingCircle";
import useFetch from "../useFetch";
import edit_user from "../Icons/edit-user-image.svg";
import "./EditUser.css";
import Password from "../Password";
import Select from "../Select";
import AlertServer from "../Alerts/AlertServer";

const EditUser = () => {
  const { id } = useParams();
  const url = "http://127.0.0.1:5000/getUser?id=" + id;
  const { data: user, error, isPending: isPendingUser } = useFetch(url);

  //States
  const [name, setName] = useState("");
  const [surname, setSurname] = useState("");
  const [email, setEmail] = useState("");
  const [oldEmail, setOldEmail] = useState("");
  const [password, setPassword] = useState("");
  const [phone, setPhone] = useState("");
  const [town, setTown] = useState("");
  const [place, setPlace] = useState("");
  const [street, setStreet] = useState("");
  const [streetNum, setStreetNum] = useState("");
  const [role, setRole] = useState("");
  const [isPending, setIsPending] = useState(false);
  const [alert, setAlert] = useState(null);
  const history = useHistory();
  //Alert object.
  const alertObj = {
    heading: "",
    body: "",
    type: "",
  };

  //Hooks
  useEffect(() => {
    if (!isPendingUser) {
      if (user != null) {
        setName(user.name);
        setSurname(user.surname);
        setEmail(user.email);
        setOldEmail(user.email);
        setPhone(user.phone);
        setTown(user.town);
        setPlace(user.place);
        setStreet(user.street);
        setStreetNum(user.street_num);
        setRole(user.user_type);
      } else history.push("/home");
    }
  }, [isPendingUser]);

  //Handles
  const handlePassword = (password_val) => {
    setPassword(password_val);
  };
  const handleAlert = (alert) => {
    setAlert(alert);
  };
  const handleCloseAlert = () => {
    setAlert(null);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const user = {
      name,
      surname,
      email,
      oldEmail,
      password,
      phone,
      town,
      place,
      street,
      streetNum,
      role,
    };

    setIsPending(true);
    post("http://127.0.0.1:5000/updateUser", user).then(
      () => {
        window.scrollTo(0, 0);
        const timer = 3000;
        alertObj.heading = "Success";
        alertObj.body = `User ${email} is successfuly updated.\n Redirects to home after ${
          timer / 1000
        } seconds.`;
        alertObj.type = "success";
        handleAlert(alertObj);
        setIsPending(false);
        setTimeout(() => {
          history.push("/home");
        }, timer);
      },
      (error) => {
        alertObj.heading = "Error";
        alertObj.body = error;
        alertObj.type = "danger";
        handleAlert(alertObj);
        window.scrollTo(0, 0);
        setIsPending(false);
      }
    );
  };

  //Functions
  const invalidNumber = (number) => {
    const pattern = /^[0-9]{3}[0-9]{6}$/;
    let result = pattern.test(number.value);
    if (!result) {
      number.setCustomValidity(
        "Phone number is made of numbers and must include area code or mobile prefix!"
      );
    } else {
      number.setCustomValidity("");
    }
  };

  return (
    <>
      {isPendingUser && <LoadingCircle />}
      {!isPendingUser && !error && (
        <div className="wrapper">
          {alert && (
            <div
              style={{ width: "100%", maxWidth: "900px", position: "relative" }}
            >
              <AlertServer alert={alert} handleCloseAlert={handleCloseAlert} />
            </div>
          )}

          <div id="formContent" style={{ maxWidth: "900px" }}>
            <div style={{ display: "grid", justifyContent: "center" }}>
              <img
                src={edit_user}
                style={{ margin: "20px 0" }}
                width="125"
                height="125"
                alt="User Icon"
              />
            </div>
            <form id="formAddLand" onSubmit={handleSubmit}>
              <div id="left">
                <input
                  type="text"
                  id="name"
                  placeholder="Ime"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  required
                />
                <input
                  type="text"
                  id="surname"
                  placeholder="Prezime"
                  value={surname}
                  onChange={(e) => setSurname(e.target.value)}
                  required
                />
                <input
                  type="Email"
                  id="login"
                  placeholder="Email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                />
                <Password
                  placeholder="Nova Lozinka"
                  handlePassword={handlePassword}
                  required="false"
                />

                <input
                  type="tel"
                  id="phone"
                  placeholder="Telefon"
                  value={phone}
                  onChange={(e) => {
                    setPhone(e.target.value);
                    invalidNumber(e.target);
                  }}
                  required
                />
              </div>
              <div id="right">
                <Select
                  rel="preconnect"
                  url="http://127.0.0.1:5000/getUserTypes"
                  handleGetData={(data) => {
                    setRole(data);
                  }}
                  placeholder="Tip korisnika"
                  selected={role}
                />
                <Select
                  rel="preconnect"
                  url="http://127.0.0.1:5000/getTowns"
                  handleGetData={(data) => {
                    setTown(data);
                  }}
                  placeholder="Grad"
                  selected={town}
                />
                <input
                  type="text"
                  id="place"
                  placeholder="Mjesto"
                  value={place}
                  onChange={(e) => setPlace(e.target.value)}
                  required
                />

                <input
                  type="text"
                  id="street"
                  placeholder="Ulica"
                  value={street}
                  onChange={(e) => setStreet(e.target.value)}
                  required
                />
                <input
                  type="text"
                  id="street_num"
                  placeholder="Broj Ulice"
                  value={streetNum}
                  onChange={(e) => setStreetNum(e.target.value)}
                  required
                />
              </div>

              <div className="addLandSubmit">
                {!isPending && (
                  <input
                    type="submit"
                    style={{ margin: "0" }}
                    value="Ažuriraj"
                  />
                )}
                {isPending && <LoadingCircle />}
              </div>
            </form>
          </div>
        </div>
      )}
    </>
  );
};

export default EditUser;
