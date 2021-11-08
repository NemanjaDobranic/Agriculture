import useFetch from "../useFetch";
import { Modal } from "react-bootstrap";
import LoadingCircle from "../LoadingCircle";
import "./ModalLandInfo.css";

const ModalLandInfo = ({ landID, handleClick }) => {
  const url = "http://127.0.0.1:5000/getLandInfo?id=" + landID;
  const { data: landData, isPending, error } = useFetch(url);
  return (
    <>
      <Modal
        animation={false}
        size="lg"
        show
        onHide={() => handleClick()}
        backdrop="static"
        keyboard={false}
      >
        <Modal.Header closeButton>
          <Modal.Title>Dodatne informacije</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          {isPending && <LoadingCircle />}
          {!isPending && !error && (
            <>
              <table
                id="modalTable"
                style={{ position: "relative", width: "100%", border: "none" }}
              >
                <tbody>
                  <tr>
                    <td data-label="Veličina površine">
                      {Math.round(landData.size * 100) / 100}
                    </td>
                    <td data-label="Mjesto">{landData.place}</td>
                    <td data-label="Očekivani prinos">
                      {Math.round(landData.expected_yield * 100) / 100}
                    </td>
                    <td data-label="Ostvareni prinos">
                      {Math.round(landData.realized_yield * 100) / 100}
                    </td>
                    <td data-label="Proizvođačev email">{landData.pro}</td>
                    <td data-label="Savjetodavčev email">
                      {landData.advisor != null
                        ? landData.advisor
                        : "Savjetodavac nije dodijeljen."}
                    </td>
                  </tr>
                </tbody>
              </table>
            </>
          )}
        </Modal.Body>

        <hr id="modalFooterLine" />
        <div id="modalFooterBtn" style={{ gridTemplateColumns: "1fr" }}>
          <button id="modalCancel" onClick={() => handleClick()}>
            Izađi
          </button>
        </div>
      </Modal>
    </>
  );
};

export default ModalLandInfo;
