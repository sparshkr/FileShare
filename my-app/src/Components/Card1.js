import { ethers } from "ethers";
import { useState } from "react";
import Modal from "react-bootstrap/Modal";
export default function Card1(props) {
  const [show, setShow] = useState(false);
  const [Message, setMessage] = useState("Successful");
  const handleClose = () => window.location.reload();
  // console.log(props.state);
  async function handleBuy() {
    try {
      // // console.log(props.state.contract);
      // // console.log(props.id);
      // const options = { value: ethers.parseUnits(props.price, "gwei") };
      // // const reciept = await contract.buyPunk(1001, options);
      // await props.state.contract.buyFile(props.id, options);
      const options = { value: ethers.parseUnits(props.price, "gwei") };
      const tx = await props.state.contract.buyFile(props.id, options);
      await tx.wait();
      setShow(true);
    } catch (e) {
      console.log(e);
      setMessage(e.message);
      setShow(true);
    }
  }
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
      <div className="p-4 max-w-sm ">
        <div className="flex rounded-lg h-full dark:bg-gray-700 bg-gray-700 p-8 flex-col">
          <div className="flex items-center mb-3">
            <div className="w-8 h-8 mr-3 inline-flex items-center justify-center rounded-full dark:bg-indigo-500 bg-indigo-500 text-white flex-shrink-0">
              <svg
                fill="none"
                stroke="currentColor"
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                className="w-5 h-5"
                viewBox="0 0 24 24"
              >
                <path d="M22 12h-4l-3 9L9 3l-3 9H2" />
              </svg>
            </div>
            <h2 className="text-white dark:text-white text-lg font-medium">
              Name: {props.title}
            </h2>
          </div>
          <div className="flex items-center ">
            <h2 className="text-white dark:text-white text-lg font-medium mr-2">
              Price: {props.price / 1e9}
            </h2>
            <img
              src="https://cryptologos.cc/logos/ethereum-eth-logo.svg?v=029"
              alt="Ether Icon"
              width="20"
              height="20"
            />
          </div>
          <div className="flex flex-col justify-between flex-grow">
            <p className="leading-relaxed text-base text-white dark:text-gray-300">
              Id: {props.id}
            </p>
            <button
              onClick={handleBuy}
              className="mt-3 text-white dark:text-white hover:text-blue-600 inline-flex items-center no-underline"
            >
              Buy
              <svg
                fill="none"
                stroke="currentColor"
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                className="w-4 h-4 ml-2"
                viewBox="0 0 24 24"
              >
                <path d="M5 12h14M12 5l7 7-7 7" />
              </svg>
            </button>
          </div>
        </div>
      </div>
    </>
  );
}
