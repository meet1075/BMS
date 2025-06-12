import { Account } from "../models/account.model.js";

export const generate4DigitPinForAccountNumber = () => {
  return Math.floor(1000 + Math.random() * 9000).toString();
}

const generatePin = async () => {
  let pin = generate4DigitPinForAccountNumber();

  return pin;
};

export default generatePin;