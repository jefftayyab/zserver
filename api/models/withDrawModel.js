import {model , Schema , ObjectId} from 'mongoose'

const withDrawSchema = new Schema({
    WithDrawRequestedBy: { 
        type :ObjectId,
         ref:'User'
        },  
     
    Amount:{
        type:Number,
        default:""
    }, 
    AccountId:{
        type:String,
        default:""
    },
   
    Description:{
        type:String,
        default:""
    },
    Reason:{
        type:String,
        default:""
    },
    
    Status: {
            type: String,
            default: "pending",
            enum: ["pending", "Approve" , "Reject"],
        },
        checkCode:{
            type:String,
            default:""
        },
    date:{type:Date, default:Date.now}

}, {timestamps:true})

const WithDraw = model( "WithDraw",withDrawSchema)
export default WithDraw;