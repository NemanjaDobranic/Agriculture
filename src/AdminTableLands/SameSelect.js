import { useEffect } from "react";
import { useState } from "react";
import ModalAdvisors from "./ModalAdvisors";
const SameSelect = ({
  data,
  handleGetData,
  placeholder,
  selected,
  className,
}) => {
  const [displayValue, setDisplayValue] = useState("");
  const [showModal, setShowModal] = useState(false);
  useEffect(() => {
    setDisplayValue(selected);
  }, [selected]);

  const handleModal = (response) => {
    setShowModal(false);
    if (response) {
      handleGetData(null);
      setDisplayValue("");
    }
  };

  return (
    <>
      {showModal && <ModalAdvisors handleClick={handleModal} />}
      <select
        className={className}
        value={displayValue}
        onChange={(e) => {
          handleGetData(e.target.value);
          setDisplayValue(e.target.value);
        }}
        onDoubleClick={() => {
          if (displayValue != "") {
            window.scrollTo(0, 0);
            setShowModal(true);
          }
        }}
        required
      >
        <option value="" disabled defaultValue hidden>
          Izaberite {placeholder}
        </option>

        {data.map((row) =>
          row.type == null ? (
            <option key={row.id} value={row.id}>
              {row.naziv}
            </option>
          ) : (
            <optgroup key={row.type} label={row.type}>
              {row.options.map((element) => {
                return (
                  <option key={element.id} value={element.id}>
                    {element.naziv}
                  </option>
                );
              })}
            </optgroup>
          )
        )}
      </select>
    </>
  );
};

export default SameSelect;
