import useFetch from "../useFetch";
import { Modal } from "react-bootstrap";
import LoadingCircle from "../LoadingCircle";
import { useState, useEffect } from "react";
import ReactTooltip from "react-tooltip";
import "./ModalEditLand.css";
import post from "../post";
const ModalEditLand = ({ channelID, readKey, land_id, handleClick }) => {
  const url =
    "http://127.0.0.1:5000/getChannelFields?channelID=" +
    channelID +
    "&readKey=" +
    readKey;
  const { data, isPending, error } = useFetch(url);
  const url_1 = "http://127.0.0.1:5000/getCheckBoxNames?land_id=" + land_id;
  const { data: checkBoxData, isPending: isPendingCheckBox } = useFetch(url_1);
  let counter = 0;

  const [isReady, setIsReady] = useState(false);
  let [radios, setRadios] = useState(null);
  const [changeMe, setChangeMe] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  useEffect(() => {
    if (!isPending && !isPendingCheckBox) {
      let object = {};

      Object.keys(data).map((key) => {
        let obj = {};
        checkBoxData.map((checkBox) => {
          if (checkBox.field == key) obj[checkBox.unit] = key;
          else obj[checkBox.unit] = null;
        });
        object[key] = obj;
      });
      setRadios(object);
      setChangeMe(!changeMe);
    }
  }, [isPending, isPendingCheckBox]);

  useEffect(() => {
    if (radios) setIsReady(true);
  }, [changeMe]);

  const saveChanges = () => {
    setIsSaving(true);
    let array = [];
    checkBoxData.map((data) => {
      let unit = data.unit;
      let value = null;
      Object.keys(radios).forEach(function (col) {
        Object.keys(radios[col]).forEach(function (row) {
          if (radios[col][row] != null && row == unit) value = radios[col][row];
        });
      });
      array.push([land_id, value, unit]);
    });

    post("http://127.0.0.1:5000/saveConnectedUnits", array).then(() => {
      setIsSaving(false);
      handleClick(true);
    });
  };

  const getKey = () => {
    return counter++;
  };
  const handleRadioBttn = (e) => {
    const col = e.target.getAttribute("data-col");
    const row = e.target.getAttribute("name");
    const value = e.target.value;

    //po vrsti
    Object.keys(radios).forEach(function (key) {
      radios[key][row] = null;
    });

    //po koloni
    Object.keys(radios[col]).forEach(function (key) {
      radios[col][key] = null;
    });
    radios[col][row] = value;

    setRadios(radios);
    setChangeMe(!changeMe);
  };

  return (
    <>
      <Modal
        animation={false}
        size="xl"
        show
        onHide={() => handleClick(false)}
        backdrop="static"
        keyboard={false}
        scrollable={true}
      >
        <Modal.Header closeButton>
          <Modal.Title>Povezivanje mjerenih veličina</Modal.Title>
        </Modal.Header>
        <Modal.Body style={{ display: "grid" }}>
          {!isReady && <LoadingCircle />}
          {isReady && typeof data === "object" && (
            <>
              <table id="tableRadio">
                <thead>
                  <tr>
                    <th></th>
                    {Object.keys(data).map((key) => {
                      return (
                        <th
                          key={key}
                          data-tip={data[key]}
                          data-background-color="#28282b"
                          data-text-color="#5fbae9"
                          data-effect="solid"
                          data-place="bottom"
                          data-delay-show="100"
                          data-multiline="true"
                        >
                          {key}
                          <ReactTooltip />
                        </th>
                      );
                    })}
                  </tr>
                </thead>
                <tbody>
                  {checkBoxData.map((checkBox) => {
                    return (
                      <tr key={getKey()}>
                        <th style={{ border: "hidden" }}>{checkBox.unit}</th>
                        {Object.keys(data).map((key, index) => {
                          return (
                            <td
                              data-label={key}
                              data-hover={Object.values(data)[index]}
                              key={getKey()}
                            >
                              <input
                                type="radio"
                                name={checkBox.unit}
                                data-col={key}
                                checked={
                                  radios[key][checkBox.unit] == null
                                    ? false
                                    : true
                                }
                                value={key}
                                onChange={handleRadioBttn}
                              />
                            </td>
                          );
                        })}
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </>
          )}

          {isReady && typeof data === "string" && <>{data}</>}
        </Modal.Body>

        <hr id="modalFooterLine" />
        <div id="modalFooterBtn">
          <button id="modalCancel" onClick={() => handleClick(false)}>
            Izađi
          </button>
          {isReady && typeof data === "object" && !isSaving && (
            <button id="modalConfirm" onClick={() => saveChanges()}>
              Sačuvaj
            </button>
          )}
          {isSaving && <LoadingCircle />}
        </div>
      </Modal>
    </>
  );
};

export default ModalEditLand;
