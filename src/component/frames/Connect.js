import { useEffect, useState } from "react";
import { WsProvider, ApiPromise, Keyring } from "@polkadot/api";
import { Link } from "react-router-dom";
import {
  PolkadotjsWallet,
  getWallets,
  TalismnProvider,
} from "@talismn/connect-wallets";
import {
  web3Enable,
  web3Accounts,
  web3FromAddress,
} from "@polkadot/extension-dapp";
// import { InjectedAccountWithMeta } from "@polkadot/extension-inject/types";
import BN from "bn.js";
import { useRecoilState } from "recoil";
import {
  balanceState,
  walletNameState,
  chainState,
  nodeNameState,
  addressState,
} from "../../recoil/WalletAtom";

import WalletsModal from "./WalletsModal";
import TalismanChosen from "./TalismanChosen";
import TalismanLogo from "../assets/Talisman-Logo.png";
import polkadotJsLogo from "../assets/polkadot{.js} Wallet.jpg";
import PolkagateLogo from "../assets/polkagate.jpg";
import NovaWalletLogo from "../assets/Nova-Wallet-Logo-Update.png";

import "../styles/connect.css";

const NAME = "GmOrDie";
const period = "MORNING | NIGHT | MIDONE | MIDTWO";
const AMOUNT = 0
// const AMOUNT = new BN(10).mul(new BN(10).pow(new BN(10)));
const GM_WEB_SUCKET = "wss://ws.gm.bldnodes.org/";
const WS_SECOND_ENDPOINT = "wss://rpc.polkadot.io";
// const WS_SECOND_ENDPOINT = "wss://statemine-rpc-tn.dwellir.com";

function Connect() {
  const [api, setApi] = useState();
  const [accounts, setAccounts] = useState([]);
  const [selectedAccount, setSelectedAccount] = useState();
  const [period, setPeriod] = useState();
  const [showModal, setShowModal] = useState(false);
  const [balance, setBalance] = useState();
  const [address, setAddress] = useRecoilState(addressState);
  const [walletName, setWalletName] = useRecoilState(walletNameState);
  const [chain, setChain] = useRecoilState(chainState);
  const [nodeName, setNodeName] = useRecoilState(nodeNameState);

  const handleModal = () => setShowModal(!showModal);

  const setup = async () => {
    const wsProvider = new WsProvider(GM_WEB_SUCKET);
    const api = await ApiPromise.create({ provider: wsProvider });
    setApi(api);
    // console.log(api);
    const [chain, nodeName] = await Promise.all([
      api.rpc.system.chain(),
      api.rpc.system.name(),
    ]);
    setChain(chain);
    setNodeName(nodeName);
    console.log(`You are connected to chain ${chain} using ${nodeName} `);
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

    setWalletName(allAccounts[0].meta.source);

    setAccounts(allAccounts);

    setShowModal(showModal);
  };

  async function handleShowName() {
    const provider = new WsProvider(GM_WEB_SUCKET);
    const oneApi = await ApiPromise.create({ provider });
    const [chain, nodeName, nodeVersion] = await Promise.all([
      oneApi.rpc.system.chain(),
      oneApi.rpc.system.name(),
      oneApi.rpc.system.version(),
    ]);
    await oneApi.connect();
    console.log(
      `You are connected to chain ${chain} using ${nodeName} v${nodeVersion}`
    );
  }

  const handleTalisman = () => {
    const installedWallets = getWallets().filter((wallet) => wallet.installed);
    const talismanWallet = installedWallets.find(
      (wallet) => wallet.extensionName === "talisman"
    );

    if (talismanWallet) {
      talismanWallet.enable("myCoolDapp").then(() => {
        talismanWallet.subscribeAccounts((accounts) => {
          // do anything you want with the accounts provided by the wallet
          console.log("got accounts", accounts);
        });
      });
    }
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

  const handleDisconnect = async () => {
    const provider = new WsProvider(GM_WEB_SUCKET);
    const api = await ApiPromise.create({ provider });

    const signer = provider.getSigner();
    await signer.disconnect();
  };

 

  useEffect(() => {
    // console.log(AMOUNT.toString());
    setup();
    console.log("address is :", address)
  }, [address]);

  // address is : 5DaEWa1fgLCQtUzNpAKrCxdjwfzuVaXgjbJNpr2CKR4WCnb9

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

    api.query.system.account(selectedAccount.address, ({ data: { free } }) => {
      setBalance(free);
    });

    setAddress(selectedAccount.address);
    // console.log(balance);
  }, [api, selectedAccount, setBalance]);

  async function main() {
    const provider = new WsProvider(GM_WEB_SUCKET);
    const api = await ApiPromise.create({ provider });

    // Set the address to monitor balance changes
    // const address = "5EfCYT187pMFSdQTW3u152iroDXqachf1LtBaeysRH47tPs4";

    // Subscribe to balance changes
    api.query.system.account(address, ({ nonce, data: balance }) => {
      // console.log(`Nonce: ${nonce}`);
      // console.log(`Balance: ${balance}`);
    });
  }

  main().catch((err) => {
    console.error(err);
    process.exit(-1);
  });

  useEffect(() => {
    main();
  }, []);

  return (
    <div>
      <div className="navbar">
        {accounts.length === 0 ? (
          <button
            onClick={() => setShowModal(!showModal)}
            className="connect-btn"
          >
            Connect Wallet
          </button>
        ) : (
          <button
            onClick={handleDisconnect}
            className="disconnect-btn"
          >
            Disconnect Wallet
          </button>
        )}

        {/**
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






      {accounts.length > 0 && !selectedAccount ? (
        <div>
         <TalismanChosen />
        </div>
      ) : null}
     */}

        <WalletsModal
          showModal={showModal}
          closeModal={handleModal}
          title="Select Wallet"
        >
          <img
            src={TalismanLogo}
            className="select-wallet"
            alt="Talisman  Wallet"
            onClick={handleTalisman}
          />
          <img
            src={polkadotJsLogo}
            className="select-wallet"
            alt="polkadot{.js} Wallet"
            onClick={handleConnection}
          />

          <img
            src={NovaWalletLogo}
            className="select-wallet"
            alt="Nova Wallet"
            onClick={handleConnection}
          />
          <img
            src={PolkagateLogo}
            className="select-wallet"
            alt="Polkagate Wallet"
            onClick={handleConnection}
          />
        </WalletsModal>
      </div>

      {accounts.length > 0 && !selectedAccount ? (
        <div className="select-account select-account-card">
          <select className="select-option" onChange={handleAccountSelection}>
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
        <div className="talisman-card">
          <span>
            Chain : <span className="wallet-name">{chain} </span> <br />
            Node : <span className="wallet-name">{nodeName}</span>
            <br />
            Connected Wallet :
            <span className="wallet-name"> {walletName} </span>
          </span>
          <hr />
          <span>
            Your current balance is :{" "}
            <span className="balance">{balance?.toNumber()} Dot </span>
          </span>

          {balance > 0 ? (
            <Link to="/transfer-fund">
              <button className="send-btn">Transfer</button>
            </Link>
          ) : null}

          {balance === 0 || "0" ? (
            <button className="no-money">Transfer</button>
          ) : null}
        </div>
      ) : null}
    </div>
  );
}

export default Connect;
