import { Transaction } from "../models/transaction.model.js";

export const generate10DigitTransactionId=()=>{
    return Math.floor(1000000000 + Math.random() * 9000000000).toString();
}

const generateUniqueTransactionId = async () => {
    let isUnique=false;
    let transactionId;
    while(!isUnique){
        transactionId=generate10DigitTransactionId();
        const existing=await Transaction.findOne({transactionId});
        if(!existing) isUnique=true;
    }
    return transactionId;
}
export default generateUniqueTransactionId;