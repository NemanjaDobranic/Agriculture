import "./SearchStyle.css";
import search from "../Icons/serach.svg";
import { useState } from "react";
import { useAsyncDebounce } from "react-table";
const Search = ({ filter, setFilter }) => {
  const [value, setValue] = useState(filter);

  const onChange = useAsyncDebounce((value) => {
    setFilter(value || undefined);
  }, 100);

  return (
    <div className="wrapper fadeInDown" style={{ paddingBottom: "0" }}>
      <div className="search-box">
        <input
          className="search-txt"
          type="text"
          value={filter || ""}
          onChange={(e) => {
            setValue(e.target.value);
            onChange(e.target.value);
          }}
          placeholder="Pretraga"
        />
        <img className="search-btn" src={search} alt="Search" />
      </div>
    </div>
  );
};

export default Search;
