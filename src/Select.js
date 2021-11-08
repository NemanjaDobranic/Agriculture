import { useEffect } from "react";
import { useState } from "react";
import LoadingCircle from "./LoadingCircle";
import useFetch from "./useFetch";

const Select = ({ url, handleGetData, placeholder, selected, className }) => {
  const { data, isPending, error } = useFetch(url);
  const [displayValue, setDisplayValue] = useState("");
  useEffect(() => {
    setDisplayValue(selected);
  }, [selected]);

  return (
    <select
      className={className}
      value={displayValue}
      onChange={(e) => {
        handleGetData(e.target.value);
        setDisplayValue(e.target.value);
      }}
      required
    >
      <option value="" disabled defaultValue hidden>
        Izaberite {placeholder}
      </option>
      {isPending && (
        <option disabled hidden>
          <LoadingCircle />
        </option>
      )}
      {error && (
        <option disabled hidden>
          Could not load {placeholder}...
        </option>
      )}
      {!isPending &&
        !error &&
        data.map((row) =>
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
  );
};

export default Select;
