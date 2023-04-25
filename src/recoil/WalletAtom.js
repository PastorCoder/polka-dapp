import { atom } from "recoil";

export const balanceState = atom({
  key: "balanceState",
  default: 0,
});


export const walletNameState = atom({
  key: "walletNameState",
  default: "",
});

export const chainState = atom({
  key: "chainState", 
  default: "",
});

export const nodeNameState = atom({
  key: "nodeNameState",
  default: "",
});


export const selectedAccountState = atom({
  key: "selectedAccountState",
  default: "",
});


export const accountState = atom({
  key: "accountState",
  default: [],
});


export const apiState = atom({
  key: "apiState",
  default: [],
});


export const addressState = atom({
  key: "addressState",
  default: [],
});
