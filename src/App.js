import logo from "./logo.svg";
import "./App.css";
import { ethers } from "ethers";
import { useState } from "react";

function App() {
  const [accounts, setaccounts] = useState([]);

  const [receiverAddress, setreceiverAddress] = useState("");

  const [amountToSend, setamountToSend] = useState("");

  const [error, setError] = useState("");

  const [provider, setprovider] = useState(null);

  const [ethBalance, setethBalance] = useState('')

  const getAccounts = async () => {
    // MetaMask requires requesting permission to connect users accounts
    try {
      if (!window.ethereum)
        throw new Error("No crypto wallet found. Please install it.");

      let a = await window.ethereum.send("eth_requestAccounts");
      // console.log(a)
      setaccounts(a.result);
      const p = new ethers.providers.Web3Provider(window.ethereum);
      setprovider(p);
      const balance = await p.getBalance(a.result[0])
      console.log(ethers.utils.formatEther(balance))
      setethBalance(ethers.utils.formatEther(balance))
    } catch (err) {
      setError(err.message);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const signer = provider.getSigner();
      ethers.utils.getAddress(accounts[0]);
      const tx = await signer.sendTransaction({
        to: receiverAddress,
        value: ethers.utils.parseEther(amountToSend),
      });
      console.log({ receiverAddress, amountToSend });
      console.log("tx", tx);
      // setTxs([tx]);
    } catch (err) {
      setError(err.message);
    }
  };

  return (
    <div className="App">
      <header className="App-header">
        <img src={logo} className="App-logo" alt="logo" />
        
        <button
          onClick={() => {
            getAccounts();
          }}
        >
          Connect
        </button>
        <p>{accounts[0]}</p>

        <h1>
          ETH Balance: {ethBalance}
        </h1>

        <form
          onSubmit={handleSubmit}
          style={{ display: "flex", flexDirection: "column" }}
        >
          <input
            type="text"
            placeholder="Enter the account you want to send ethers to"
            onChange={(e) => {
              setreceiverAddress(e.target.value);
            }}
          />
          <input
            type="text"
            placeholder="amount"
            onChange={(e) => {
              setamountToSend(e.target.value);
            }}
          />
          <button type="submit">Send</button>
        </form>
          
        <h1>
          Testing With Contracts
        </h1>

        

        <h2 style={{ color: "red" }}>{error}</h2>
      </header>
    </div>
  );
}

export default App;
