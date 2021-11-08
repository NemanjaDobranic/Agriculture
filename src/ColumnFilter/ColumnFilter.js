import React, { useState } from "react";
import "./ColumnFilter.css";
const ColumnFilter = ({ column }) => {
  const { filterValue, setFilter } = column;
  const [input, setInput] = useState("input");
  const [button, setButton] = useState("search");
  const [isClosed, setIsClosed] = useState(false);
  const handleButton = () => {
    if (isClosed) {
      setInput("input square");
      setButton("search closeSearch");
    } else {
      setInput("input");
      setButton("search");
      setFilter("");
    }
    setIsClosed(!isClosed);
  };
  return (
    <span key="content" id="content">
      <input
        key="input"
        value={filterValue || ""}
        className={input}
        onChange={(e) => {
          setFilter(e.target.value);
        }}
        id="search-input"
      />
      <button
        key="reset"
        type="reset"
        className={button}
        onClick={handleButton}
        id="search-btn"
      ></button>
    </span>
  );
};

export default ColumnFilter;
