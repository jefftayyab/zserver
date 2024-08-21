import { model, Schema, ObjectId } from "mongoose";

const userSchema = new Schema({
    username: {
        type: String,
        trim: true,
        required: true,
        unique: true,
    },
    refrelUserName:{
        type: String,
        default: ""
    },
    first_name: {
        type: String,
        trim: true,
        default: "",
    },
    last_name: {
        type: String,
        trim: true,
        default: "",
    },
    email: {
        type: String,
        trim: true,
        required: true,
        unique: true,
        lowercase: true,
    },
    password: {
        type: String,
        required: true,
        maxLength: 80,
        minlength: 4
    },
    phone_number:{
        type: Number,
        default: 0
    },
    team_member:[
        {
            type: ObjectId,
            default: "",
            
                } 
    ],
    YourHeadReferBy:[
        {
            type: ObjectId,
            default: ""
        }
    ],
    YourHead:{
        type: String,
        default:""
    },
    // address: {type: String, default: ""},
    country: {type: String, default: ""},
    city: {type: String, default: ""},

    picture: {},
    role: {
        type: [String],
        default: ["Member"],
        enum: ["Member", "Head", "Admin"],
    },
    enquiredProperties: [
        {
            type: ObjectId,
            ref: "Ads"
        }
    ],
    wishList: [
        {
            type: ObjectId,
            ref: "Ads"
        }
    ],
    balance:{
        type: Number,
        default: 0
    },
    totalAmount:{
        type:Number,
        default:0
    }, 
    userLevel:
               [
                {
                    userId:{
                    type:String,
                    default:""
                } ,
                level:{
                    type:Number,
                    default:""
                }
            }
            ]
    ,
    UserLevel:{
        type:[Number],
        enum:[ObjectId , Number ]
    },
    WithDrawLimit:{
      type:Number,
      default:100  
    },
    // isVerified: {
    //     type: Boolean,
    //     default: false
    // },
    checkCode:{
        type:String,
        default:""
    },
    resetCode: {
        type: String,
        default:""
    },
    
}, {timestamps: true});

const Auth = model("User", userSchema);
export default Auth;
