import useFetch from "../useFetch";
import { useEffect, useState } from "react";
import LoadingCircle from "../LoadingCircle";
import React from "react";
import { Line, defaults } from "react-chartjs-2";
import "chartjs-adapter-date-fns";
import { srLatn } from "date-fns/locale";
import dateFormat from "dateformat";
import "./Graph.css";
import { Chart } from "chart.js";
import zoomPlugin from "chartjs-plugin-zoom";
//unit je ovjde jedinica celzijus npr za datu komponentu

const Graph = ({ unit, physicalUnits }) => {
  const [sendingDate, setSendingDate] = useState({
    start: new Date(new Date().getTime() - 1000 * 60 * 60),
    end: new Date(),
  });
  const url = `http://127.0.0.1:5000/getGraphsData?unit=${unit}&start=${dateFormat(
    sendingDate.start,
    "yyyy-mm-dd HH:MM"
  )}&end=${dateFormat(sendingDate.end, "yyyy-mm-dd HH:MM")}`;
  const { data: graphsData, error, isPending } = useFetch(url);
  let labels = [];
  let datasets = [];
  const [isThereData, setIsThereData] = useState(false);
  const [optionsAreSet, setOptionsAreSet] = useState(false);
  const [data, setData] = useState(null);
  const [minY, setMin] = useState(null);
  const [maxY, setMax] = useState(null);
  let key = 0;
  let min = null;
  let max = null;
  Chart.register(zoomPlugin);

  //Functions
  const getRandomColor = () => {
    const angle = Math.floor(Math.random() * 360);
    const color = `hsl(${angle},100%,45%)`;
    return color;
  };
  const avg = (array) => {
    let number = 0;
    const sum = array.reduce((acc, { y }) => {
      return (number += y);
    });
    return Math.round((sum / array.length) * 100) / 100;
  };
  const getKey = () => {
    key++;
    return key;
  };
  const getPhysicalUnit = (element) => {
    for (let i = 0; i < physicalUnits.length; i++) {
      if (physicalUnits[i].field == element) {
        setMaxValue(physicalUnits[i].max);
        setMinValue(physicalUnits[i].min);
        return physicalUnits[i].unit;
      }
    }
  };
  const setMaxValue = (value) => {
    if (max != null) {
      if (value > max) max = value;
    } else max = value;
  };

  const setMinValue = (value) => {
    if (min != null) {
      if (value < min) min = value;
    } else min = value;
  };
  const selectFetchData = (value) => {
    const today = new Date();
    const lastHour = new Date(today.getTime() - 1000 * 60 * 60);
    const yesterday = new Date(today.getTime() - 1000 * 60 * 60 * 24);
    const lastWeek = new Date(today.getTime() - 1000 * 60 * 60 * 24 * 7);
    const lastMonth = new Date(today.getTime() - 1000 * 60 * 60 * 24 * 30);

    switch (value) {
      case "1":
        setSendingDate({ start: lastHour, end: today });
        break;
      case "2":
        setSendingDate({ start: yesterday, end: today });
        break;
      case "3":
        setSendingDate({ start: lastWeek, end: today });
        break;
      case "4":
        setSendingDate({ start: lastMonth, end: today });
        break;
    }
  };

  //UseEffect
  useEffect(() => {
    if (!isPending) {
      if (graphsData.length > 0) {
        setIsThereData(false);
        const temp = graphsData.reduce((acc, curr) => {
          Object.entries(curr).map((entry) => {
            const [prop, value] = entry;
            (acc[prop] = acc[prop] ?? []).push(value);
          });
          return acc;
        }, {});

        const result = Object.entries(temp);
        result.map((array) => {
          if (array[0] == "x") labels.push(array[1]);
          else
            datasets.push({
              label: getPhysicalUnit(array[0]),
              data: array[1],
            });
        });

        //Y axis min and max
        setMax(max);
        setMin(min);

        datasets.map((dataset) => {
          let newDataset = dataset.data.map((element, index) => {
            return { x: Date.parse(labels[0][index]), y: Number(element) };
          });
          dataset.data = newDataset;
        });

        datasets.map((element) => {
          const color = getRandomColor();
          element["backgroundColor"] = color;
          element["borderColor"] = color;
        });
        setData({ datasets });
        setIsThereData(true);
      } else {
        setIsThereData(false); //da se sakrije div sa max,min i avg
        labels = [];
        datasets = [];
        setData(null);
        setMin(null);
        setMax(null);
      }
    }
  }, [isPending, graphsData]);

  useEffect(() => {
    if (minY != null && maxY != null) {
      setOptionsAreSet(true);
    }
  }, [minY, maxY]);

  //options
  const options = {
    normalized: true,
    parsing: false,
    animation: false,
    responsiveAnimationDuration: 0,
    tension: 0.2,

    interaction: {
      mode: "nearest",
      axis: "x",
      intersect: false,
    },

    elements: {
      point: {
        radius: 0,
      },
    },
    scales: {
      x: {
        type: "time",
        time: {
          displayFormats: {
            millisecond: "HH:mm:ss.SSS",
            second: "HH:mm:ss",
            minute: "HH:mm",
            hour: "HH",
          },
          ticks: {
            source: "auto",
            maxRotation: 0,
            autoSkip: true,
          },
        },
        adapters: {
          date: {
            locale: srLatn,
          },
        },
      },
      y: {
        spanGaps: true,
        beginAtZero: false,
        min: minY,
        max: maxY,
        ticks: {
          callback: function (value) {
            return `${Math.round(value)} ${unit}`;
          },
        },
      },
    },

    plugins: {
      legend: {
        label: {
          display: true,
          size: 16,
        },
        onClick(e, legendItem, legend) {
          const index = legendItem.datasetIndex;
          const divIndex = index + "_" + unit;
          const divStatistics = document.getElementById(divIndex);
          const ci = legend.chart;
          if (ci.isDatasetVisible(index)) {
            ci.hide(index);
            divStatistics.className = "divStatistics not-showing";
            setTimeout(() => (divStatistics.style.display = "none"), 500);
          } else {
            ci.show(index);
            divStatistics.style.display = "grid";
            setTimeout(
              () => (divStatistics.className = "divStatistics showing"),
              500
            );
          }
        },
      },
      zoom: {
        zoom: {
          wheel: {
            enabled: true,
            speed: 0.2,
            threshold: 2,
            sensitivity: 3,
          },
          limits: {
            y: { min: "original", max: "original" },
          },
          pinch: {
            enabled: true,
          },
          drag: {
            enabled: true,
          },
          mode: "xy",
        },
      },

      tooltip: {
        titleColor: "#5fbae9",
        callbacks: {
          title: (context) => {
            const dateTime = new Date(context[0].parsed.x);
            return dateFormat(dateTime, "dd.mm.yyyy HH:MM:ss");
          },
          label: (context) => {
            var label = context.dataset.label || "";

            if (label) {
              label += ": ";
            }
            if (context.parsed.y !== null) {
              label += `${Math.round(context.parsed.y * 100) / 100} ${unit}`;
            }
            return label;
          },
        },
      },
    },
  };

  return (
    <>
      {isPending && <LoadingCircle />}
      {!isPending && !error && (
        <>
          {isThereData && optionsAreSet && (
            <Line width={900} height={400} data={data} options={options} />
          )}
          {!isThereData && (
            <div className="divNoData">
              <span className="spanNoData">
                Nema podataka za prikaz u intervalu <br /> od{" "}
                <span>{dateFormat(sendingDate.start, "dd.mm.yyyy HH:MM")}</span>{" "}
                do{" "}
                <span>{dateFormat(sendingDate.end, "dd.mm.yyyy HH:MM")}</span>.
              </span>
            </div>
          )}

          <div className="divStatSett">
            <label>Od:</label>
            <input
              type="datetime-local"
              onChange={(e) => {
                let date = { ...sendingDate };
                date.start = e.target.value;
                setSendingDate(date);
              }}
            />
            <label>Do:</label>
            <input
              type="datetime-local"
              onChange={(e) => {
                let date = { ...sendingDate };
                date.end = e.target.value;
                setSendingDate(date);
              }}
            />
            <select onChange={(e) => selectFetchData(e.target.value)}>
              <option value="1" defaultValue>
                Zadnji sat
              </option>
              <option value="2">Zadnji dan</option>
              <option value="3">Zadnjih 7 dana</option>
              <option value="4">Zadnjih 30 dana</option>
            </select>
          </div>

          {isThereData &&
            data.datasets.map((element, index) => {
              let objArrData = Object.values(element.data);
              const numberArray = objArrData.filter((value) => {
                if (!isNaN(value.y)) return value;
              });

              return (
                <div
                  className="divStatistics"
                  style={{
                    color: element["backgroundColor"],
                  }}
                  key={getKey()}
                  id={index + "_" + unit}
                >
                  <label key={getKey()}>
                    Maksimalno:{" "}
                    {Math.round(
                      Math.max.apply(
                        Math,
                        numberArray.map(function (o) {
                          return o.y;
                        })
                      ) * 100
                    ) / 100}{" "}
                    {unit}
                  </label>
                  <label key={getKey()}>
                    Minimalno:{" "}
                    {Math.round(
                      Math.min.apply(
                        Math,
                        numberArray.map(function (o) {
                          return o.y;
                        })
                      ) * 100
                    ) / 100}{" "}
                    {unit}
                  </label>
                  <label key={getKey()}>
                    Prosječno: {avg(numberArray)} {unit}
                  </label>
                </div>
              );
            })}
        </>
      )}
    </>
  );
};

export default Graph;
