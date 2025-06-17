import React,{ createContext,useContext,useState} from "react";
import Accounts from "../data/accounts.js";
export const AccountContext = createContext();
import Transactions from "../data/transactions.js";
const AccountProvider=({children})=>{
    const [accounts,setAccounts] = useState(Accounts);
    const [transactions,setTransactions] = useState(Transactions||[]);
    const data={
        accounts,
        setAccounts,
         transactions,
         setTransactions
    }
    return(
        <AccountContext.Provider value={data}>
            {children}
        </AccountContext.Provider>
    )
}

export default AccountProvider;