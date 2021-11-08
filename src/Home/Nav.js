import "./Nav.css";
import { useState } from "react";
import LoadingCircle from "../LoadingCircle";
import { useHistory } from "react-router";
import AlertServer from "../Alerts/AlertServer";
import { Link } from "react-router-dom";
import ReactSession from "react-client-session/dist/ReactSession";

const Nav = () => {
  const [hamburger, setHamburger] = useState("hamburger");
  const [navLinks, setNavLinks] = useState("nav-links");
  const [link, setLink] = useState(null);
  const [isOpened, setIsOpened] = useState(false);
  const [isPending, setIsPending] = useState(false);
  const [error, setError] = useState(null);
  const history = useHistory();
  const role = ReactSession.get("role");
  const [alert, setAlert] = useState({
    heading: "",
    body: "",
    type: "",
  });

  const handleHamburger = () => {
    if (isOpened) {
      setHamburger("hamburger");
      setNavLinks("nav-links");
      setLink(null);
    } else {
      setHamburger("hamburger toggle");
      setNavLinks("nav-links open");
      setLink("fade");
    }
    setIsOpened(!isOpened);
  };

  const handleCloseAlert = () => {
    setError(null);
  };

  const handleSignOut = () => {
    setIsPending(true);
    fetch("http://127.0.0.1:5000/logout", { credentials: "include" })
      .then((res) => {
        if (!res.ok) {
          throw Error("could not fetch data for that resource");
        } else {
          setIsPending(false);
          setError(null);
          ReactSession.remove("role");
          ReactSession.remove("email");
          history.push("/");
        }
      })
      .catch((err) => {
        setIsPending(false);
        setAlert({
          heading: "Error",
          body: err.message,
          type: "danger",
        });
        setError(err);
      });
  };
  return (
    <div>
      <nav className="fadeInDown">
        <div className={hamburger} onClick={handleHamburger}>
          <div className="line1"></div>
          <div className="line2"></div>
          <div className="line3"></div>
        </div>
        <ul className={navLinks}>
          <li className={link}>
            <Link to="/home">Početna</Link>
          </li>
          {role === "pro" && (
            <li className={link}>
              <Link to="/home/addLand">Dodajte površinu</Link>
            </li>
          )}
          {role === "admin" && (
            <li className={link}>
              <Link to="/home/users">Korisnici</Link>
            </li>
          )}

          <li className={link}>
            {!isPending && (
              <button className="sign-out-button" onClick={handleSignOut}>
                Odjavi se
              </button>
            )}
            {isPending && (
              <div style={{ padding: "0.6rem 0.8rem" }}>
                <LoadingCircle />
              </div>
            )}
          </li>
        </ul>
      </nav>
      {error && (
        <div className="wrapper">
          <AlertServer alert={alert} handleCloseAlert={handleCloseAlert} />
        </div>
      )}
    </div>
  );
};

export default Nav;
