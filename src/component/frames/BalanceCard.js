import React from "react";

import { useRecoilState } from "recoil";
import BN from "bn.js";
import {
  balanceState,
  walletNameState,
  chainState,
  nodeNameState,
  selectedAccountState,
  accountState,
  apiState,
} from "../../recoil/WalletAtom";
import { web3FromAddress } from "@polkadot/extension-dapp";

import "../styles/chosenWallet.css";


const AMOUNT = new BN(10).mul(new BN(10).pow(new BN(10)));

const BalanceCard = () => {
  const [selectedAccount, setSelectedAccount] =
    useRecoilState(selectedAccountState);
    const [accounts, setAccounts] = useRecoilState(accountState);
    const [balance, setBalance] = useRecoilState(balanceState);
    const [api, setApi] = useRecoilState(apiState);




     const handleBurn = async () => {
       if (!api) return;

       if (!selectedAccount) return;

       const injector = await web3FromAddress(selectedAccount.address);

       await api.tx.currencies
         .burnFren(AMOUNT)
         .signAndSend(selectedAccount.address, {
           signer: injector.signer,
         }); //FREN : Unknown word
     };

 

  return (
    <div>
      {selectedAccount ? (
        <div className="select-account select-account-card">
          {/** <button onClick={handleBurn}>Burn 10 $FREN</button>
          <span>BALANCE: {balance}</span> */}
                  <button>Burn 10 $FREN</button>
                  <span>10, 000,000 FRENS</span>
        </div>
      ) : null}
    </div>
  );
};

export default BalanceCard;
