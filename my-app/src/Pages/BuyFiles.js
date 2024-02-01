import Card1 from "../Components/Card1";
import { useEffect, useState } from "react";
import Modal from "react-bootstrap/Modal";

export default function BuyFiles(props) {
  const [show, setShow] = useState(false);
  const [Message, setMessage] = useState("Successful");
  const [filesTotal, setFilesTotal] = useState([]);

  const handleClose = () => window.location.reload();

  useEffect(() => {
    const getTotalSupply = async () => {
      try {
        const files = await props.state.contract.getFiles();
        setFilesTotal(files); // Update state
        // console.log(files[0].id.toString()); // Log the fetched files
        // console.log(files[1].id); // Log the fetched files
        // setShow(true);
      } catch (error) {
        console.error("Error fetching total supply:", error);
        setMessage(error.message);
        setShow(true);
      }
    };

    if (props.state.contract) {
      getTotalSupply();
    }
  }, [props.state.contract]);

  return (
    <>
      <Modal show={show} onHide={handleClose}>
        <Modal.Header closeButton>
          <Modal.Title>Message from FileShare</Modal.Title>
        </Modal.Header>
        <Modal.Body>{Message}</Modal.Body>
        <Modal.Footer>
          <button
            onClick={handleClose}
            className="px-4 py-1 text-sm text-purple-600 font-semibold rounded-full border border-purple-200 hover:text-white hover:bg-purple-600 hover:border-transparent focus:outline-none focus:ring-2 focus:ring-purple-600 focus:ring-offset-2"
          >
            Close
          </button>
        </Modal.Footer>
      </Modal>
      <div className="bg-gray-300 border-box h-screen -m-0.5rem p-0 overflow-auto">
        <div className="flex flex-wrap justify-center -mt-0.5rem">
          {/* <Card></Card>
        <Card></Card>
        <Card></Card>
        <Card></Card> */}
          {filesTotal.map((file) => {
            return (
              <Card1
                state={props.state}
                id={file.id.toString()}
                key={file.id.toString()}
                author={file.author}
                price={file.price.toString()}
                title={file.title}
              ></Card1>
            );
          })}
        </div>
      </div>
    </>
  );
}
