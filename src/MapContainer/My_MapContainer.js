import { GoogleMap, useJsApiLoader, Marker } from "@react-google-maps/api";
import { useCallback, useEffect, useState } from "react";
import LoadingCircle from "../LoadingCircle";
const MapContainer = ({ coordinates, handleParentState }) => {
  const mapStyles = {
    height: "379px",
    width: "100%",
  };
  //States
  const [defaultPosition, setDefaultPosition] = useState({
    lat: 43.82335037310757,
    lng: 18.37441921234131,
  });
  const [currentPosition, setCurrentPosition] = useState({});
  const { isLoaded } = useJsApiLoader({
    id: "google-map-script",
    googleMapsApiKey: "AIzaSyBL8TpDK8GDVBSCnmVLBRjPgaF57QpSomc",
  });

  //Hooks
  useEffect(() => {
    if (coordinates) {
      setCurrentPosition({
        lat: coordinates.lat,
        lng: coordinates.lng,
      });
      setDefaultPosition({
        lat: coordinates.lat,
        lng: coordinates.lng,
      });
    } else {
      navigator.geolocation.getCurrentPosition(success);
    }
  }, [coordinates]);

  //Handles
  const success = (position) => {
    const currentPosition = {
      lat: position.coords.latitude,
      lng: position.coords.longitude,
    };
    setCurrentPosition(currentPosition);
    setDefaultPosition(currentPosition);
  };

  const onMarkerDragEnd = (e) => {
    const lat = e.latLng.lat();
    const lng = e.latLng.lng();
    setCurrentPosition({ lat, lng });
    setDefaultPosition({ lat, lng });
    handleParentState({ lat, lng });
  };

  const handleClick = ({ latLng }) => {
    const lat = latLng.lat();
    const lng = latLng.lng();

    setCurrentPosition({ lat, lng });
    setDefaultPosition({ lat, lng });
    handleParentState({ lat, lng });
  };
  return isLoaded ? (
    <GoogleMap
      mapContainerStyle={mapStyles}
      zoom={13}
      center={{
        lat: parseFloat(defaultPosition.lat),
        lng: parseFloat(defaultPosition.lng),
      }}
      mapTypeId={window.google.maps.MapTypeId.ROADMAP}
      animation={window.google.maps.Animation.DROP}
      onClick={(e) => handleClick(e)}
    >
      {currentPosition.lat ? (
        <Marker
          position={currentPosition}
          onDragEnd={(e) => onMarkerDragEnd(e)}
          draggable={true}
        />
      ) : (
        <Marker
          position={defaultPosition}
          onDragEnd={(e) => onMarkerDragEnd(e)}
          draggable={true}
        />
      )}
    </GoogleMap>
  ) : (
    <LoadingCircle />
  );
};

export default MapContainer;
