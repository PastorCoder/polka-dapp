import React, { useEffect } from "react";

import { useRecoilState } from "recoil";
import {
  balanceState,
  walletNameState,
  chainState,
  nodeNameState,
  selectedAccountState,
  accountState,
} from "../../recoil/WalletAtom";


import "../styles/chosenWallet.css";





const SelectAccount = () => {
    const [selectedAccount, setSelectedAccount] =
        useRecoilState(selectedAccountState);
    const [accounts, setAccounts] = useRecoilState(accountState);



     const handleAccountSelection = async (e) => {
       const selectedAddress = e.target.value;

       const account = accounts.find(
         (account) => account.address === selectedAddress
       );

       if (!account) {
         throw Error("NO_ACCOUNT_FOUND");
       }

       setSelectedAccount(account);
    };
    
    useEffect(() => {
        console.log(accounts)
    },[])





    return (
      <div>
        {accounts.length > 0 && !selectedAccount ? (
          <div className="select-account select-account-card">
            <select className="select-option" onChange={handleAccountSelection}>
              <option value="" disabled selected hidden>
                Choose a account
              </option>
              {accounts.map((account) => (
                <option key={account.meta.name} value={account?.address}>
                  {account.meta.name || account.address}
                </option>
              ))}
            </select>
          </div>
        ) : null}
      </div>
    );
}

export default SelectAccount;