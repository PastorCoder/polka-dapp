import React, { useState, useEffect } from "react";
import { balanceState, addressState } from "../../recoil/WalletAtom";
import Connect from "./Connect";
import { useRecoilState } from "recoil";
import "../styles/chosenWallet.css";

const Transfer = () => {
  // const [currentBalance, setCurrentBalance] = useState(0);
  const [amount, setAmount] = useState(0);
  const [recipientWallet, setRecipientWallet] = useState(0);
  // const [balance, setBalance] = useRecoilState(balanceState);
  const [balance, setBalance] = useState();
  const [api, setApi] = useState();
  const [accounts, setAccounts] = useState([]);
  const [selectedAccount, setSelectedAccount] = useState();
  const [address, setAddress] = useRecoilState(addressState);

  const handleTransfer = async () => {
    // Sign and send a transfer from Alice to Bob
    const txHash = await api.tx.balances
      .transfer(recipientWallet, amount)
      .signAndSend(address);

    // Show the hash
    console.log(`Submitted with hash ${txHash}`);
  };

  useEffect(() => {
    if (!api) return;
    if (!selectedAccount) return;

    api.query.system.account(selectedAccount.address, ({ data: { free } }) => {
      setBalance(free);
    });

    console.log(balance);
  }, [api, selectedAccount, setBalance]);

  return (
    <div>
      <Connect />
      <div className="talisman-card">
        <span>
          <label htmlFor="amount">Amount </label>
          <input
            type="number"
            id="amount"
            className="amount-input"
            placeholder="Enter Amount"
            onChange={(e) => setAmount(e.target.value)}
          />
          <br />
        </span>
        <span>
          <label htmlFor="amount">Wallet </label>
          <input
            type="text"
            id="wallet"
            className="amount-input"
            placeholder="Enter Recipient's Wallet Address"
            onChange={(e) => setRecipientWallet(e.target.value)}
          />
          <br />
        </span>
        <span className="form-balance-txt">
          Your current balance is :{" "}
          <span className="form-balance-num">{balance} Dot </span>
        </span>

        <button
          onClick={handleTransfer}
          className={`${amount === 0 ? "no-money" : "send-btn"}`}
        >
          Send
        </button>
      </div>
    </div>
  );
};
export default Transfer;
