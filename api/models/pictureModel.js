import {Schema , model , ObjectId} from "mongoose";


const pictureSchema = new Schema({
    
   UserId:{
    type:ObjectId,
   },
    Picture1:{

    },
    Picture2:{

    },
    Picture3:{
        type:String,
        default:""
    },
    Picture4:{

    },
    
    
} , {timestamps:true})

const Picture = model("picture" , pictureSchema)

export default Picture;