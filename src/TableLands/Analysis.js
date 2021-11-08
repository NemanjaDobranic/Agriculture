import analysis from "../Icons/data-analysis.svg";
import analysis_hover from "../Icons/data-analysis-hover.svg";
import "./Analysis.css";
import { useHistory } from "react-router";
import { useState } from "react";
import ReactTooltip from "react-tooltip";

const Analysis = ({ id }) => {
  const history = useHistory();
  const [isHover, setIsHover] = useState(false);
  return (
    <>
      <img
        id="analysisIcon"
        alt="data-analysis"
        data-tip="Vizuelizacija i analiza <br/> podataka"
        data-background-color="#28282b"
        data-text-color="#5fbae9"
        data-effect="solid"
        data-place="bottom"
        data-delay-show="100"
        data-multiline="true"
        height="22"
        width="22"
        src={!isHover ? analysis : analysis_hover}
        onMouseOver={() => setIsHover(true)}
        onMouseOut={() => setIsHover(false)}
        onClick={() => history.push(`/home/dataAnalysis/${id}`)}
      />
      <ReactTooltip />
    </>
  );
};

export default Analysis;
