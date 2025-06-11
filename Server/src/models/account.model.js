import mongoose ,{Schema} from "mongoose";

const accountSchema = new Schema({
    userId:{
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
    isPrimary:{
        type:Boolean,
        default:false
    },

},{timestamps:true});

export const Account = mongoose.model("Account", accountSchema);