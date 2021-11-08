import { useEffect, useState } from "react";
import farm_land from "../Icons/farm-land.svg";
import Select from "../Select";
import FieldSet from "./FieldSet";
import "./AddLand.css";
import post from "../post";
import LoadingCircle from "../LoadingCircle";
import AlertServer from "../Alerts/AlertServer";
import React from "react";
import { useParams } from "react-router-dom";
import MapContainer from "../MapContainer/My_MapContainer";

const AddLand = () => {
  //States
  const [name, setName] = useState("");
  const [size, setSize] = useState("");
  const [town, setTown] = useState("");
  const [place, setPlace] = useState("");
  const [crop, setCrop] = useState("");
  const [landType, setLandType] = useState("");
  const [expectedYield, setExpectedYield] = useState("");
  const [realisedYield, setRealisedYield] = useState("");
  const [cboxIDs, setCboxIDs] = useState(null);
  const [longitude, setLongitude] = useState("");
  const [latitude, setLatitude] = useState("");
  const [isPending, setIsPending] = useState(false);
  const [alert, setAlert] = useState(null);

  const { id: userEmail } = useParams();

  useEffect(() => {}, [cboxIDs]);
  //Alert object.
  const alertObj = {
    heading: "",
    body: "",
    type: "",
  };
  //Handles
  const invalidSize = (size) => {
    const pattern = /^\d+\.?\d+$/;
    let result = pattern.test(size.value);
    !result
      ? size.setCustomValidity("Ovo polje može biti cijeli ili decimalan broj!")
      : size.setCustomValidity("");
  };
  const invalidInt = (size) => {
    const pattern = /^\d+$/;
    let result = pattern.test(size.value);
    !result
      ? size.setCustomValidity("Ovo polje mora biti cijeli broj!")
      : size.setCustomValidity("");
  };

  const handleLatLng = ({ lat, lng }) => {
    setLatitude(lat);
    setLongitude(lng);
  };
  const checkGeoInputs = ({ target: input }) => {
    longitude.length === 0 && latitude.length === 0
      ? input.setCustomValidity(
          `Postavite marker na kartu da biste dobili ${input.placeholder.toLowerCase()}.`
        )
      : input.setCustomValidity("");
  };
  const handleSubmit = (e) => {
    e.preventDefault();
    const land = {
      name,
      size,
      town,
      place,
      crop,
      landType,
      expectedYield,
      realisedYield,
      cboxIDs,
      longitude,
      latitude,
      userEmail,
    };
    setIsPending(true);
    post("http://127.0.0.1:5000/addLand", land).then(
      (data) => {
        if (!data.includes("Greška")) {
          alertObj.heading = "Uspješna radnja";
          alertObj.body = data;
          alertObj.type = "success";
          handleAlert(alertObj);
          window.scrollTo(0, 0);
          setIsPending(false);
        } else {
          alertObj.heading = "Neuspješna radnja";
          alertObj.body = data;
          alertObj.type = "warning";
          handleAlert(alertObj);
          window.scrollTo(0, 0);
          setIsPending(false);
        }
      },
      (error) => {
        alertObj.heading = "Greška";
        alertObj.body = error;
        alertObj.type = "danger";
        handleAlert(alertObj);
        window.scrollTo(0, 0);
        setIsPending(false);
      }
    );
  };
  const handleCloseAlert = () => {
    setAlert(null);
  };
  const handleAlert = (alert) => {
    setAlert(alert);
  };
  return (
    <div className="wrapper">
      {alert && (
        <div style={{ width: "100%", maxWidth: "900px", position: "relative" }}>
          <AlertServer alert={alert} handleCloseAlert={handleCloseAlert} />
        </div>
      )}
      <div id="formContent" style={{ maxWidth: "900px" }}>
        <div>
          <img src={farm_land} alt="User Icon" width="150px" height="150px" />
        </div>
        <form id="formAddLand" onSubmit={handleSubmit}>
          <div id="left">
            <input
              type="text"
              placeholder="Naziv površine"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
            />

            <input
              type="text"
              placeholder="Iznos površine u &#13217;"
              value={size}
              onChange={(e) => {
                setSize(e.target.value);
                invalidSize(e.target);
              }}
              required
            />

            <Select
              rel="preconnect"
              url="http://127.0.0.1:5000/getTowns"
              handleGetData={(data) => {
                setTown(data);
              }}
              placeholder="grad"
            />
            <input
              type="text"
              placeholder="Mjesto"
              value={place}
              onChange={(e) => setPlace(e.target.value)}
              required
            />
            <fieldset id="GoogleMapFieldSet" className="fadeIn sixth">
              <legend>Locirajte površinu markerom:</legend>
              <React.Suspense fallback={<LoadingCircle />}>
                <MapContainer
                  handleParentState={(latLng) => handleLatLng(latLng)}
                />
              </React.Suspense>
              <input
                type="text"
                className="geoInput"
                placeholder="Geo. širina"
                value={latitude}
                onInput={(e) => {
                  e.preventDefault();
                }}
                onInvalid={checkGeoInputs}
                required
              />
              <input
                type="text"
                className="geoInput"
                placeholder="Geo. dužina"
                value={longitude}
                onInput={(e) => {
                  e.preventDefault();
                }}
                onInvalid={checkGeoInputs}
                required
              />
            </fieldset>
          </div>
          <div id="right">
            <Select
              rel="preconnect"
              url="http://127.0.0.1:5000/getCrops"
              handleGetData={(data) => {
                setCrop(data);
              }}
              placeholder="poljoprivrednu kulturu"
            />
            <Select
              rel="preconnect"
              url="http://127.0.0.1:5000/getLandTypes"
              handleGetData={(data) => {
                setLandType(data);
              }}
              placeholder="tip površine"
            />
            <input
              type="text"
              placeholder="Očekivani prinos po &#13217;"
              value={expectedYield}
              onChange={(e) => {
                setExpectedYield(e.target.value);
                invalidSize(e.target);
              }}
              required
            />
            <input
              type="text"
              placeholder="Ostvareni prinos po &#13217;"
              value={realisedYield}
              onChange={(e) => {
                setRealisedYield(e.target.value);
                invalidSize(e.target);
              }}
              required
            />

            <FieldSet
              handleGetData={(data) => {
                setCboxIDs(data);
              }}
            />
          </div>

          <div className="addLandSubmit">
            {!isPending && (
              <input
                type="submit"
                style={{ margin: "0" }}
                value="Dodaj površinu"
              />
            )}
            {isPending && <LoadingCircle />}
          </div>
        </form>
      </div>
    </div>
  );
};

export default AddLand;
