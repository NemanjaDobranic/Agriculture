import { useState } from "react";
import eye from "./Icons/eye.svg";
import eyeSlash from "./Icons/eye-slash.svg";
import { useEffect } from "react";
const Password = ({ required, handlePassword, placeholder }) => {
  const [password, setPassword] = useState("");
  const [passwordShown, setPasswordShown] = useState(false);

  const invalidPassword = () => {
    const passwordInput = document.getElementById("password");
    if (required == "true") {
      if (!(password.length >= 6 && password.length <= 20)) {
        passwordInput.setCustomValidity(
          "Dužina lozinke mora biti između 6 i 20 znakova!"
        );
      } else {
        passwordInput.setCustomValidity("");
      }
    } else {
      if (
        password.length > 0 &&
        !(password.length >= 6 && password.length <= 20)
      )
        passwordInput.setCustomValidity(
          "Dužina lozinke mora biti između 6 i 20 znakova!"
        );
      else passwordInput.setCustomValidity("");
    }
  };

  const togglePasswordVisiblity = () => {
    setPasswordShown(passwordShown ? false : true);
  };
  useEffect(() => {
    handlePassword(password);
    invalidPassword();
  }, [password]);
  return (
    <div id="passwordDiv">
      {required == "true" && (
        <input
          type={passwordShown ? "text" : "password"}
          id="password"
          name="password"
          placeholder={placeholder}
          value={password}
          onInput={(e) => {
            setPassword(e.target.value);
          }}
          required
        />
      )}

      {required == "false" && (
        <input
          type={passwordShown ? "text" : "password"}
          id="password"
          name="password"
          placeholder={placeholder}
          value={password}
          onInput={(e) => {
            setPassword(e.target.value);
          }}
        />
      )}

      {!passwordShown && (
        <img
          id="imgEye"
          title="Show"
          src={eye}
          onClick={togglePasswordVisiblity}
        />
      )}
      {passwordShown && (
        <img
          id="imgEye"
          title="Hide"
          src={eyeSlash}
          onClick={togglePasswordVisiblity}
        />
      )}
    </div>
  );
};

export default Password;
