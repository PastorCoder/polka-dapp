import React, { useState } from "react";
import { Link } from "react-router-dom";
import { useRecoilState } from "recoil";
import {
  balanceState,
  walletNameState,
  chainState,
  nodeNameState,
} from "../../recoil/WalletAtom";

import Connect from "./Connect";

import "../styles/chosenWallet.css";




const TalismanChosen = () => {
  // const [currentBalance, setCurrentBalance] = useState(10);
  const [currentBalance, setCurrentBalance] = useRecoilState(balanceState);
  const [walletName, setWalletName] = useRecoilState(walletNameState);
   const [chain, setChain] = useRecoilState(chainState);
   const [nodeName, setNodeName] = useRecoilState(nodeNameState);
  
  
    return (
      <div>
        <Connect />
        <div className="talisman-card">
          <span>
            Chain : <span className="wallet-name">{chain} </span> <br />
            Node :<span className="wallet-name">{nodeName}</span>
            <br />
            Connected Wallet : 
            <span className="wallet-name"> {walletName} </span>
          </span>
          <hr />
          <span>
            Your current balance is :{" "}
            <span className="balance">{currentBalance} Dot </span>
          </span>

          <Link to="/transfer-funding">
            <button
              className={`${currentBalance === 0 ? "no-money" : "send-btn"}`}
            >
              Transfer
            </button>
          </Link>
        </div>
      </div>
    );
};
export default TalismanChosen

