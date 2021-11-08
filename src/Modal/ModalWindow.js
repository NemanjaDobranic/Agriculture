import { useEffect } from "react";
import { Modal } from "react-bootstrap";
import "./ModalWindows.css";
import { useStateIfMounted } from "use-state-if-mounted";
const ModalWindow = ({ id, role, handleClick }) => {
  const [title, setTitle] = useStateIfMounted("");
  const [body, setBody] = useStateIfMounted("");

  useEffect(() => {
    if (typeof id === "number") {
      setTitle("Brisanje površine");
      setBody(
        "Povrišna će biti odmah obrisana. Ova radnja se ne može poništiti."
      );
    } else if (role === "pro") {
      setTitle("Brisanje proizvođača");
      setBody(
        `Korisnik ${id} je proizvođač.
         Njegovim brisanjem, sve površine koje posjeduje biće takođe obrisane.
         Ova radnja se ne može poništiti.`
      );
    } else if (role === "savj") {
      setTitle("Brisanje savjetodavca");
      setBody(
        `Korisnik ${id} je savjetodavac.
         Njegovim brisanjem, sve površine koje su mu bile dodjeljene biće oduzete.
         Ova radnja se ne može poništiti.`
      );
    } else {
      setTitle("Brisanje administratora");
      setBody(
        `Korisnik ${id} je administrator.
         Administrator će biti odmah uklonjen iz baze.
         Ova radnja se ne može poništiti.`
      );
    }
  }, []);
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
          <Modal.Title>{title}</Modal.Title>
        </Modal.Header>
        <Modal.Body>{body}</Modal.Body>

        <hr id="modalFooterLine" />
        <div id="modalFooterBtn">
          <button id="modalCancel" onClick={() => handleClick(false)}>
            Otkaži
          </button>

          <button id="modalDelete" onClick={() => handleClick(true)}>
            Obriši
          </button>
        </div>
      </Modal>
    </>
  );
};

export default ModalWindow;
