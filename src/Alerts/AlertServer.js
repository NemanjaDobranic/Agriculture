import { Alert } from "react-bootstrap";
function AlertServer({ alert, handleCloseAlert }) {
  return (
    <Alert
      className="fadeIn first"
      variant={alert.type}
      style={{
        borderRadius: "10px",
      }}
      dismissible
      onClick={handleCloseAlert}
    >
      <Alert.Heading>{alert.heading}</Alert.Heading>
      <p>{alert.body}</p>
    </Alert>
  );
}

export default AlertServer;
