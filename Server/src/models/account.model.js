import mongoose ,{Schema} from "mongoose";
import bcrypt from "bcrypt";
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
    pin:{
        type:String,
        required:true
    }

},{timestamps:true});

if (this.isModified("pin") && this.pin) {
    this.pin = await bcrypt.hash(this.pin, 10);
  }

userSchema.methods.isPinCorrect=async function(pin){
    return await bcrypt.compare(pin,this.pin);
}
export const Account = mongoose.model("Account", accountSchema);