import express from "express";
import * as auth from "../controllers/authController.js";
import * as check from "../helper/auth.js";
const authRoute = express.Router();

// test route
authRoute.get("/", (req , res)=>{
  console.log("Working")
  return res.json("Working")
});
authRoute.post("/pre-signup", auth.preSignup);
authRoute.post("/signup", auth.signup);
authRoute.post("/login", auth.login);
authRoute.post("/forget-password", auth.forgetPassword);
authRoute.post("/access-account", auth.accessAccount);
authRoute.get("/homePicture", auth.fetchAllPicture);

authRoute.post("/send-otp", auth.sendOtp);

authRoute.get("/userprofile", check.requriedLoggedIn, auth.fetchUserProfile);
authRoute.post("/chat", check.requriedLoggedIn, auth.supportChat);

authRoute.post("/change-password", check.requriedLoggedIn, auth.changePassword);
authRoute.post("/upload-image", check.requriedLoggedIn, auth.uploadImage);
authRoute.post("/deposit-user", check.requriedLoggedIn, auth.depositUser);
authRoute.get("/loggedIn-user", check.requriedLoggedIn, auth.loggedInUser);
authRoute.get(
  "/fetchSingleUserInvestments",
  check.requriedLoggedIn,
  auth.fetchSingleUserInvestments
);
authRoute.get(
  "/fetchSingleUserWithDraw",
  check.requriedLoggedIn,
  auth.fetchSingleUserWithDraw
);
authRoute.post(
  "/withDraw-Request",
  check.requriedLoggedIn,
  auth.withDrawRequest
);
authRoute.get(
  "/updateinvestment",
  check.requriedLoggedIn,
  auth.updateInvestment
);

authRoute.get(
  "/singleChatHistory",
  check.requriedLoggedIn,
  auth.singleUserChatHistory
);

/// admin
authRoute.get(
  "/admin/users",
  check.requriedLoggedIn,
  check.authorizeRoles,
  auth.fetchAllUser
);
authRoute.get(
  "/allChatHistory",
  check.requriedLoggedIn,
  check.authorizeRoles,
  auth.AllChatHistory
);
authRoute.post(
  "/ChatReply",
  check.requriedLoggedIn,
  check.authorizeRoles,
  auth.chatReply
);

authRoute.get(
  "/singleChatHistory",
  check.requriedLoggedIn,
  check.authorizeRoles,
  auth.singleUserChatHistory
);

authRoute.get(
  "/admin/pendinginvestment",
  check.requriedLoggedIn,
  check.authorizeRoles,
  auth.fetchAllPendingInvestment
);

authRoute.post(
  "/admin/pictures",
  check.requriedLoggedIn,
  check.authorizeRoles,
  auth.uploadHomeImage
);

authRoute.get(
  "/admin/investments",
  check.requriedLoggedIn,
  check.authorizeRoles,
  auth.fetchAllInvestment
);
authRoute.get(
  "/admin/withdraw",
  check.requriedLoggedIn,
  check.authorizeRoles,
  auth.fetchAllWithDrawRequest
);
authRoute.post(
  "/admin/approvewithdraw",
  check.requriedLoggedIn,
  check.authorizeRoles,
  auth.approveWithDraw
);
authRoute.post(
  "/admin/rejectwithdraw",
  check.requriedLoggedIn,
  check.authorizeRoles,
  auth.RejectWithDraw
);
authRoute.post("/admin/change-limit", check.requriedLoggedIn, auth.ChangeLimit);

authRoute.post(
  "/admin/user/:id",
  check.requriedLoggedIn,
  check.authorizeRoles,
  auth.fetchSingleUSer
);
authRoute.post(
  "/admin/user_amount_verification_code",
  check.requriedLoggedIn,
  check.authorizeRoles,
  auth.ApprovedepositUser
);
authRoute.post(
  "/admin/user_amount_rejection_code",
  check.requriedLoggedIn,
  check.authorizeRoles,
  auth.RejectDepositUser
);

export default authRoute;
