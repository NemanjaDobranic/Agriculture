import { useState } from "react";
import info from "../Icons/info.svg";
import "./Info.css";
import ModalLandInfo from "./ModalLandInfo";
import ReactTooltip from "react-tooltip";

const Info = ({ id }) => {
  const [showModal, setShowModal] = useState(false);
  const handleModal = () => {
    setShowModal(false);
  };

  return (
    <>
      <img
        id="info"
        alt="Info"
        src={info}
        data-tip="Dodatne informacije"
        data-background-color="#28282b"
        data-text-color="#5fbae9"
        data-effect="solid"
        data-place="bottom"
        data-delay-show="100"
        data-multiline="true"
        height="24"
        width="24"
        onClick={() => {
          window.scrollTo(0, 0);
          setShowModal(true);
        }}
      />
      <ReactTooltip />
      {showModal && <ModalLandInfo landID={id} handleClick={handleModal} />}
    </>
  );
};

export default Info;
