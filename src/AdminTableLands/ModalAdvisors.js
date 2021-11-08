import { Modal } from "react-bootstrap";
import "../Modal/ModalWindows.css";
const ModalAdvisors = ({ handleClick }) => {
  return (
    <>
      <Modal
        animation={false}
        show
        onHide={() => handleClick(false)}
        backdrop="static"
        keyboard={false}
      >
        <Modal.Header closeButton>
          <Modal.Title>Uklanjanje savjetodavca</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          Savjetodavac neće više imati mogućnost uvida u podatke sa dodjeljene
          površine.
        </Modal.Body>

        <hr id="modalFooterLine" />
        <div id="modalFooterBtn">
          <button id="modalCancel" onClick={() => handleClick(false)}>
            Otkaži
          </button>

          <button id="modalDelete" onClick={() => handleClick(true)}>
            Ukloni
          </button>
        </div>
      </Modal>
    </>
  );
};

export default ModalAdvisors;
