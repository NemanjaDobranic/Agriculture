import React from "react";
import { Route, Redirect } from "react-router-dom";
import useFetch from "./useFetch";
import ReactSession from "react-client-session/dist/ReactSession";
const PrivateRoute = ({ children, ...rest }) => {
  const { data: session, isPending } = useFetch(
    "http://127.0.0.1:5000/getsession"
  );
  if (!isPending) {
    ReactSession.set("role", session.role);
    ReactSession.set("email", session.email);
    return (
      <Route
        {...rest}
        render={() => {
          return session.email ? children : <Redirect to="/" />;
        }}
      />
    );
  } else {
    return null;
  }
};

export default PrivateRoute;
