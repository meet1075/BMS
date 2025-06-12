import { Account } from "../models/account.model.js";

export const generate12DigitAccountNumber = () => {
  return Math.floor(100000000000 + Math.random() * 900000000000).toString();
};

const generateUniqueAccountNumber = async () => {
  let isUnique = false;
  let accountNumber;

  while (!isUnique) {
    accountNumber = generate12DigitAccountNumber();
    const existing = await Account.findOne({ accountNumber });
    if (!existing) isUnique = true;
  }

  return accountNumber;
};

export default generateUniqueAccountNumber;
