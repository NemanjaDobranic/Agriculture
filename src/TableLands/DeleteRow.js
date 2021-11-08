import { useStateIfMounted } from "use-state-if-mounted";
import trash from "../Icons/trash.svg";
import LoadingCircle from "../LoadingCircle";
import "./DeleteRow.css";
import post from "../post";
import ModalWindow from "../Modal/ModalWindow";
import ReactTooltip from "react-tooltip";
const DeleteRow = ({ url, id, HandleRowDelete, role }) => {
  const [isPending, setIsPending] = useStateIfMounted(false);
  const [showModal, setShowModal] = useStateIfMounted(false);

  const handleModal = (response) => {
    setShowModal(false);
    if (response) deleteRowDB(id);
  };

  const deleteRowDB = (id) => {
    setIsPending(true);
    post(url, id).then(() => {
      HandleRowDelete(id);
      setIsPending(false);
    });
  };
  return (
    <>
      {!isPending && (
        <>
          <img
            id="trash"
            alt="Delete"
            src={trash}
            data-tip="Brisanje površine"
            data-background-color="#28282b"
            data-text-color="#5fbae9"
            data-effect="solid"
            data-place="bottom"
            data-delay-show="100"
            data-multiline="true"
            height="24"
            width="24"
            onClick={() => {
              window.scrollTo(0, 0);
              setShowModal(true);
            }}
          />
          <ReactTooltip />
        </>
      )}
      {!isPending && showModal && (
        <ModalWindow id={id} handleClick={handleModal} role={role} />
      )}
      {isPending && <LoadingCircle />}
    </>
  );
};

export default DeleteRow;
