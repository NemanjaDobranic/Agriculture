import { useEffect } from "react";
import LoadingCircle from "../LoadingCircle";
import useFetch from "../useFetch";
import "../AddLand/FieldSet.css";
import { useStateIfMounted } from "use-state-if-mounted";
const FieldSet = ({ selected, handleGetData }) => {
  //States
  const url = "http://127.0.0.1:5000/getMeasuredUnits";
  const { data, isPending, error } = useFetch(url);
  const [cboxIDs, setCboxIDs] = useStateIfMounted(null);
  const [checkedState, setCheckedState] = useStateIfMounted([]);
  const [colorArray, setColorArray] = useStateIfMounted([]);
  let updatedCheckedState = [];
  const [isReady, setIsReady] = useStateIfMounted(false);

  let checkedStateTemp = [];
  let colorArrayTemp = [];
  //Hook
  useEffect(() => {
    let array = [];
    for (let i = 0; i < selected.length; i++) {
      array.push(selected[i]["unit_id"].toString());
    }
    setCboxIDs(array);
    handleGetData(array);
  }, []);

  useEffect(() => {
    if (cboxIDs != null && !isPending) {
      setIsReady(true);
    }
  }, [cboxIDs, isPending]);

  const selectContainsID = (select, id, index) => {
    let bool = false;
    for (let i = 0; i < select.length; i++) {
      if (select[i]["unit_id"] == id) bool = true;
    }

    if (index < data.length) {
      checkedStateTemp.push(bool);
      bool ? colorArrayTemp.push("#0d0d0d") : colorArrayTemp.push("#636c72");
    }
    if (index == data.length - 1) {
      setCheckedState(checkedStateTemp);
      setColorArray(colorArrayTemp);
    }
    return bool;
  };

  //Handles
  const handleOnChange = (position, checkBox) => {
    updatedCheckedState = checkedState.map((item, index) =>
      index === position ? !item : item
    );
    setCheckedState(updatedCheckedState);

    const updatedColorState = updatedCheckedState.map((item) =>
      item === true ? "#0d0d0d" : "#636c72"
    );
    setColorArray(updatedColorState);

    if (!checkBox.checked) {
      let filter = cboxIDs.filter((value) => {
        return value != checkBox.id;
      });
      setCboxIDs(filter);
      handleGetData(filter);
    } else {
      cboxIDs.push(checkBox.id);
      setCboxIDs(cboxIDs);
      handleGetData(cboxIDs);
    }
  };
  const handleChange = ({ target }) => {
    const allStatesFalse = updatedCheckedState.every(
      (element) => element === false
    );
    allStatesFalse
      ? target.setCustomValidity(
          "Mora se označiti barem jedna mjerena veličina!"
        )
      : target.setCustomValidity("");
  };
  return (
    <fieldset
      id="cBoxFieldSet"
      className="checkBoxFieldSet"
      onChange={handleChange}
    >
      <legend>Izaberite mjerene veličine:</legend>
      {!isReady && <LoadingCircle />}
      {isReady &&
        !error &&
        data.map((checkboxData, index) => {
          return (
            <label
              key={checkboxData.unit}
              style={{
                color: colorArray == null ? "#636c72" : colorArray[index],
              }}
              className="labelCheckBox"
            >
              <input
                key={checkboxData.id}
                id={checkboxData.id}
                type="checkbox"
                checked={
                  checkedState.length == 0
                    ? selectContainsID(selected, checkboxData.id, index)
                      ? true
                      : false
                    : checkedState[index]
                }
                onChange={(e) => handleOnChange(index, e.target)}
              />{" "}
              {checkboxData.unit}
            </label>
          );
        })}
    </fieldset>
  );
};

export default FieldSet;
