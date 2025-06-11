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
    note: {
        type: String,
        trim: true,
        default: ""
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
},{ timestamps: true });

export const Transaction = mongoose.model("Transaction", transactionSchema);