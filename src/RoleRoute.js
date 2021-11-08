import React from "react";
import { Route, Redirect } from "react-router-dom";
import ReactSession from "react-client-session/dist/ReactSession";
const RoleRoute = ({ role, children, ...rest }) => {
  return (
    <Route
      {...rest}
      render={() => {
        return ReactSession.get("role") === role ? (
          children
        ) : (
          <Redirect to="/home" />
        );
      }}
    />
  );
};

export default RoleRoute;
