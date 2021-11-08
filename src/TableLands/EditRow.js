import "./EditRow.css";
import { useHistory } from "react-router";
import ReactTooltip from "react-tooltip";

const EditRow = ({ image, url, tooltip }) => {
  const history = useHistory();

  return (
    <>
      <img
        id="edit"
        alt="Edit"
        data-tip={tooltip}
        data-background-color="#28282b"
        data-text-color="#5fbae9"
        data-effect="solid"
        data-place="bottom"
        data-delay-show="100"
        data-multiline="true"
        height="24"
        width="24"
        src={image}
        onClick={() => history.push(url)}
      />
      <ReactTooltip />
    </>
  );
};

export default EditRow;
