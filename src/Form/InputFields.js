//Imports
import { useEffect, useState } from "react";
import post from "../post";
import LoadingCircle from "../LoadingCircle";
import { useHistory } from "react-router";
import Password from "../Password";
import ReactSession from "react-client-session/dist/ReactSession";
import Select from "../Select";

//States
const InputFields = ({ opt_name, handleAlert }) => {
  const [name, setName] = useState("");
  const [surname, setSurname] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [phone, setPhone] = useState("");
  const [town, setTown] = useState("");
  const [place, setPlace] = useState("");
  const [street, setStreet] = useState("");
  const [streetNum, setStreetNum] = useState("");

  const [isPendingSignUp, setIsPendingSignUp] = useState(false);
  const [isPendingSignIn, setIsPendingSignIn] = useState(false);

  //Alert object.
  const alert = {
    heading: "",
    body: "",
    type: "",
  };

  //History object.
  const history = useHistory();

  //Handles
  const handlePassword = (password_val) => {
    setPassword(password_val);
  };

  const handleSignUp = (e) => {
    e.preventDefault();

    const user = {
      name,
      surname,
      email,
      password,
      phone,
      town,
      place,
      street,
      streetNum,
    };

    setIsPendingSignUp(true);
    post("http://127.0.0.1:5000/addUser", user).then(
      (data) => {
        window.scrollTo(0, 0);
        if (!data.includes(email)) {
          alert.heading = "Uspješna registracija!";
          alert.body = `${data}\nSada se možete prijaviti!`;
          alert.type = "success";
        } else {
          alert.heading = "Upozorenje!";
          alert.body = `${data}`;
          alert.type = "warning";
        }
        handleAlert(alert);
        setIsPendingSignUp(false);
      },
      (error) => {
        window.scrollTo(0, 0);
        alert.heading = "Greška srevera";
        alert.body = `Dogodila se greška. Greška: ${error}. Obratite se administratoru.`;
        alert.type = "danger";
        handleAlert(alert);
        setIsPendingSignUp(false);
      }
    );
  };

  const handleSignIn = (e) => {
    e.preventDefault();

    const user = {
      email,
      password,
    };

    setIsPendingSignIn(true);
    post("http://127.0.0.1:5000/login", user).then(
      (data) => {
        if (data.includes(email)) {
          alert.heading = "Neuspješna prijava";
          alert.body = `${data}`;
          alert.type = "warning";

          handleAlert(alert);
          setIsPendingSignIn(false);
        } else if (data.includes("netačna")) {
          alert.heading = "Neuspješna prijava";
          alert.body = `${data}`;
          alert.type = "danger";

          handleAlert(alert);
          setIsPendingSignIn(false);
        } else if (data.includes("Privremena lozinka")) {
          ReactSession.set("email", email);
          setIsPendingSignIn(false);
          history.push("/newPassword");
        } else {
          setIsPendingSignIn(false);
          ReactSession.remove("email");
          history.push("/home");
        }
      },
      (error) => {
        alert.heading = "Greška srevera";
        alert.body = `Dogodila se greška. Greška: ${error}. Obratite se administratoru.`;
        alert.type = "danger";
        handleAlert(alert);
        setIsPendingSignIn(false);
      }
    );
  };

  const invalidNumber = (number) => {
    const pattern = /^[0-9]{3}[0-9]{6}$/;
    let result = pattern.test(number.value);
    if (!result) {
      number.setCustomValidity(
        "Telefonski broj sastoji se od brojeva i mora sadržavati pozivni broj ili prefiks mobilnog telefona!"
      );
    } else {
      number.setCustomValidity("");
    }
  };

  //Use Effect
  useEffect(() => {
    setName("");
    setSurname("");
    setEmail("");
    setPassword("");
    setPhone("");
    setTown("");
    setPlace("");
    setStreet("");
    setStreetNum("");
  }, [opt_name]);

  if (opt_name === "Prijava") {
    return (
      <form onSubmit={handleSignIn}>
        <input
          type="Email"
          id="email"
          name="email"
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
        />
        <Password
          placeholder="Lozinka"
          handlePassword={handlePassword}
          required="true"
        />
        {isPendingSignIn && <LoadingCircle />}
        {!isPendingSignIn && <input type="submit" value="Prijavi se" />}
      </form>
    );
  } else {
    return (
      <form onSubmit={handleSignUp}>
        <input
          type="text"
          id="name"
          name="name"
          placeholder="Ime"
          value={name}
          onChange={(e) => setName(e.target.value)}
          required
        />
        <input
          type="text"
          id="surname"
          name="surname"
          placeholder="Prezime"
          value={surname}
          onChange={(e) => setSurname(e.target.value)}
          required
        />
        <input
          type="Email"
          id="login"
          name="email"
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
        />
        <Password
          placeholder="Lozinka"
          handlePassword={handlePassword}
          required="true"
        />

        <input
          type="tel"
          id="phone"
          name="phone"
          placeholder="Telefon"
          value={phone}
          onChange={(e) => {
            setPhone(e.target.value);
            invalidNumber(e.target);
          }}
          required
        />

        <Select
          rel="preconnect"
          url="http://127.0.0.1:5000/getTowns"
          handleGetData={(data) => {
            setTown(data);
          }}
          placeholder="grad"
        />

        <input
          type="text"
          id="place"
          name="place"
          placeholder="Mjesto"
          value={place}
          onChange={(e) => setPlace(e.target.value)}
          required
        />

        <input
          type="text"
          id="street"
          name="street"
          placeholder="Ulica"
          value={street}
          onChange={(e) => setStreet(e.target.value)}
          required
        />
        <input
          type="text"
          id="street_num"
          name="street_num"
          placeholder="Broj ulice"
          value={streetNum}
          onChange={(e) => setStreetNum(e.target.value)}
          required
        />

        {isPendingSignUp && <LoadingCircle />}
        {!isPendingSignUp && <input type="submit" value="Registruj se" />}
      </form>
    );
  }
};

export default InputFields;
