import React from "react";
import { useParams } from "react-router-dom";
import LoadingCircle from "../LoadingCircle";
import useFetch from "../useFetch";
import "./DataAnalysis.css";
import Graph from "./Graph";

const DataAnalysis = () => {
  const { id } = useParams();
  const url = "http://127.0.0.1:5000/getNumOfDiagrams?id=" + id;
  const { data: distinctUnits, error, isPending } = useFetch(url);
  const url_1 = "http://127.0.0.1:5000/getUnits?id=" + id;
  const {
    data: physicalUnits,
    error: errPhysUnit,
    isPending: isPendPhysUnits,
  } = useFetch(url_1);

  return (
    <div className="wrapper divGraphTable">
      {isPending && isPendPhysUnits && (
        <div className="LoadingCircleAnalysis">
          <LoadingCircle />
        </div>
      )}
      {!isPending &&
        !error &&
        !isPendPhysUnits &&
        !errPhysUnit &&
        distinctUnits.map((value) => {
          return (
            <div className="graphContent" key={value.unit}>
              <Graph unit={value.unit} physicalUnits={physicalUnits} />
            </div>
          );
        })}
    </div>
  );
};

export default DataAnalysis;
