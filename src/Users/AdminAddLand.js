import addLand from "../Icons/admin-add-land.svg";
import { useHistory } from "react-router";
import "./AdminAddLand.css";
import ReactTooltip from "react-tooltip";

const AdminAddLand = ({ id }) => {
  const history = useHistory();
  return (
    <>
      <img
        id="addLandAdmin"
        alt="add land"
        data-tip="Unos površine"
        data-background-color="#28282b"
        data-text-color="#5fbae9"
        data-effect="solid"
        data-place="bottom"
        data-delay-show="100"
        data-multiline="true"
        height="24"
        width="22"
        src={addLand}
        onClick={() => history.push(`/home/addLand/${id}`)}
      />
      <ReactTooltip />
    </>
  );
};

export default AdminAddLand;
