import { ChangeEvent, useEffect, useState } from "react";
import { WsProvider, ApiPromise } from "@polkadot/api";
import { getWallets } from "@talismn/connect-wallets";


import { web3Enable, web3Accounts, web3FromAddress } from "@polkadot/extension-dapp";
import { InjectedAccountWithMeta } from "@polkadot/extension-inject/types";
import BN from "bn.js";


const NAME = "GmOrDie";
const period = "MORNING | NIGHT | MIDONE | MIDTWO";
const AMOUNT = new BN(10).mul(new BN(10).pow(new BN(10)))
const WS_ENDPOINT = "wss://ws.gm.bldnodes.org/";
const WS_SECOND_ENDPOINT = "wss://rpc.polkadot.io";
// const WS_SECOND_ENDPOINT = "wss://statemine-rpc-tn.dwellir.com";

function Dapp() {
    const [api, setApi] = useState();
    const [accounts, setAccounts] = useState([]);
    const [selectedAccount, setSelectedAccount] = useState();
    const [period, setPeriod] = useState();
    const [balance, setBalance] = useState();

     const setup = async () => {
       const wsProvider = new WsProvider(WS_ENDPOINT);
       const api = await ApiPromise.create({ provider: wsProvider });
       setApi(api);
       // console.log(api);
    };
    


     const handleConnection = async () => {
       const extensions = await web3Enable(NAME);

       if (!extensions) {
         throw Error("No_EXTENSION_FOUND");
       }

       const allAccounts = await web3Accounts();

       if (allAccounts.length === 0) {
         setSelectedAccount(allAccounts[0]);
       }

       console.log("Extensions is : ", extensions);

       setAccounts(allAccounts);
    };
    

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
    

    useEffect(() => {
      // console.log(AMOUNT.toString());
      setup();
    }, []);

    useEffect(() => {
      if (!api) return;

      (async () => {
        const period = (
          await api.query.currencies.currentTimePeriod()
        ).toPrimitive();

        const parsedPeriod = period.toUpperCase();
        setPeriod(parsedPeriod);
        console.log(period);
      })();
      // (
      //   async () => {
      //     const time = await api.query.timestamp.now();
      //     console.log(time.toPrimitive())
      //   }
      // )();
    }, [api]);

    useEffect(() => {
      if (!api) return;
      if (!selectedAccount) return;

      api.query.system.account(
        selectedAccount.address,
        ({ data: { free } }) => {
          setBalance(free);
        }
      );
    }, [api, selectedAccount]);
  


    return (
      <div>
        {accounts.length === 0 ? (
          <button onClick={handleConnection}>Connect</button>
        ) : null}

        {accounts.length > 0 && !selectedAccount ? (
          <div>
            <select onChange={handleAccountSelection}>
              <option value="" disabled selected hidden>
                Choose your account
              </option>
              {accounts.map((account) => (
                <option key={account.meta.name} value={account.address}>
                  {account.meta.name || account.address}
                </option>
              ))}
            </select>
          </div>
        ) : null}

        {selectedAccount ? (
          <div>
            <button onClick={handleBurn}>Burn 10 $FREN</button>
            <span>BALANCE: {balance?.toNumber()}</span>
          </div>
        ) : null}
      </div>
    );
    
}

export default Dapp;
