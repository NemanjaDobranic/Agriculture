import { useParams } from "react-router-dom";
import useFetch from "../useFetch";
import farm_land from "../Icons/edit-land.svg";
import Select from "../Select";
import FieldSetEdit from "../EditLand/FieldSetEdit";
import "../AddLand/AddLand.css";
import "./EditLand.css";
import post from "../post";
import LoadingCircle from "../LoadingCircle";
import AlertServer from "../Alerts/AlertServer";
import { useHistory } from "react-router";
import { useEffect } from "react";
import { useStateIfMounted } from "use-state-if-mounted";
import React from "react";
import ReactSession from "react-client-session/dist/ReactSession";
import ModalEditLand from "./ModalEditLand";
import MapContainer from "../MapContainer/My_MapContainer";

const EditLand = () => {
  const { id } = useParams();
  const url = "http://127.0.0.1:5000/getLand?id=" + id;
  const role = ReactSession.get("role");
  const { data: land, error, isPending: isPendingLand } = useFetch(url);

  //States
  const [name, setName] = useStateIfMounted("");
  const [size, setSize] = useStateIfMounted("");
  const [town, setTown] = useStateIfMounted("");
  const [place, setPlace] = useStateIfMounted("");
  const [crop, setCrop] = useStateIfMounted("");
  const [landType, setLandType] = useStateIfMounted("");
  const [expectedYield, setExpectedYield] = useStateIfMounted("");
  const [realisedYield, setRealisedYield] = useStateIfMounted("");
  const [cboxIDs, setCboxIDs] = useStateIfMounted(null);
  const [longitude, setLongitude] = useStateIfMounted("");
  const [latitude, setLatitude] = useStateIfMounted("");
  const [isPending, setIsPending] = useStateIfMounted(false);
  const [alert, setAlert] = useStateIfMounted(null);
  const [channelID, setChannelID] = useStateIfMounted(null);
  const [readKey, setReadKey] = useStateIfMounted(null);
  const [showModal, setShowModal] = useStateIfMounted(false);

  const history = useHistory();
  useEffect(() => {
    if (land) {
      setName(land.name);
      setSize(land.size);
      setTown(land.town);
      setPlace(land.place);
      setCrop(land.crop_id);
      setLandType(land.land_type_id);
      setExpectedYield(land.expected_yield);
      setRealisedYield(land.realized_yield);
      setLongitude(land.longitude);
      setLatitude(land.latitude);
      land.channel_id != null
        ? setChannelID(land.channel_id)
        : setChannelID("");
      land.read_key != null ? setReadKey(land.read_key) : setReadKey("");
    }
  }, [land]);

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

  const handleModal = (isSaved) => {
    setShowModal(false);

    alertObj.heading = "Uspješna radnja";
    alertObj.type = "success";
    if (isSaved)
      alertObj.body =
        "Sve izmjene, uključujući povezivanje mjerenih veličina, su uspješno sačuvane!";
    else
      alertObj.body =
        "Sve izmjene, izuzev povezivanja mjerenih veličina, su uspješno sačuvane!";

    handleAlert(alertObj);
    window.scrollTo(0, 0);
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
      id,
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
      channelID,
      readKey,
    };
    setIsPending(true);
    post("http://127.0.0.1:5000/updateLand", land).then(
      () => {
        window.scrollTo(0, 0);
        setIsPending(false);
        if (role != "admin") {
          const timer = 3000;
          alertObj.heading = "Uspješna radnja";
          alertObj.body = `Izmjene su sačuvane.\n Povratak na početnu nakon ${
            timer / 1000
          } s.`;
          alertObj.type = "success";
          handleAlert(alertObj);
          setTimeout(() => {
            history.push("/home");
          }, timer);
        } else setShowModal(true);
      },
      (error) => {
        alertObj.heading = "Neuspješna radnja";
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
    <>
      {isPendingLand && <LoadingCircle />}
      {!isPendingLand && !error && (
        <div className="wrapper">
          {alert && (
            <div
              style={{ width: "100%", maxWidth: "900px", position: "relative" }}
            >
              <AlertServer alert={alert} handleCloseAlert={handleCloseAlert} />
            </div>
          )}
          <div id="formContent" style={{ maxWidth: "900px" }}>
            <div>
              <img
                src={farm_land}
                id="edit-land"
                width="150px"
                height="150px"
                alt="Edit land"
              />
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
                {role == "admin" && (
                  <>
                    <input
                      type="text"
                      placeholder="ID kanala"
                      value={channelID}
                      onChange={(e) => {
                        setChannelID(e.target.value);
                        invalidInt(e.target);
                      }}
                      required
                    />
                    <input
                      type="text"
                      placeholder="Ključ za čitanje podataka"
                      value={readKey}
                      onChange={(e) => {
                        setReadKey(e.target.value);
                      }}
                      maxLength="20"
                      required
                    />
                  </>
                )}
                {role != "admin" && (
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
                )}
                <Select
                  rel="preconnect"
                  url="http://127.0.0.1:5000/getTowns"
                  handleGetData={(data) => {
                    setTown(data);
                  }}
                  placeholder="grad"
                  selected={town}
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
                      coordinates={{
                        lng: Number(longitude),
                        lat: Number(latitude),
                      }}
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
                {role == "admin" && (
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
                )}
                <Select
                  rel="preconnect"
                  url="http://127.0.0.1:5000/getCrops"
                  handleGetData={(data) => {
                    setCrop(data);
                  }}
                  selected={crop}
                  placeholder="poljoprivrednu kulturu"
                />
                <Select
                  rel="preconnect"
                  url="http://127.0.0.1:5000/getLandTypes"
                  handleGetData={(data) => {
                    setLandType(data);
                  }}
                  selected={landType}
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

                <FieldSetEdit
                  handleGetData={(data) => {
                    setCboxIDs(data);
                  }}
                  selected={land.units}
                />
              </div>

              <div className="addLandSubmit">
                {!isPending && (
                  <input
                    type="submit"
                    style={{ margin: "0" }}
                    value={role == "admin" ? "Sljedeće" : "Sačuvaj"}
                  />
                )}

                {isPending && <LoadingCircle />}
              </div>
            </form>
            {showModal && (
              <ModalEditLand
                channelID={channelID}
                readKey={readKey}
                land_id={id}
                handleClick={handleModal}
              />
            )}
          </div>
        </div>
      )}
    </>
  );
};

export default EditLand;
