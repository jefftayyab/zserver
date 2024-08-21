import {Schema , model , ObjectId} from "mongoose";

const chatSchema = new Schema({
    
    chatUserId: {
    type: ObjectId,
    ref:"User"
    }, 
    picture:{

    },
    username:{
        type:String,
        default:""
    },
    title:{
        type:String,
        default:""
    },
    issue:{
        type:String,
        default:""
    },
    reply:{
        type:String,
        default:""
    },
    status:{
        type:String,
        default:"UnSeen",
        enum:["Seen" , "UnSeen"]
    }
    
} , {timestamps:true})

const Chats = model("Chat" , chatSchema )

export default Chats;

