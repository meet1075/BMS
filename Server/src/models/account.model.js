import mongoose ,{Schema} from "mongoose";

const accountSchema = new Schema({
    user:{
        type:mongoose.Schema.Types.ObjectId,
        ref:"User",
        required:true
    },
    accountType:{
        type:String,
        required:true,
        enum:["savings","current"],
        default:"savings"
    },
    accountNumber:{
        type:String,
        required:true,
        unique:true,
        trim:true,
        index:true
    },
    balance:{
        type:Number,
        required:true,
        default:0
    },
    status:{
        type:String,
        required:true,
        enum:["active","blocked"],
        default:"active"
    },

},{timestamps:true});

export const Account = mongoose.model("Account", accountSchema);