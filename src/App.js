import "./App.css";
import { BrowserRouter as Router, Route, Switch } from "react-router-dom";
import Form from "./Form/Form";
import ForgotPassword from "./ForgotPassword/ForgotPassword";
import Nav from "./Home/Nav";
import NewPassword from "./NewPassword/NewPassword";
import RoleRoute from "./RoleRoute";
import ReactSession from "react-client-session/dist/ReactSession";
import PrivateRoute from "./PrivateRoute";
import AddLand from "./AddLand/AddLand";
import TableLands from "./TableLands/TableLands";
import EditLand from "./EditLand/EditLand";
import Users from "./Users/Users";
import DataAnalysis from "./DataAnalysis/DataAnalysis";
import EditUser from "./EditUser/EditUser";
import AdminTableLands from "./AdminTableLands/AdminTableLands";

function App() {
  ReactSession.setStoreType("sessionStorage");

  return (
    <Router>
      <div className="App">
        <Switch>
          <Route exact path="/">
            <Form />
          </Route>
          <Route path="/forgotPassword">
            <ForgotPassword />
          </Route>
          <Route path="/newPassword">
            <NewPassword />
          </Route>
          <PrivateRoute path="/home">
            <Nav />

            <RoleRoute role="pro" exact path="/home">
              <TableLands />
            </RoleRoute>
            <RoleRoute role="savj" exact path="/home">
              <TableLands />
            </RoleRoute>
            <RoleRoute role="admin" exact path="/home">
              <AdminTableLands />
            </RoleRoute>

            <RoleRoute role="pro" exact path="/home/addLand">
              <AddLand />
            </RoleRoute>
            <RoleRoute role="admin" exact path="/home/addLand/:id">
              <AddLand />
            </RoleRoute>
            <RoleRoute role="admin" path="/home/users">
              <Users />
            </RoleRoute>

            <RoleRoute role="admin" path="/home/editUser/:id">
              <EditUser />
            </RoleRoute>

            <Route path="/home/editLand/:id">
              <EditLand />
            </Route>
            <Route path="/home/dataAnalysis/:id">
              <DataAnalysis />
            </Route>
          </PrivateRoute>
        </Switch>
      </div>
    </Router>
  );
}

export default App;
