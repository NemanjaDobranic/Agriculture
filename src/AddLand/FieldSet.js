import { useEffect } from "react";
import { useState } from "react";
import LoadingCircle from "../LoadingCircle";
import useFetch from "../useFetch";
import "./FieldSet.css";
const FieldSet = ({ handleGetData }) => {
  //States
  const { data, isPending, error } = useFetch(
    "http://127.0.0.1:5000/getMeasuredUnits"
  );
  const [cboxIDs, setCboxIDs] = useState(new Array());
  const [checkedState, setCheckedState] = useState(null);
  const [colorArray, setColorArray] = useState(new Array());
  let updatedCheckedState = new Array();
  //Hook
  useEffect(() => {
    let isMounted = true;
    if (data != null && isMounted == true) {
      let array = new Array(1)
        .fill(true)
        .concat(new Array(data.length - 1).fill(false));
      setCheckedState(array);
      setColorArray(new Array(data.length).fill("#636c72"));

      setCboxIDs([data[0].id]);
      handleGetData([data[0].id]);
    }

    //cleanup Function
    return () => {
      isMounted = false;
    };
  }, [data]);

  useEffect(() => {}, [cboxIDs]);

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
      {isPending && <LoadingCircle />}
      {error && <label>Could not load measured units!</label>}
      {!isPending &&
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
                checked={checkedState == null ? false : checkedState[index]}
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
