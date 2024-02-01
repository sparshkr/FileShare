import "./App.css";
import { ethers } from "ethers";
import { useEffect, useState } from "react";
import Header from "./Components/Header";
import abi from "./Components/contractJson/FileMarketplace.json";
// import FileUpload from "./Components/FileUpload";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import BuyFiles from "./Pages/BuyFiles";
import MyFiles from "./Pages/MyFiles";
import Upload from "./Pages/Upload";

function App() {
  const [user, setUser] = useState("");
  const [state, setState] = useState({
    provider: null,
    signer: null,
    contract: null,
  });
  useEffect(() => {
    const contractABI = abi.abi;
    // const contractAddress = "0x849d524CC849BD055E595f5F3Bce4Ca404B2617E";
    // const contractAddress = "0xE5cde6CB79d79dbA15884EaFb66B2aDDC58A5aC4";
    // const contractAddress = "0x1aF3f86EfD8f5D6d4b992F0e409A576EB9BeE9bc";
    const contractAddress = "0x8b94adD71a18c76bE79D6FCd8aFD014f1B657242";

    async function init() {
      window.addEventListener("load", async function () {
        if (window.ethereum) {
          console.log("Ethereum support is available");
          if (window.ethereum.isMetaMask) {
            console.log("MetaMask is active");
            const provider = new ethers.BrowserProvider(window.ethereum);
            // It will prompt user for account connections if it isnt connected
            const signer = await provider.getSigner();
            const contract = await new ethers.Contract(
              contractAddress,
              contractABI,
              signer
            );
            console.log(contract);

            setState({ provider, signer, contract });
            console.log(state);
            console.log(provider);
            console.log(signer);

            console.log("Account:", await signer.getAddress());
            const account = await window.ethereum.request({
              method: "eth_requestAccounts",
            });
            setUser(account);
            window.ethereum.on("accountsChanged", () => {
              window.location.reload();
            });
          } else {
            console.log("MetaMask is not available");
          }
        } else {
          console.log("Ethereum support is not found");
          alert("Add Metamask");
          this.window.location.replace(
            "https://chromewebstore.google.com/detail/metamask/nkbihfbeogaeaoehlefnkodbefgpgknn"
          );
        }
      });
    }
    init();
  });

  return (
    <BrowserRouter>
      <Header Account={user}></Header>
      <Routes>
        <Route path="/" element={<Upload state={state} />} />
        <Route path="/Upload" element={<Upload state={state} />} />
        <Route path="/MyFiles" element={<MyFiles state={state} />} />
        <Route path="/BuyFiles" element={<BuyFiles state={state} />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
