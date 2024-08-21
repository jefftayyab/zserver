export const authorizeRoles = async(req , res , next ) => {
   
  const user = await Auth.findById(req.user.id)
    if(user.role.includes("Admin")){
      req.user = user;
      next();
    }
    else{
        return res.json({
          error: "You are Not Authorized to Access this Page in role"
        })
            } 
     
    }


import jwt from "jsonwebtoken";
import * as config from "../config/config.js";
import Auth from "../models/authModel.js";

export const requriedLoggedIn = (req, res, next) => {
    if(!req.headers.authorization){
      return res.json({
        error: "You are Not Allow  to Access this Page "
      })
    }
      jwt.verify(req.headers.authorization, config.JWT_SECRET_KEY , (err, decoded) => {
        if (err) {
            return res.json({  error: 'Your authentication time is over please login again' });
        }
        console.log(decoded)
        req.user = decoded; // req.user.id
        console.log(decoded);
        next();
      }
      
      )
    }
    
  
    