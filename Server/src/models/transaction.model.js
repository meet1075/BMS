import mongoose,{Schema} from "mongoose";

const transactionSchema = new Schema({
    fromAccountId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Account",
    required: function () {
      return this.type === "transfer" || this.type === "withdraw";
     }
    },
    toAccountId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Account",
    required: function () {
      return this.type === "transfer" || this.type === "deposit";
     }
    },
    type:{
        type: String,
        required: true,
        enum: ["deposit", "withdraw", "transfer"],
    },
    amount: {
        type: Number,
        required: true,
        min: 0
    }, 
    status: {
        type: String,
        enum: [ "successful", "failed"],
    },
    transactionId: {
        type: String,
        required: true,
        unique: true,
        trim: true,
        index: true
    },
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true
    },
},{ timestamps: true });

export const Transaction = mongoose.model("Transaction", transactionSchema);