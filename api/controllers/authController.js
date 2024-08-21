import * as config from "../config/config.js";
import validator from "email-validator";
import emailTemplate from "../helper/email.js";
import Auth from "../models/authModel.js";
import { nanoid } from "nanoid";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { userAndTokenResponse } from "../helper/token.js";
// import
const code = nanoid(5);
const username = nanoid(6);
// const refrelUserNameOriginal = nanoid(9);

const style = `
font-weight:bold;
font-size:14px;
padding-left:35px;
color:#64ffda;
background-color:#374151;
text-decoration: underline;
`;

import fx from "money";
export const test = (req, res) => {
  const { usdAmount } = req.body;
  fx.base = "USD";
  fx.rates = {
    PKR: 278, // Replace 160 with the actual exchange rate
    // Add more currencies if needed
  };
  const convertedAmount = fx(usdAmount).from("USD").to("PKR");

  console.log(
    "Current value of " + usdAmount + " USD in PKR is:",
    convertedAmount
  );
  res.status(200).json({
    message: "This is our test route coming from controller",
    data: convertedAmount,
  });
};

// export const enterenceForSignup = async (req, res) => {
//   try {
//     const { refrelUserName } = req.body;
//     if (refrelUserName.length >= 25 || refrelUserName.length <= 23) {
//       return res.json({
//         error: "Please enter a Valid refrelUserName in length",
//       });
//     }
//     const userName = await Auth.findById({ _id: refrelUserName });
//     if (!userName) {
//       return res.json({
//         error: "Please enter a Valid refrelUserName",
//       });
//     }
//     res.json({
//       message: "refrelUserName is available",
//       user: userName,
//     });
//   } catch (err) {
//     console.log(err);
//     res.json({
//       error: "Something went wrong... Try again",
//     });
//   }
// };
export const preSignup = async (req, res) => {
  try {
    const {
      refrelUserName,
      first_name,
      last_name,
      email,
      country,
      city,
      address,
      phone_number,
      password,
      confirm_password,
    } = req.body;
    if (!refrelUserName) {
      return res.json({
        error: "Please Enter Valid RefrelUserName ",
      });
    }
    // if (refrelUserName.length >= 25 || refrelUserName.length <= 23) {
    //   return res.json({
    //     error: "Please enter a Valid refrelUserName in length",
    //   });
    // }
    const userName = await Auth.findOne({ refrelUserName });
    if (!userName) {
      return res.json({
        error:
          "Please Enter Valid refrelUserName No User Find with this refrelUserName",
      });
    }
    if (!first_name) {
      return res.json({
        error: "Please Enter First Name",
      });
    }
    if (!last_name) {
      return res.json({
        error: "Please Enter Last Name",
      });
    }
    if (!email) {
      return res.json({
        error: "Please Enter Valid Email",
      });
    }
    if (!validator.validate(email)) {
      return res.json({
        error: "Please Enter Correct Email  Spelling",
      });
    }
    if (!country) {
      return res.json({
        error: "Please Enter Valid Country",
      });
    }
    if (!city) {
      return res.json({
        error: "Please Enter Valid City",
      });
    }

    
    if (!phone_number) {
      return res.json({
        error: "Please Enter Valid Phone Number",
      });
    }
    if (!password ) {
      return res.json({
        error:
          "Please Enter Valid Password",
      });
    }
    if (password !== confirm_password) {
      return res.json({
        error:
          "Please Enter Same Password in the Password & Confirm Password Field",
      });
    }
    

    console.log("object");
    const checkUser = await Auth.findOne({ email });
    if (checkUser) {
      return res.json({
        error: "Email Already in use Choose Another Email",
      });
    }
    const checkPhoneNumber = await Auth.findOne({ phone_number });
    if (checkPhoneNumber) {
      return res.json({
        error: "Phone Number  Already in use Choose Another Phone Number",
      });
    }
    console.log("object");
    const salt = await bcrypt.genSalt(12);
    const hashedPassword = await bcrypt.hash(password, salt);

    const username = nanoid(6);
    const code = nanoid(5);
    const refrelUserNameOriginal = nanoid(9);

    const user = await Auth.create({
      username: username,
      refrelUserName: refrelUserNameOriginal,
      first_name,
      last_name,
      email,
      password: hashedPassword,
      phone_number,
      // YourHeadReferBy:userName._id,
      YourHead: userName._id,
      country,
      city,
      // address,
      checkCode: code,
    });

    console.log("object");
    // config.AWSSES.sendEmail(
    //   emailTemplate(
    //     config.EMAIL_FROM,
    //     email,
    //     "Account Activate OTP",
    //     // `Hi ${first_ame} ${last_name}, Please read your opt to activate your account. <a href="http://localhost:3000/auth/activate/${email}/${password}">Activate Account</a>`
    //     `        <h2 style='text-align:Center ; text-decoration: underline;'> Hello ${first_name} ${last_name} 👷‍♂️</h2>
    //     <p style='padding-left:22px ; font-weight:bold ; text-decoration: underline ; font-size:16px'>Pre Sign Up Verification Code </p>
    //        <p style=' ${style}'>Your Otp :- <span> ${code}🚨</span></p>
    //     <b style='padding-left:22px ; color:white ; text-decoration: underline;'>Please read your otp and put on form for activate your account.</b>
    //     `
    //   ),
   
    sendHTML(
      config.EMAIL_FROM,
      email,
      
      "Account Activate OTP",
      `        <h2 style='text-align:Center ; text-decoration: underline; color:#64ffda ; background-color:#374151; '> Hi [ ${first_name} ${last_name} ] </h2>
          <p style='padding-left:22px ; font-weight:bold ; text-decoration: underline ; font-size:16px ; color:#64ffda ; background-color:#374151; '>Pre Sign Up Verification Code </p>
          <p style='padding-left:22px ; font-size:16px ; color:#64ffda; background-color:#374151; '>To ensure the security of your account, please use the One-Time Password ${code} provided below. This OTP is required to complete your login or transaction on No-Reply. </p>

            <p style=' ${style}'>Your OTP :- <span> ${code}🚨</span></p>
          <p style='padding-left:22px ; font-size:16px ; color:#64ffda; background-color:#374151;'>For your safety, this OTP is valid only for a limited time and should not be shared with anyone. If you did not request this OTP or have any concerns, please contact our support team immediately. </p>
<p style='padding-left:22px ; font-size:16px ; color:#64ffda; background-color:#374151; '>At No-Reply, your financial growth is our priority. By continuing to invest with us diverse portfolio of investment opportunities, and personalized investment strategies tailored to your goals. Our secure platform ensures your investments are protected while you benefit from competitive returns and innovative investment solutions </p>
          <p style='padding-left:22px ; font-size:16px ; color:#64ffda; background-color:#374151; '>Thank you for trusting No-Reply with your financial future. </p>          <p style='padding-left:22px ; font-size:16px ; color:#64ffda ; background-color:#374151; '>Best regards </p>
          <p style='padding-left:22px ; font-size:16px ; color:#64ffda; background-color:#374151;  '>The No-Reply Team</p>
         
          `
    ),
           res.json({ ok: true, message: "Email Sent Successfully" });
        
//       "Dear [Recipient's Name],

// To ensure the security of your account, please use the One-Time Password (OTP) provided below. This OTP is required to complete your login or transaction on No-Reply.

// Your OTP: [OTP Code ]

// For your safety, this OTP is valid only for a limited time and should not be shared with anyone. If you did not request this OTP or have any concerns, please contact our support team immediately.

// Thank you for using No-Reply.

// Best regards,
// The No-Reply Team"
    
  } catch (err) {
    console.log(err);
    res.json({
      error: "Something Went Wrong... Try Again",
    });
  }
};

export const signup = async (req, res) => {
  const { code } = req.body;

  if (!code || code.length <= 4 || code.length >= 6) {
    return res.json({
      error: "Please Enter OTP ",
    });
  }

  const findUser = await Auth.findOne({ checkCode: code });
  if (!findUser) {
    return res.json({
      error: "Please Enter Valid OTP to Activate Your Account",
    });
  }
  console.log(findUser);
  const user1 = await Auth.findByIdAndUpdate(findUser._id, { checkCode: "" });
  const user = await Auth.findByIdAndUpdate(
    user1._id,
    { YourHeadReferBy: user1._id },
    { new: true }
  );
  // jo user login huva hn uss k head  hn yn es may es ka level hoga 1

  var Levels = [];
  Levels.push({
    userId: user1._id,
    level: 1,
  });

  const YourHead = await Auth.findByIdAndUpdate(
    { _id: user.YourHead },
    { $addToSet: { role: "Head" } }
  );

  YourHead.userLevel = YourHead?.userLevel
    ? [...YourHead?.userLevel, ...Levels]
    : [...Levels];
  YourHead.save();

  // const level = await Auth.findOne({_id:YourHead._id}).updateOne( {userLevel:Levels})
  const AllUser = await Auth.find({ _id: YourHead.YourHeadReferBy }).updateMany(
    { $addToSet: { team_member: user._id } }
  );

  // jo user login huva hn uss k head ka head hn yn es may es ka level hoga 2
  const YourHeadReferBy1 = await Auth.findOne({
    _id: YourHead?.YourHeadReferBy[1],
  });

  console.log(YourHeadReferBy1, YourHeadReferBy1?.length, "yes i am subhan ");

  if (YourHeadReferBy1) {
    var Levels = [];
    Levels.push({
      userId: user1._id,
      level: 2,
    });
    YourHeadReferBy1.userLevel = YourHeadReferBy1?.userLevel
      ? [...YourHeadReferBy1?.userLevel, ...Levels]
      : [...Levels];
    console.log(YourHeadReferBy1);
    YourHeadReferBy1?.userLevel && YourHeadReferBy1?.save();
  } else {
    console.log("YourHeadReferBy1 not found");
  }

  // jo user login huva hn uss k head ka head ka head hn yn es may login user ka level hoga 3
  const YourHeadReferBy2 = await Auth.findOne({
    _id: YourHeadReferBy1?.YourHeadReferBy[1],
  });

  console.log(YourHeadReferBy2, YourHeadReferBy2?.length, "yes i am subhan ");

  if (YourHeadReferBy2) {
    var Levels = [];
    Levels.push({
      userId: user1._id,
      level: 3,
    });

    YourHeadReferBy2.userLevel = YourHeadReferBy2?.userLevel
      ? [...YourHeadReferBy2?.userLevel, ...Levels]
      : [...Levels];
    console.log(YourHeadReferBy2);
    YourHeadReferBy2?.userLevel && YourHeadReferBy2?.save();
  } else {
    console.log("YourHeadReferBy2 not found");
  }

  // jo user login huva hn uss k head ka head ka head ka head hn yn es may login user ka level hoga 4
  const YourHeadReferBy3 = await Auth.findOne({
    _id: YourHeadReferBy2?.YourHeadReferBy[1],
  });

  console.log(YourHeadReferBy3, YourHeadReferBy3?.length, "yes i am subhan ");

  if (YourHeadReferBy3) {
    var Levels = [];
    Levels.push({
      userId: user1._id,
      level: 4,
    });
    YourHeadReferBy3.userLevel = YourHeadReferBy3?.userLevel
      ? [...YourHeadReferBy3?.userLevel, ...Levels]
      : [...Levels];
    console.log(YourHeadReferBy3);
    YourHeadReferBy3?.userLevel && YourHeadReferBy3?.save();
  } else {
    console.log("YourHeadReferBy3 not found");
  }

  //jo user login huva hn uss k head ka head ka head ka head ka head hn yn es may login user ka level hoga 5
  const YourHeadReferBy4 = await Auth.findOne({
    _id: YourHeadReferBy3?.YourHeadReferBy[1],
  });

  console.log(YourHeadReferBy4, YourHeadReferBy4?.length, "yes i am subhan ");

  if (YourHeadReferBy4) {
    var Levels = [];
    Levels.push({
      userId: user1._id,
      level: 5,
    });
    YourHeadReferBy4.userLevel = YourHeadReferBy4?.userLevel
      ? [...YourHeadReferBy4?.userLevel, ...Levels]
      : [...Levels];
    console.log(YourHeadReferBy4);
    YourHeadReferBy4?.userLevel && YourHeadReferBy4?.save();
  } else {
    console.log("YourHeadReferBy4 not found");
  }

  //jo user login huva hn uss k head ka head ka head ka head ka head ka head hn yn es may login user ka level hoga 6
  const YourHeadReferBy5 = await Auth.findOne({
    _id: YourHeadReferBy4?.YourHeadReferBy[1],
  });

  console.log(YourHeadReferBy5, YourHeadReferBy5?.length, "yes i am subhan ");

  if (YourHeadReferBy5) {
    var Levels = [];
    Levels.push({
      userId: user1._id,
      level: 6,
    });
    YourHeadReferBy5.userLevel = YourHeadReferBy5?.userLevel
      ? [...YourHeadReferBy5?.userLevel, ...Levels]
      : [...Levels];
    console.log(YourHeadReferBy5);
    YourHeadReferBy5?.userLevel && YourHeadReferBy5?.save();
  } else {
    console.log("YourHeadReferBy5 not found");
  }

  //jo user login huva hn uss k head ka head ka head ka head ka head ka head ka head hn yn es may login user ka level hoga 7
  const YourHeadReferBy6 = await Auth.findOne({
    _id: YourHeadReferBy5?.YourHeadReferBy[1],
  });

  console.log(YourHeadReferBy6, YourHeadReferBy6?.length, "yes i am subhan ");

  if (YourHeadReferBy6) {
    var Levels = [];
    Levels.push({
      userId: user1._id,
      level: 7,
    });
    YourHeadReferBy6.userLevel = YourHeadReferBy6?.userLevel
      ? [...YourHeadReferBy6?.userLevel, ...Levels]
      : [...Levels];
    console.log(YourHeadReferBy6);
    YourHeadReferBy6?.userLevel && YourHeadReferBy6?.save();
  } else {
    console.log("YourHeadReferBy6 not found");
  }

  //jo user login huva hn uss k head ka head ka head ka head ka head ka head ka head ka head hn yn es may login user ka level hoga 8
  const YourHeadReferBy7 = await Auth.findOne({
    _id: YourHeadReferBy6?.YourHeadReferBy[1],
  });

  console.log(YourHeadReferBy7, YourHeadReferBy7?.length, "yes i am subhan ");

  if (YourHeadReferBy7) {
    var Levels = [];
    Levels.push({
      userId: user1._id,
      level: 8,
    });
    YourHeadReferBy7.userLevel = YourHeadReferBy7?.userLevel
      ? [...YourHeadReferBy7?.userLevel, ...Levels]
      : [...Levels];
    console.log(YourHeadReferBy7);
    YourHeadReferBy7?.userLevel && YourHeadReferBy7?.save();
  } else {
    console.log("YourHeadReferBy7 not found");
  }

  //jo user login huva hn uss k head ka head ka head ka head head ka ka head ka head ka head ka head hn yn es may login user ka level hoga 9
  const YourHeadReferBy8 = await Auth.findOne({
    _id: YourHeadReferBy7?.YourHeadReferBy[1],
  });

  console.log(YourHeadReferBy8, YourHeadReferBy8?.length, "yes i am subhan ");

  if (YourHeadReferBy8) {
    var Levels = [];
    Levels.push({
      userId: user1._id,
      level: 9,
    });
    YourHeadReferBy8.userLevel = YourHeadReferBy8?.userLevel
      ? [...YourHeadReferBy8?.userLevel, ...Levels]
      : [...Levels];
    console.log(YourHeadReferBy8);
    YourHeadReferBy8?.userLevel && YourHeadReferBy8?.save();
  } else {
    console.log("YourHeadReferBy8 not found");
  }

  //jo user login huva hn uss k head ka head ka head ka  head ka head head ka ka head ka head ka head ka head hn yn es may login user ka level hoga 10
  const YourHeadReferBy9 = await Auth.findOne({
    _id: YourHeadReferBy8?.YourHeadReferBy[1],
  });

  console.log(YourHeadReferBy9, YourHeadReferBy9?.length, "yes i am subhan ");

  if (YourHeadReferBy9) {
    var Levels = [];
    Levels.push({
      userId: user1._id,
      level: 10,
    });
    YourHeadReferBy9.userLevel = YourHeadReferBy9?.userLevel
      ? [...YourHeadReferBy9?.userLevel, ...Levels]
      : [...Levels];
    console.log(YourHeadReferBy9);
    YourHeadReferBy9?.userLevel && YourHeadReferBy9?.save();
  } else {
    console.log("YourHeadReferBy9 not found");
  }
 ///////

  const YourHeadReferBy10 = await Auth.findOne({
    _id: YourHeadReferBy9?.YourHeadReferBy[1],
  });

  console.log(YourHeadReferBy10, YourHeadReferBy10?.length, "yes i am subhan ");

  if (YourHeadReferBy10) {
    var Levels = [];
    Levels.push({
      userId: user1._id,
      level: 11,
    });
    YourHeadReferBy10.userLevel = YourHeadReferBy10?.userLevel
      ? [...YourHeadReferBy10?.userLevel, ...Levels]
      : [...Levels];
    console.log(YourHeadReferBy10);
    YourHeadReferBy10?.userLevel && YourHeadReferBy10?.save();
  } else {
    console.log("YourHeadReferBy10 not found");
  }

/////////

const YourHeadReferBy11 = await Auth.findOne({
  _id: YourHeadReferBy10?.YourHeadReferBy[1],
});

console.log(YourHeadReferBy11, YourHeadReferBy11?.length, "yes i am subhan ");

if (YourHeadReferBy11) {
  var Levels = [];
  Levels.push({
    userId: user1._id,
    level: 12,
  });
  YourHeadReferBy11.userLevel = YourHeadReferBy11?.userLevel
    ? [...YourHeadReferBy11?.userLevel, ...Levels]
    : [...Levels];
  console.log(YourHeadReferBy11);
  YourHeadReferBy11?.userLevel && YourHeadReferBy11?.save();
} else {
  console.log("YourHeadReferBy11 not found");
} 

////

const YourHeadReferBy12= await Auth.findOne({
  _id: YourHeadReferBy11?.YourHeadReferBy[1],
});

console.log(YourHeadReferBy12, YourHeadReferBy12?.length, "yes i am subhan ");

if (YourHeadReferBy12) {
  var Levels = [];
  Levels.push({
    userId: user1._id,
    level: 13,
  });
  YourHeadReferBy12.userLevel = YourHeadReferBy12?.userLevel
    ? [...YourHeadReferBy12?.userLevel, ...Levels]
    : [...Levels];
  console.log(YourHeadReferBy12);
  YourHeadReferBy12?.userLevel && YourHeadReferBy12?.save();
} else {
  console.log("YourHeadReferBy12 not found");
} 

//////


const YourHeadReferBy13= await Auth.findOne({
  _id: YourHeadReferBy12?.YourHeadReferBy[1],
});

console.log(YourHeadReferBy13, YourHeadReferBy13?.length, "yes i am subhan ");

if (YourHeadReferBy13) {
  var Levels = [];
  Levels.push({
    userId: user1._id,
    level: 14,
  });
  YourHeadReferBy13.userLevel = YourHeadReferBy13?.userLevel
    ? [...YourHeadReferBy13?.userLevel, ...Levels]
    : [...Levels];
  console.log(YourHeadReferBy13);
  YourHeadReferBy13?.userLevel && YourHeadReferBy13?.save();
} else {
  console.log("YourHeadReferBy13not found");
} 

//////


const YourHeadReferBy14= await Auth.findOne({
  _id: YourHeadReferBy13?.YourHeadReferBy[1],
});

console.log(YourHeadReferBy14, YourHeadReferBy14?.length, "yes i am subhan ");

if (YourHeadReferBy14) {
  var Levels = [];
  Levels.push({
    userId: user1._id,
    level: 15,
  });
  YourHeadReferBy14.userLevel = YourHeadReferBy14?.userLevel
    ? [...YourHeadReferBy14?.userLevel, ...Levels]
    : [...Levels];
  console.log(YourHeadReferBy14);
  YourHeadReferBy14?.userLevel && YourHeadReferBy14?.save();
} else {
  console.log("YourHeadReferBy14 not found");
} 

//////////
  const YourHeadReferBy = await Auth.findByIdAndUpdate(
    user._id,
    {
      $addToSet: { YourHeadReferBy: YourHead.YourHeadReferBy },
    },
    { new: true }
  );
  console.log(YourHead);
  userAndTokenResponse(req, res, YourHeadReferBy, YourHead);
};

export const login = async (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return res.json({
      error: "All Feilds Are Required",
    });
  }

  console.log("object");
  const user = await Auth.findOne({ email });

  if (!user) {
    return res.json({ error: `Please Enter a Valid Email or Password` });
  }
  const YourHead = await Auth.findById({ _id: user.YourHead });
  console.log(user);
  const checkPassword = await bcrypt.compare(password, user.password);

  if (!checkPassword) {
    return res.json({
      error: "Please Enter a Valid Email or Password 9 ",
    });
  }

  userAndTokenResponse(req, res, user, YourHead);
};

export const RefrelLink = async (req, res) => {
  const { id } = req.body;
  try {
    const user = await Auth.findById({ _id: id });
  } catch (error) {
    return res.status(400).json({
      error: "Something went wrong... Try again",
    });
  }
};

// export const uploadImage = (req, res, next) => {
//   try {
//     const { image } = req.body;
//     if (!image) {
//       return res.status(400).json({
//         error: "Please Upload Image",
//       });
//     }
//     const base64Image = new Buffer.from(
//       image.replace(/^data:image\/\w+;base64,/, ""),
//       "base64"
//     );
//     const type = image.split(";")[0].split("/")[1];

//     const params = {
//       Bucket: "myghar", // The bucket to use when storing the file
//       Key: `${nanoid}.${type}`,
//       Body: base64Image,
//       ACL: "public-read",
//       ContentType: image.split(";")[0].split("/")[1],
//       ContentEncoding: "base64",
//     };

//     config.AWSS3.upload(params, (err, data) => {
//       if (err) {
//         console.log(err);
//         res.sendStatus(400);
//       } else {
//         //console.log(data);
//         res.send(data);
//       }
//     });
//   } catch (error) {
//     res.status(400).json({
//       error: "Something went wrong... Try again",
//     });
//   }
// };
// export const forgetPassword = async (req, res) => {
//   try {
//     const { email } = req.body;

//     if (!email) {
//       return res.json({
//         error: "Please Enter a Valid Email",
//       });
//     }

//     const user = await Auth.findOne({ email });

//     if (!user) {
//       return res.json({
//         success: false,
//         error: `User Not found. this ${email}`,
//       });
//     }
//     const token = jwt.sign({ id: user._id }, config.JWT_SECRET_KEY, {
//       expiresIn: "1h",
//     }); //1 hour
//     const resetCode = nanoid(5);
//     user.resetCode = resetCode;
//     user.save();
//     config.AWSSES.sendEmail(
//       emailTemplate(
//         config.EMAIL_FROM,
//         email,
//         "Access Account OTP",
//         `        <h2 style='text-align:Center ; text-decoration: underline; color:white;'> Hello ${user.first_name} ${user.last_name} </h2>
//           <p style='padding-left:22px ; font-weight:bold ; font-size:16px ; text-decoration: underline; color:white;'>Forget Password Verification Code </p>     
//           <b style='padding-left:22px ;text-decoration: underline; color:white; '>Please click the link below to Access your account</b> <br/>

//                     <a style='padding-left:22px ;text-decoration: underline; color:white;' href='${config.CLIENT_URL}/auth/access-account/${token}'> Access my account </a>
          

//              <p style=' ${style}'>Your Otp :- <span style=''> ${resetCode}</span></p>
//           <b style='padding-left:22px ; text-decoration: underline; color:white;'>Please read your otp and put on form for access your account.</b>
//           `
//       ),
//       (err, data) => {
//         if (err) {
//           return console.log(err);
//           res.json({ ok: false });
//         } else {
//           console.log(data);
//           return res.json({
//             ok: true,
//             message: "Please check your email to access your account",
//           });
//         }
//       }
//     );
//   } catch {
//     return res.status(400).json({
//       error: "Something went wrong... Try again",
//     });
//   }
// };

export const forgetPassword = async (req, res) => {
  try {
    const { email } = req.body;

    if (!email) {
      return res.json({
        error: "Please Enter a Valid Email",
      });
    }

    const user = await Auth.findOne({ email });

    if (!user) {
      return res.json({
        success: false,
        error: `User Not found. this ${email}`,
      });
    }
    const token = jwt.sign({ id: user._id }, config.JWT_SECRET_KEY, {
      expiresIn: "1h",
    }); //1 hour
    const resetCode = nanoid(5);
    user.resetCode = resetCode;
    user.save();
   
      sendHTML(
        config.EMAIL_FROM,
        email,
        



        "Access Account OTP",
        `        <h2 style='text-align:Center ; text-decoration: underline; color:#64ffda ; background-color:#374151; '> Dear [ ${user.first_name} ${user.last_name}] 👷‍♂️</h2>
          <p style='padding-left:22px ; font-weight:bold ; text-decoration: underline ; font-size:16px ; color:#64ffda ; background-color:#374151; '>Forget Password Verification Code </p>
          <p style='padding-left:22px ; font-size:16px ; color:#64ffda; background-color:#374151; '>To ensure the security of your account, please use the One-Time Password ${resetCode} provided below. This OTP is required to complete your login or transaction on No-Reply. </p>

            <p style=' ${style}'>Your OTP :- <span> ${resetCode}🚨</span></p>
          <p style='padding-left:22px ; font-size:16px ; color:#64ffda; background-color:#374151; '>For your safety, this OTP is valid only for a limited time and should not be shared with anyone. If you did not request this OTP or have any concerns, please contact our support team immediately. </p>
          <p style='padding-left:22px ; font-size:16px ; color:#64ffda; background-color:#374151; '>At No-Reply, your financial growth is our priority. By continuing to invest with us diverse portfolio of investment opportunities, and personalized investment strategies tailored to your goals. Our secure platform ensures your investments are protected while you benefit from competitive returns and innovative investment solutions </p>
          <p style='padding-left:22px ; font-size:16px ; color:#64ffda; background-color:#374151; '>Thank you for trusting No-Reply with your financial future. </p>
          <p style='padding-left:22px ; font-size:16px ; color:#64ffda; background-color:#374151; '>Best regards </p>
          <p style='padding-left:22px ; font-size:16px ; color:#64ffda; background-color:#374151; '>The No-Reply Team</p>
         
          `
      ),
    
      
           res.json({
            ok: true,
            message: "Please Check Your Email to Access Your Account in 5 Minutes",
          });
        
      
   
  } catch {
    return res.status(400).json({
      error: "Something went wrong... Try again",
    });
  }
};

export const supportChat = async (req , res) => {
 try {const { picture , username , title , issue } = req.body
// if(!picture){
//   return res.json({
//     error:"Please provide a issue picture "
//   })
// }
if(!username){
  return res.json({
    error:"Please Enter Your UserName "
  })
}
const check = await Auth.findOne({username:username})
if(!check){
  return res.json({
    error:"Please Enter Valid UserName"
  })
}
if(!title){
  return res.json({
    error:"Please Enter Your Issue Title "
  })
}

if(!issue){
  return res.json({
    error:"Please Enter Your Issue in Detail "
  })
}

  const userChat = await Chats.create({
    chatUserId:req.user.id,
    picture,
    username,
    title ,
    issue

  })
res.json({
  message:"Your Issue Has Been Sent To Our Support Team"
})}catch (error) {
  res.json({
    error: "Something went wrong... Try again",
  });
}

}

export const AllChatHistory = async (req , res) => {

  const Allchats = await Chats.find().populate("chatUserId" , "first_name , last_name ")
  console.log(Allchats)
  res.json(
    {
      chats:Allchats
    }
  )
}

export const singleUserChatHistory = async(req , res) => {
 try{ const userChats =  await Chats.find({
    chatUserId: req.user.id,
  }).populate("chatUserId", "first_name last_name ");
  res.json(
    {
      singleChats:userChats
    }
  )
}catch (error) {
  res.json({
    error: "Something went wrong... Try again",
  });
}
}


export const chatReply = async (req , res) => {
  try{
    const {  userName , Reply} = req.body
    if(!userName){
      return res.json({
        error:"Please Enter User Username"
      }) }
      if(!Reply){
        return res.json({
          error:"Please Enter Your Reply For User"
        })
      }
      const findUser = await Chats.findOne({username:userName , status:"UnSeen"})

      if(!findUser){
        return res.json({
          error:"Please Enter Valid UserName"
        })
      }
    const replyingUser = await findUser.updateOne({status:"Seen" , reply:Reply })
     console.log(replyingUser)
     res.json({
      message:"Your Reply Has Been Sent To User"
     })
  }catch (error) {
    res.json({
      error: "Something went wrong... Try again",
    });
  }
}

export const accessAccount = async (req, res) => {
  try {
    const { resetCode, newPassword } = req.body;
    if (!resetCode) {
      return res.json({
        error: "Please Enter a Valid Reset Code",
      });
    }
    if (!newPassword) {
      return res.json({
        error: "Please Enter Your New Password",
      });
    }
    const user = await Auth.findOne({ resetCode });
    if (!user) {
      return res.json({
        error: "Please Enter a Valid Reset Code",
      });
    }
    //update the reset code to null after use it once

    const salt = await bcrypt.genSalt(12);
    const hashedPassword = await bcrypt.hash(newPassword, salt);
    const updateduser = await Auth.findByIdAndUpdate(
      user._id,
      { resetCode: "", password: hashedPassword },
      { new: true }
    );

    const YourHead = await Auth.findById({ _id: updateduser.YourHead });
    userAndTokenResponse(req, res, updateduser, YourHead);
  } catch (error) {
    res.json({
      error: "Something went wrong... Try again",
    });
  }
};

export const fetchUserProfile = async (req, res) => {
  const user = await Auth.findById(req.user.id);

  /// userHead
  const YourHead = await Auth.findById(
    user?.YourHead,
    "first_name last_name email phone_number balance YourHeadReferBy"
  );
  console.log("YourHead is " + YourHead);

  /// userHead1
  const YourHead1 = await Auth.findById(
    YourHead?.YourHeadReferBy?.[1],
    "first_name last_name email phone_number balance YourHeadReferBy"
  );
  console.log("YourHead1 is " + YourHead1);

  /// userHead2
  const YourHead2 = await Auth.findById(
    YourHead1?.YourHeadReferBy?.[1],
    "first_name last_name email phone_number balance YourHeadReferBy"
  );
  console.log("YourHead2 is " + YourHead2);

  /// userHead3
  const YourHead3 = await Auth.findById(
    YourHead2?.YourHeadReferBy?.[1],
    "first_name last_name email phone_number balance YourHeadReferBy"
  );
  console.log("YourHead3 is " + YourHead3);

   /// userHead4
   const YourHead4 = await Auth.findById(
    YourHead3?.YourHeadReferBy?.[1],
    "first_name last_name email phone_number balance YourHeadReferBy"
  );
  console.log("YourHead4 is " + YourHead4);

  /// userHead5
  const YourHead5 = await Auth.findById(
    YourHead4?.YourHeadReferBy?.[1],
    "first_name last_name email phone_number balance YourHeadReferBy"
  );
  console.log("YourHead5 is " + YourHead5);

  /// userHead6
  const YourHead6 = await Auth.findById(
    YourHead5?.YourHeadReferBy?.[1],
    "first_name last_name email phone_number balance YourHeadReferBy"
  );
  console.log("YourHead6 is " + YourHead6);

  /// userHead7
  const YourHead7 = await Auth.findById(
    YourHead6?.YourHeadReferBy?.[1],
    "first_name last_name email phone_number balance YourHeadReferBy"
  );
  console.log("YourHead7 is " + YourHead7);

  /// userHead8
  const YourHead8 = await Auth.findById(
    YourHead7?.YourHeadReferBy?.[1],
    "first_name last_name email phone_number balance YourHeadReferBy"
  );
  console.log("YourHead8 is " + YourHead8);

  /// userHead9
  const YourHead9 = await Auth.findById(
    YourHead8?.YourHeadReferBy?.[1],
    "first_name last_name email phone_number balance YourHeadReferBy"
  );
  console.log("YourHead9 is " + YourHead9);

  /// userHead10
  const YourHead10 = await Auth.findById(
    YourHead9?.YourHeadReferBy?.[1],
    "first_name last_name email phone_number balance YourHeadReferBy"
  );
  console.log("YourHead10 is " + YourHead10);

  /// userHead11
  const YourHead11 = await Auth.findById(
    YourHead10?.YourHeadReferBy?.[1],
    "first_name last_name email phone_number balance YourHeadReferBy"
  );
  console.log("YourHead11 is " + YourHead11);

  /// userHead12
  const YourHead12 = await Auth.findById(
    YourHead11?.YourHeadReferBy?.[1],
    "first_name last_name email phone_number balance YourHeadReferBy"
  );
  console.log("YourHead12 is " + YourHead12);

  /// userHead13
  const YourHead13 = await Auth.findById(
    YourHead12?.YourHeadReferBy?.[1],
    "first_name last_name email phone_number balance YourHeadReferBy"
  );
  console.log("YourHead13 is " + YourHead13);

  /// userHead13
  const YourHead14 = await Auth.findById(
    YourHead13?.YourHeadReferBy?.[1],
    "first_name last_name email phone_number balance YourHeadReferBy"
  );
  console.log("YourHead14 is " + YourHead14);

  // userHead?.YourHeadReferBy?.[1]
  var d = new Date();
  // d.getDate();  (8)
  // d.getTime;  (1715185184100)
  // d.toDateString; (Wed May 08 2024)
  // d.toTimeString; (09:24:49 GMT-0700 (Pacific Daylight Time))
  // d.getMonth + 1 ; (5)
  // d.getFullYear;
  //  d.toLocaleString: (08/05/2024, 9:47:54 am)
  console.log(d.toLocaleDateString());
  console.log(d.toLocaleTimeString());

  const userTeam = await Auth.find(
    { _id: user?.team_member },
    "first_name last_name email phone_number YourHead refrelUserName balance totalAmount"
  );

  // const userInvestment = await Investment.find({
  //   investedBy: req.user.id,
  //   Status: "Approve",
  //   checkCode: "",
  //   // RequestedTime: { $lt: new Date(Date.now() - 24 * 60 * 60 * 1000) },
  // });
  const userInvestment = await Investment.find({
    investedBy: req?.user?.id,
    Status: "Approve",
    checkCode: "",
    // RequestedTime: { $lt: new Date(Date.now() - 24 * 60 * 60 * 1000) },
  });

  const currentTime = Date.now();
  console.log(currentTime);

  console.log(userInvestment?.map((check) => check?.ApproveTime));
  // const checking = userInvestment?.map(
  //   (check) => (currentTime - check?.ApproveTime) / (1000 * 60 * 60)
  // );
  console.log(userInvestment[0]?.ApproveTime);
  const checking =
    (currentTime - userInvestment[0]?.ApproveTime) / (1000 * 60 * 60);
  console.log(userInvestment);
  console.log("checking time is " +checking);

  const addamount1 = user?.totalAmount * 0.00525;
  const AddAmountUserHead =   addamount1 * 0.12;
  const AddAmountUserHead1 =  addamount1 * 0.1;
  const AddAmountUserHead2 =  addamount1 * 0.07;
  const AddAmountUserHead3 =  addamount1 * 0.05;
  const AddAmountUserHead4 =  addamount1 * 0.03;
  const AddAmountUserHead5 =  addamount1 * 0.02;
  const AddAmountUserHead6 =  addamount1 * 0.02;
  const AddAmountUserHead7 =  addamount1 * 0.01;
  const AddAmountUserHead8 =  addamount1 * 0.01;
  const AddAmountUserHead9 =  addamount1 * 0.01;
  const AddAmountUserHead10 = addamount1 * 0.01;
  const AddAmountUserHead11 = addamount1 * 0.01;
  const AddAmountUserHead12 = addamount1 * 0.01;
  const AddAmountUserHead13 = addamount1 * 0.01;
  const AddAmountUserHead14 = addamount1 * 0.02;


  const addamount2 = user?.totalAmount * 0.006;
  console.log("addamount1 is", addamount1);
  console.log("addamount2 is", addamount2);

  if (!(addamount1 == 0) && checking >= 24) {
    console.log(`Yes Hn.`);
    if (user?.totalAmount <= 500 || user?.totalAmount > 500) {
      console.log("0.5 valay may agya");

      /// user
      await user?.updateOne({
        balance: user?.balance + addamount1,
        // totalAmount: user?.totalAmount + addamount,
      });

      /// userHead
      await YourHead?.updateOne({
        balance: YourHead?.balance + AddAmountUserHead,
        // totalAmount: user?.totalAmount + addamount,
      });
      await YourHead?.save()

      /// userHead1
      await YourHead1?.updateOne({
        balance: YourHead1?.balance + AddAmountUserHead1,
        // totalAmount: user?.totalAmount + addamount,
      });
      await YourHead1?.save()

      
      /// userHead2
      await YourHead2?.updateOne({
        balance: YourHead2?.balance + AddAmountUserHead2,
        // totalAmount: user?.totalAmount + addamount,
      });
      await YourHead2?.save()

      /// userHead3
      await YourHead3?.updateOne({
        balance: YourHead3?.balance + AddAmountUserHead3,
        // totalAmount: user?.totalAmount + addamount,
      });
      await YourHead3?.save()

      /// userHead4
      await YourHead4?.updateOne({
        balance: YourHead4?.balance + AddAmountUserHead4,
        // totalAmount: user?.totalAmount + addamount,
      });
      await YourHead4?.save()

       /// userHead5
       await YourHead5?.updateOne({
        balance: YourHead5?.balance + AddAmountUserHead5,
        // totalAmount: user?.totalAmount + addamount,
      });
      await YourHead5?.save();

      /// userHead6
      await YourHead6?.updateOne({
        balance: YourHead6?.balance + AddAmountUserHead6,
        // totalAmount: user?.totalAmount + addamount,
      });
      await YourHead6?.save();

      /// userHead7
      await YourHead7?.updateOne({
        balance: YourHead7?.balance + AddAmountUserHead7,
        // totalAmount: user?.totalAmount + addamount,
      });
      await YourHead7?.save();

      /// userHead8
      await YourHead8?.updateOne({
        balance: YourHead8?.balance + AddAmountUserHead8,
        // totalAmount: user?.totalAmount + addamount,
      });
      await YourHead8?.save();

      /// userHead9
      await YourHead9?.updateOne({
        balance: YourHead9?.balance + AddAmountUserHead9,
        // totalAmount: user?.totalAmount + addamount,
      });
      await YourHead9?.save();

      /// userHead10
      await YourHead10?.updateOne({
        balance: YourHead10?.balance + AddAmountUserHead10,
        // totalAmount: user?.totalAmount + addamount,
      });
      await YourHead10?.save();

      /// userHead11
      await YourHead11?.updateOne({
        balance: YourHead11?.balance + AddAmountUserHead11,
        // totalAmount: user?.totalAmount + addamount,
      });
      await YourHead11?.save();

      /// userHead12
      await YourHead12?.updateOne({
        balance: YourHead12?.balance + AddAmountUserHead12,
        // totalAmount: user?.totalAmount + addamount,
      });
      await YourHead12?.save();

    /// userHead13
    await YourHead13?.updateOne({
      balance: YourHead13?.balance + AddAmountUserHead13,
      // totalAmount: user?.totalAmount + addamount,
    });
    await YourHead13?.save();

    /// userHead14
    await YourHead14?.updateOne({
      balance: YourHead14?.balance + AddAmountUserHead14,
      // totalAmount: user?.totalAmount + addamount,
    });
    await YourHead14?.save();


      await userInvestment[0]?.updateOne({
        ApproveTime: Date.now(),
      });
      // await userInvestment?.save();
    }

    // if (user?.totalAmount > 500) {
    //   console.log("0.8 valay may agya");
    //   await user.updateOne({
    //     balance: user?.balance + addamount2,
    //   });
    //   await userInvestment[0]?.updateOne({
    //     ApproveTime: Date.now(),
    //   });
      
    //   await userInvestment?.save();
    // }
    console.log("user balance is ", user?.balance);
  } else {console.log("object");}

  res.status(200).json({
    user: user,
    YourHead: YourHead,
    Team: userTeam,
  });
};

export const updateInvestment = async (req, res) => {
  console.log("her aik minut k baad update ho rhee hn");
};

// fetch current loggin user
export const loggedInUser = async (req, res) => {
  try {
    const user = await Auth.findById(req.user.id);
    user.password = undefined;
    user.resetCode = undefined;
    res.json(user);
  } catch (err) {
    console.log(err);
    res.json({ error: "UnAuthorized User" });
  }
};

export const fetchAllUser = async (req, res) => {
  const user = await Auth.findById(req.user.id);
  const userTeam = await Auth.find(
    // { _id: user.team_member, _id: { $ne: user._id } },
    { _id: { $ne: user._id } }

    // "first_name last_name email phone_number"
  );

  res.status(200).json({
    success: true,

    AllUser: userTeam,
  });
};

export const fetchAllInvestment = async (req, res) => {
  const user = await Auth.findById(req.user.id);
  const AllInvestment = await Investment.find().populate(
    "investedBy",
    "first_name last_name email phone_number username _id"
  );

  res.json({
    success: true,
    AllUserInvestment: AllInvestment,
  });
};

export const fetchSingleUSer = async (req, res) => {
  const user = await Auth.findById(req.params.id);
  res.status(200).json({
    success: true,
    data: user,
  });
};

export const uploadImage = (req, res) => {
  try {
    //console.log(req.body);
    const { image } = req.body;

    const base64Image = new Buffer.from(
      image.replace(/^data:image\/\w+;base64,/, ""),
      "base64"
    );


    const type = image.split(";")[0].split("/")[1];

    /* image params */
    const params = {
      Bucket: "ziaja.io-bucket",
      Key: `${nanoid()}.${type}`,
      Body: base64Image,
      ACL: "public-read",
      ContentEncoding: "base64",
      ContentType: `image/${type}`,
    };
    config.AWSS3.upload(params, (err, data) => {
      if (err) {
        console.log(err);
        res.json({
          message: "Something Went Wrong",
        })
      } else {
        //console.log(data);
        res.send(data);
      }
    });
  } catch (err) {
    console.log(err);
    res.json({ error: "Upload Failed….try again" });
  }
};


export const uploadHomeImage = async(req, res) => {
  try {
    //console.log(req.body);
    const { picture1 , picture2 , picture3 , picture4 } = req.body;

    // const pictures = await Picture.create({
    //   UserId:req.user.id,
    //   Picture1:picture1,
    //   Picture2:picture2,
    //   Picture3:picture3,
    //   Picture4:picture4
    // })

    if(picture1){
   await Picture.findOneAndUpdate({UserId:req.user.id},{  
      Picture1:picture1,
      
    })
  }
  if(picture2){
    await Picture.findOneAndUpdate({UserId:req.user.id},{  
      Picture2:picture2,
     
    })
  }
  if(picture3){
    await Picture.findOneAndUpdate({UserId:req.user.id},{  
      Picture3:picture3
     
    });
  }
  if(picture4){
   await Picture.findOneAndUpdate({UserId:req.user.id},{  
      Picture4:picture4,
      
    })
  }

    res.json({ message: "Picture Update Successfully" });
  } catch (err) {
    console.log(err);
    res.json({ error: "Upload Failed….try again" });
  }
};

export const fetchAllPicture = async(req , res)=>{
  try {
    const pictures = await Picture.findOne();
    res.json({
      Picture:pictures
    })
}catch (err) {
  console.log(err);
  res.json({ error: "Upload Failed….try again" });
}
}

export const depositUser = async (req, res) => {
  const code = nanoid(5);
  const verificatioCode = nanoid(7);

  const { image, amount, accountId, transactionId, discription } = req.body;

  if (!image) {
    return res.json({ error: "Please Provide Image to Deposit" });
  }

  if (!amount) {
    return res.json({ error: "Please Provide Amount to Deposit" });
  }
  if (!accountId) {
    return res.json({ error: "Please Provide Account Id" });
  }
  // if (accountId.length <= 41 || accountId.length >= 43) {
  //   return res.json({ error: "Please provide an valid account lenght id" });
  // }
  if (!transactionId) {
    return res.json({ error: "Please Provide an Transaction Id" });
  }
  // if (transactionId.length <= 41 || transactionId.length >= 43) {
  //   return res.json({ error: "Please provide an valid transaction id" });
  // }
  if (!discription) {
    return res.json({ error: "Please Write Your Description" });
  }

  var d = new Date();
  console.log(d);

  console.log(d.toLocaleDateString());
  var requestedDate = d.toLocaleDateString();
  console.log(d.toLocaleTimeString());
  var requestedTime = d.toLocaleTimeString();

  const user = await Auth.findById(req.user.id);
  console.log("object");
  const userInvestment = await Investment.create({
    investedBy: req.user.id,
    investedAmount: amount,
    accountId: accountId,
    transactionId: transactionId,
    description: discription + ` - ${code}`,
    picture: image,

    RequestedDate: requestedDate,
    RequestedTime: Date.now(),
    Status: "pending",
    checkCode: code,
  });
  console.log("object");
  // send mail with the verfication
  // config.AWSSES.sendEmail(
    // emailTemplate(
    //   user.email,
    //   config.REPLY_TO,
    //   "User Amount Verification Request",
    //   // `Hi ${first_ame} ${last_name}, Please read your opt to activate your account. <a href="http://localhost:3000/auth/activate/${email}/${password}">Activate Account</a>`
    //   `        <h2 style='text-align:Center ;  text-decoration: underline;'> User Amount  Verification Code 👷‍♂️</h2>
    //     <p style='padding-left:22px ; font-weight:bold ; font-size:16px ;  text-decoration: underline;'>You have received a new Invester enquiry </p>
    //     <h4 style=' ${style}'> Invester Information </h4>
    //     <p style=' ${style}'> Name:- ${user.first_name} ${user.last_name} </p>
    //     <p style=' ${style}'> Email:- ${user.email}  </p>
    //     <p style=' ${style}'> Phone:- ${user.phone_number} </p>
    //     <p style=' ${style}'> AccountId:- ${user.accountId} </p>
    //     <p style=' ${style}'> TransactionId:- ${user.transactionId} </p>

    //     <p style=' ${style}'> Message:- ${discription}  </p>
    //        <p style=' ${style}'>User Otp :-  ${code}</p>
    //     <b style='padding-left:22px;'>Please read your otp and put on form for verify user payment.</b>
    //     `
    // ),
    // (err, data) => {
    //   if (err) {
    //     return console.log(err);
    //     res.status(500).json({ ok: false });
    //   } else {
    //     console.log(data);
    //     return res.json({
    //       ok: true,
    //       message: "Your Investment Verification Request Send  Successfully",
    //       investment: userInvestment,
    //     });
    //   }
    // }
  // );
  sendHTML(
    config.EMAIL_FROM,
    config.EMAIL_FROM2,
    
    "User Amount Verification Request",
    `        <h2 style='text-align:Center ; text-decoration: underline;'> Dear [ ${user.first_name} ${user.last_name}] 👷‍♂️</h2>
      <p style='padding-left:22px ; font-weight:bold ; text-decoration: underline ; font-size:16px'>User Amount  Verification Code 👷‍♂️ </p>
 <p style='padding-left:22px ; font-weight:bold ; font-size:16px ;  text-decoration: underline;'>You have received a new Invester enquiry </p>
        <h4 style=' ${style}'> Invester Information </h4>
       <p style=' ${style}'> Name:- ${user.first_name} ${user.last_name} </p>
       <p style=' ${style}'> Email:- ${user.email}  </p>
       <p style=' ${style}'> Phone:- ${user.phone_number} </p>
      <p style=' ${style}'> AccountId:- ${accountId} </p>
       <p style=' ${style}'> TransactionId:- ${transactionId} </p>
        <p style=' ${style}'>User OTP :- <span> ${code}🚨</span></p>

      <p style='padding-left:22px ; font-size:16px'>At No-Reply, your financial growth is our priority. By continuing to invest with us diverse portfolio of investment opportunities, and personalized investment strategies tailored to your goals. Our secure platform ensures your investments are protected while you benefit from competitive returns and innovative investment solutions </p>
      <p style='padding-left:22px ; font-size:16px'>Thank you for trusting No-Reply with your financial future. </p>
      <p style='padding-left:22px ; font-size:16px'>Best regards </p>
      <p style='padding-left:22px ; font-size:16px'>The No-Reply Team</p>
     
      `
  ),

  
       res.json({
        ok: true,
        message: "Your Investment Verification Request Send  Successfully",
      });

  // const commission = await amount * 0.1
  // const user = await Auth.findById(req.user.id);
  // const userHead = await Auth.findByIdAndUpdate(
  //   { _id: user.YourHead  },{balance:commission}
  //   ,{new:true}
  // );
  // const headsofUserHead = await Auth.find({_id:userHead.YourHeadReferBy}).updateMany({balance:""})

  // const deposit = new Deposit({
  //   YourHead: user.YourHead,
  //   UserName: user.UserName,
  //   ImageUrl: data.Location,
  //   AccountID: accountId,
  //   Amount: parseFloat(amount),
  //   Description: discription || "",
  //   Code: code,
  //   TeamLeader: userTeam.email,
  //   PhoneNumber: userTeam.phone_number,
  //   FirstName: userTeam.first_name,
};

// Admi route
export const ApprovedepositUser = async (req, res) => {
  // try {
  //   let deposits=await Deposit.find({Status:'Pending'});
  //   for (let i = 0; i < deposits.length ; i++) {

  //     if ((moment().unix() - moment(deposits[i].createdAt).startOf('day').unix()) > 2*24*60*60 ) {
  //       await deposits[i].remove();
  //     }else{

  //       await deposits[i].save();
  //     }
  //   };
  //   console.log("Approve Successfully");
  // }catch(e){
  //   console.log(e);
  // }

  const verificatioCode = nanoid(7);
  const { User_Amount_Verification_Code } = req.body;
  if (!User_Amount_Verification_Code) {
    return res.json({
      error: "Please Enter Valid User Investment Verification Code",
    });
  }
  const user = await Investment.findOneAndUpdate(
    { checkCode: User_Amount_Verification_Code },
    {
      checkCode: "",
      Status: "Approve",
      ApproveDate: new Date().toLocaleDateString(),
      ApproveTime: Date.now(),
    },
    { new: true }
  ).populate("investedBy", "first_name last_name email");
  if (!user) {
    return res.json({
      error: "User Not Found With this Investment Verification Code",
    });
  }
  const LoginUser = await Auth.findOne({ _id: user.investedBy });
  await LoginUser.updateOne({
    totalAmount: LoginUser.totalAmount + user.investedAmount,
    balance: LoginUser.balance + 0.5,
  });

  await LoginUser.save();
  // const updateUserTotalAmount = await Investment.findByIdAndUpdate(
  //   user._id,
  //   { totalAmount: user.investedAmount + usertotalAmount },
  //   { new: true }
  // );
  // const loginUser = await Auth.findOne({_id:updateUserTotalAmount.investedBy})
  const commision = user.investedAmount * 0.07;
  console.log(commision);
  const realCommision = commision && Number.parseFloat(commision).toFixed(2);
  const userHead = await Auth.findOne({ _id: LoginUser.YourHead });
  await userHead.updateOne({
    balance: userHead.balance + commision,
  });
  await userHead.save();

  const firstHeadsofUserHead = (await user.investedAmount) * 0.03;
  const secondHeadsofUserHead = (await user.investedAmount) * 0.02;
  const thirdHeadsofUserHead = (await user.investedAmount) * 0.02;
  const fourthHeadsofUserHead = (await user.investedAmount) * 0.01;
  const fifthHeadsofUserHead = (await user.investedAmount) * 0.01;
  const sixthHeadsofUserHead = (await user.investedAmount) * 0.01;
  const seventhHeadsofUserHead = (await user.investedAmount) * 0.01;
  // const eigthHeadsofUserHead = (await user.investedAmount) * 0.01;
  // const ninthHeadsofUserHead = (await user.investedAmount) * 0.01;

  /// firstHeadsofUserHead
  const updateFirstHeadsofUserHead = await Auth.findOne({
    _id: userHead?.YourHeadReferBy?.[1],



  });

  await updateFirstHeadsofUserHead?.updateOne({
    balance: updateFirstHeadsofUserHead?.balance + firstHeadsofUserHead,
  });
  await userHead.save();

  /// secondHeadsofUserHead
  const updateSecondHeadsofUserHead = await Auth.findOne({
    _id: userHead?.YourHeadReferBy?.[2],
  });
  await updateSecondHeadsofUserHead?.updateOne({
    balance: updateSecondHeadsofUserHead.balance + secondHeadsofUserHead,
  });
  await userHead.save();

  /// thirdHeadsofUserHead
  const updateThirdHeadsofUserHead = await Auth.findOne({
    _id: userHead?.YourHeadReferBy?.[3],
  });
  await updateThirdHeadsofUserHead?.updateOne({
    balance: updateThirdHeadsofUserHead.balance + thirdHeadsofUserHead,
  });
  await userHead.save();

  ///  updateFourthHeadsofUserHead
  const updateFourthHeadsofUserHead = await Auth.findOne({
    _id: userHead?.YourHeadReferBy?.[4],
  });
  await updateFourthHeadsofUserHead?.updateOne({
    balance: updateFourthHeadsofUserHead?.balance + fourthHeadsofUserHead,
  });
  await userHead.save();

  ///  updateFifthHeadsofUserHead
  const updateFifthHeadsofUserHead = await Auth.findOne({
    _id: userHead?.YourHeadReferBy?.[5],
  });
  await updateFifthHeadsofUserHead?.updateOne({
    balance: updateFifthHeadsofUserHead?.balance + fifthHeadsofUserHead,
  });
  await userHead.save();

  ///  updateSixthHeadsofUserHead
  const updateSixthHeadsofUserHead = await Auth.findOne({
    _id: userHead?.YourHeadReferBy?.[6],
  });
  await updateSixthHeadsofUserHead?.updateOne({
    balance: updateSixthHeadsofUserHead?.balance + sixthHeadsofUserHead,
  });
  await userHead.save();

  ///  updateSeventhHeadsofUserHead
  const updateSeventhHeadsofUserHead = await Auth.findOne({
    _id: userHead?.YourHeadReferBy?.[7],
  });
  await updateSeventhHeadsofUserHead?.updateOne({
    balance: updateSeventhHeadsofUserHead?.balance + seventhHeadsofUserHead,
  });
  await userHead.save();

  /// updateEigthHeadsofUserHead
  // const updateEigthHeadsofUserHead = await Auth.findOne({
  //   _id: userHead?.YourHeadReferBy?.[8],
  // });
  // await updateEigthHeadsofUserHead?.updateOne({
  //   balance: updateEigthHeadsofUserHead?.balance + eigthHeadsofUserHead,
  // });
  // await userHead.save();

  /// updateNinthHeadsofUserHead
  // const updateNinthHeadsofUserHead = await Auth.findOne({
  //   _id: userHead?.YourHeadReferBy?.[9],
  // });
  // await updateNinthHeadsofUserHead?.updateOne({
  //   balance: updateNinthHeadsofUserHead?.balance + ninthHeadsofUserHead,
  // });
  // await userHead.save();

  // res.json({
  //   user: LoginUser,
  //   message: "You are approve this User ",
  //   userHead: userHead,
  // });

  // send mail with the verfication
  // config.AWSSES.sendEmail(
  //   emailTemplate(
  //     config.EMAIL_FROM,
  //     LoginUser.email,
  //     " Your Deposit Requset Approve Successfully",
  //     // `Hi ${first_ame} ${last_name}, Please read your opt to activate your account. <a href="http://localhost:3000/auth/activate/${email}/${password}">Activate Account</a>`
  //     `        <h2 style='text-align:Center ;  text-decoration: underline;'> Your Deposit Requset Approve Successfully 👷‍♂️</h2>
  //         <h4 style=' ${style}'> Your Deposit Information </h4>
  //         <p style=' ${style}'> Name:-  hello ${LoginUser.first_name} ${LoginUser.last_name} </p>
  //         <p style=' ${style}'> Amount:- ${LoginUser.totalAmount} </p>
  //         <p style=' ${style}'> Requested Date:- ${LoginUser.createdAt} </p>
         
  //         `
  //   ),
    // (err, data) => {
    //   if (err) {
    //     return console.log(err);
    //     res.json({ ok: false });
    //   } else {
    //     console.log(data);
    //     return res.json({
    //       ok: true,
    //       user: LoginUser,
    //       userHead: userHead,
    //       message:
    //         "Deposit Approve Successfully and Approval send on User Email",
    //     });
    //   }
    // }
  // );
  sendHTML(
    config.EMAIL_FROM,
    LoginUser.email,
    
    "Your Deposit Requset Approve Successfully",
    `        <h2 style='text-align:Center ; text-decoration: underline;'> Dear [ ${LoginUser.first_name} ${LoginUser.first_name}] 👷‍♂️</h2>
     <h2 style='text-align:Center ;  text-decoration: underline;'> Your Deposit Requset Approve Successfully 👷‍♂️</h2>
         <h4 style=' ${style}'> Your Deposit Information </h4>
           <p style=' ${style}'> Amount:- ${LoginUser.totalAmount} </p>
           <p style=' ${style}'> Requested Date:- ${LoginUser.createdAt} </p>

      <p style='padding-left:22px ; font-size:16px'>At No-Reply, your financial growth is our priority. By continuing to invest with us diverse portfolio of investment opportunities, and personalized investment strategies tailored to your goals. Our secure platform ensures your investments are protected while you benefit from competitive returns and innovative investment solutions </p>
      <p style='padding-left:22px ; font-size:16px'>Thank you for trusting No-Reply with your financial future. </p>
      <p style='padding-left:22px ; font-size:16px'>Best regards </p>
      <p style='padding-left:22px ; font-size:16px'>The No-Reply Team</p>
     
      `
  )
  res.json({
    ok: true,
    message: "Deposit Approve Successfully and Approval send on User Email",
  });
};

export const RejectDepositUser = async (req, res) => {
  const { code, reason } = req.body;
  if (!code) {
    return res.json({
      error: "Please enter a valid code to Reject User Deposit blank",
    });
  }
  if (!reason) {
    return res.json({
      error: "Please enter a valid reason to Reject User Deposit Request",
    });
  }
  if (code.length <= 4 || code.length >= 6) {
    return res.json({
      error: "Please enter a valid code to Reject User Deposit",
    });
  }

  const findUser = await Investment.findOne({ checkCode: code }).populate(
    "investedBy",
    "first_name last_name email totalAmount "
  );
  if (!findUser) {
    return res.json({
      error: "No Deposit Request Find 404! With " + code,
    });
  }

  console.log(findUser);
  const user1 = await Investment.findByIdAndUpdate(findUser._id, {
    checkCode: "",
  });

  const user = await Investment.findByIdAndUpdate(
    user1._id,
    { Status: "Reject", Reason: reason },
    { new: true }
  );

  // send mail with the verfication
  // config.AWSSES.sendEmail(
  //   emailTemplate(
  //     config.EMAIL_FROM,
  //     findUser.investedBy.email,
  //     " Your Deposit Requset Reject UnSuccessfully",
  //     // `Hi ${first_ame} ${last_name}, Please read your opt to activate your account. <a href="http://localhost:3000/auth/activate/${email}/${password}">Activate Account</a>`
  //     `        <h2 style='text-align:Center ; text-decoration: underline;'> Your Deposit Requset Reject UnSuccessfully 👷‍♂️</h2>
  //         <h4 style=' ${style}'> Your Deposit Information </h4>
  //         <p style=' ${style}'> Name:-  hello ${findUser.investedBy.first_name} ${findUser.investedBy.last_name} </p>
  //         <p style=' ${style}'> Amount:- ${findUser.investedBy.totalAmount} </p>
  //         <p style=' ${style}'> Reason:- ${reason} </p>
  //         <p style=' ${style}'> Requested Date:- ${findUser.createdAt} </p>
         
  //         `
  //   ),
  //   (err, data) => {
  //     if (err) {
  //       return console.log(err);
  //       res.json({ ok: false });
  //     } else {
  //       console.log(data);
  //       return res.json({
  //         ok: true,
  //         message:
  //           "Deposit Reject UnSuccessfully and Rejection send on User Email22222222222",
  //       });
  //     }
  //   }
  // );
  sendHTML(
      config.EMAIL_FROM,
      findUser.investedBy.email,
    
    "Your Deposit Requset Reject UnSuccessfully",
    `        <h2 style='text-align:Center ; text-decoration: underline;'> Dear [ ${findUser.investedBy.first_name} ${findUser.investedBy.last_name}] 👷‍♂️</h2>
     <h2 style='text-align:Center ;  text-decoration: underline;'> Your Deposit Requset Reject UnSuccessfully 👷‍♂️</h2>
         <h4 style=' ${style}'> Your Deposit Information </h4>
           <p style=' ${style}'> Amount:- ${user.totalAmount} </p>
          <p style=' ${style}'> Reason:- ${reason} </p>


      <p style='padding-left:22px ; font-size:16px'>At No-Reply, your financial growth is our priority. By continuing to invest with us diverse portfolio of investment opportunities, and personalized investment strategies tailored to your goals. Our secure platform ensures your investments are protected while you benefit from competitive returns and innovative investment solutions </p>
      <p style='padding-left:22px ; font-size:16px'>Thank you for trusting No-Reply with your financial future. </p>
      <p style='padding-left:22px ; font-size:16px'>Best regards </p>
      <p style='padding-left:22px ; font-size:16px'>The No-Reply Team</p>
     
      `
  )
  res.json({
    ok: true,
    message: "Deposit Reject UnSuccessfully and Rejection send on User Email",
  });
};

export const withDrawRequest = async (req, res) => {
  const code = nanoid(5);
  const verificatioCode = nanoid(7);

  const { amount, accountId, description } = req.body;

  if (!amount) {
    return res.json({ error: "Please provide an amount to WithDraw" });
  }
  if (!accountId) {
    return res.json({ error: "Please provide an  account id" });
  }
  // if (accountId.length <= 41 || accountId.length >= 43) {
  //   return res.json({ error: "Please provide an valid account lenght id" });
  // }

  if (!description) {
    return res.json({ error: "Please write your discription" });
  }
  const user = await Auth.findById(req.user.id);

  const userInvestment = await WithDraw.create({
    WithDrawRequestedBy: req.user.id,
    Amount: amount,
    AccountId: accountId,
    Description: description + ` - ${code}`,
    Status: "pending",
    checkCode: code,
  });
  // send mail with the verfication
  // config.AWSSES.sendEmail(
  //   emailTemplate(
  //     user.email,
  //     config.REPLY_TO,
  //     "User WithDraw Amount  Request",
  //     // `Hi ${first_ame} ${last_name}, Please read your opt to activate your account. <a href="http://localhost:3000/auth/activate/${email}/${password}">Activate Account</a>`
  //     `        <h2 style='text-align:Center ;  text-decoration: underline;'> User WithDraw  Verification Code 👷‍♂️</h2>
  //       <p style='padding-left:22px ;  text-decoration: underline; font-weight:bold ; font-size:16px'>You have received a new WithDraw Request </p>
  //       <h4 style=' ${style}'> User WithDraw Information </h4>
  //       <p style=' ${style}'> Name:- ${user.first_name} ${user.last_name} </p>
  //       <p style=' ${style}'> Email:- ${user.email}  </p>
  //       <p style=' ${style}'> Phone:- ${user.phone_number} </p>
  //       <p style=' ${style}'> Amount:- ${amount} </p>
  //       <p style=' ${style}'> AccountId:- ${accountId} </p>
  //       <p style=' ${style}'> Message:- ${description}  </p>
  //          <p style=' ${style}'>User Otp :-  ${code}</p>
  //       <b style='padding-left:22px ; '>Please read your otp and put on form for verify user payment.</b>
  //       `
  //   ),
  //   (err, data) => {
  //     if (err) {
  //       return console.log(err);
  //       res.status(500).json({ ok: false });
  //     } else {
  //       console.log(data);
  //       return res.json({
  //         ok: true,
  //         message: "Your WithDraw Request Send  Successfully",
  //         investment: userInvestment,
  //       });
  //     }
  //   }
  // );

  sendHTML(
    config.EMAIL_FROM,
    config.EMAIL_FROM2,
  "User WithDraw Amount  Request",
  `           <h2 style='text-align:Center ;  text-decoration: underline;'> User WithDraw  Verification Code 👷‍♂️</h2>
         <p style='padding-left:22px ;  text-decoration: underline; font-weight:bold ; font-size:16px'>You have received a new WithDraw Request </p>
         <h4 style=' ${style}'> User WithDraw Information </h4>
         <p style=' ${style}'> Name:- ${user.first_name} ${user.last_name} </p>
         <p style=' ${style}'> Email:- ${user.email}  </p>
         <p style=' ${style}'> Phone:- ${user.phone_number} </p>
         <p style=' ${style}'> Amount:- ${amount} </p>
         <p style=' ${style}'> AccountId:- ${accountId} </p>
         <p style=' ${style}'> Message:- ${description}  </p>
            <p style=' ${style}'>User Otp :-  ${code}</p>


    <p style='padding-left:22px ; font-size:16px'>At No-Reply, your financial growth is our priority. By continuing to invest with us diverse portfolio of investment opportunities, and personalized investment strategies tailored to your goals. Our secure platform ensures your investments are protected while you benefit from competitive returns and innovative investment solutions </p>
    <p style='padding-left:22px ; font-size:16px'>Thank you for trusting No-Reply with your financial future. </p>
    <p style='padding-left:22px ; font-size:16px'>Best regards </p>
    <p style='padding-left:22px ; font-size:16px'>The No-Reply Team</p>
   
    `
)
res.json({
  ok: true,
  message: "Your WithDraw Request Send  Successfully",
});

  // const commission = await amount * 0.1
  // const user = await Auth.findById(req.user.id);
  // const userHead = await Auth.findByIdAndUpdate(
  //   { _id: user.YourHead  },{balance:commission}
  //   ,{new:true}
  // );
  // const headsofUserHead = await Auth.find({_id:userHead.YourHeadReferBy}).updateMany({balance:""})

  // const deposit = new Deposit({
  //   YourHead: user.YourHead,
  //   UserName: user.UserName,
  //   ImageUrl: data.Location,
  //   AccountID: accountId,
  //   Amount: parseFloat(amount),
  //   Description: discription || "",
  //   Code: code,
  //   TeamLeader: userTeam.email,
  //   PhoneNumber: userTeam.phone_number,
  //   FirstName: userTeam.first_name,
};

export const approveWithDraw = async (req, res) => {
  const { code, description } = req.body;
  if (!code) {
    return res.json({
      error: "Please enter a valid code to Approve User WithDraw blank",
    });
  }

  if (code.length <= 4 || code.length >= 6) {
    return res.json({
      error: "Please enter a valid code to Approve User WithDraw",
    });
  }

  const findUser = await WithDraw.findOne({ checkCode: code }).populate(
    "WithDrawRequestedBy",
    "first_name last_name email balance _id"
  );
  if (!findUser) {
    return res.json({
      error: "No WithDraw Request Find 404! With " + code,
    });
  }
  
  const cutting = await findUser.WithDrawRequestedBy.balance - findUser.Amount
  console.log(cutting);

  await Auth.findByIdAndUpdate(
    { _id: findUser.WithDrawRequestedBy._id },
    { balance: cutting },
    { new: true }
    );
  console.log(findUser);
  const user1 = await WithDraw.findByIdAndUpdate(findUser._id, {
    checkCode: "", 
  });
  const user = await WithDraw.findByIdAndUpdate(
    user1._id,

    { Status: "Approve" },


    { new: true }
  );

  // send mail with the verfication
  // config.AWSSES.sendEmail(
  //   emailTemplate(
  //     config.EMAIL_FROM,
  //     findUser.WithDrawRequestedBy.email,
  //     "Congragulation! Your WithDrawl Requset Approve Successfully",
  //     // `Hi ${first_ame} ${last_name}, Please read your opt to activate your account. <a href="http://localhost:3000/auth/activate/${email}/${password}">Activate Account</a>`
  //     `        <h2 style='text-align:Center ;  text-decoration: underline;'> Congragulation! Your WithDrawl Requset Approve Successfully 👷‍♂️</h2>
  //         <h4 style=' ${style}'> Your WithDraw Information </h4>
  //         <p style=' ${style}'> Name:-  hello ${findUser.WithDrawRequestedBy.first_name} ${findUser.WithDrawRequestedBy.last_name} </p>
  //         <p style=' ${style}'> Amount:- ${findUser.Amount} send in your Binance account </p>
  //         <p style=' ${style}'> Requested Date:- ${findUser.createdAt} </p>
         
  //         `
  //   ),
  //   (err, data) => {
  //     if (err) {
  //       return console.log(err);
  //       res.status(500).json({ ok: false });
  //     } else {
  //       console.log(data);
  //       return res.json({
  //         ok: true,
  //         message:
  //           "WithDraw Approve Successfully and Approval send on User Email",
  //       });
  //     }
  //   }
  // );
  sendHTML(
        config.EMAIL_FROM,
      findUser.WithDrawRequestedBy.email,
  "Congragulation! Your WithDrawl Requset Approve Successfully",
  `            <h2 style='text-align:Center ;  text-decoration: underline;'> Congragulation! Your WithDrawl Requset Approve Successfully 👷‍♂️</h2>
        <h4 style=' ${style}'> Your WithDraw Information </h4>
        <p style=' ${style}'> Name:-  hello ${findUser.WithDrawRequestedBy.first_name} ${findUser.WithDrawRequestedBy.last_name} </p>
        <p style=' ${style}'> Amount:- ${findUser.Amount} send in your  account </p>
       <p style=' ${style}'> Requested Date:- ${findUser.createdAt} </p>


    <p style='padding-left:22px ; font-size:16px'>At No-Reply, your financial growth is our priority. By continuing to invest with us diverse portfolio of investment opportunities, and personalized investment strategies tailored to your goals. Our secure platform ensures your investments are protected while you benefit from competitive returns and innovative investment solutions </p>
    <p style='padding-left:22px ; font-size:16px'>Thank you for trusting No-Reply with your financial future. </p>
    <p style='padding-left:22px ; font-size:16px'>Best regards </p>
    <p style='padding-left:22px ; font-size:16px'>The No-Reply Team</p>
   
    `
)
res.json({
  ok: true,
  message: "WithDraw Approve Successfully and Approval send on User Email",
});
};

export const RejectWithDraw = async (req, res) => {
  const { code, reason } = req.body;
  if (!code) {
    return res.json({
      error: "Please enter a valid code to Reject User WithDraw blank",
    });
  }
  if (!reason) {
    return res.json({
      error: "Please enter a valid reason to Reject User WithDraw Request",
    });
  }
  if (code.length <= 4 || code.length >= 6) {
    return res.json({
      error: "Please enter a valid code to Reject User WithDraw",
    });
  }

  const findUser = await WithDraw.findOne({ checkCode: code }).populate(
    "WithDrawRequestedBy",
    "first_name last_name email "
  );
  if (!findUser) {
    return res.json({
      error: "No WithDraw Request Find 404! With " + code,
    });
  }

  console.log(findUser);
  const user1 = await WithDraw.findByIdAndUpdate(findUser._id, {
    checkCode: "",
  });

  const user = await WithDraw.findByIdAndUpdate(
    user1._id,
    { Status: "Reject", Reason: reason },
    { new: true }
  );

  // send mail with the verfication
  // config.AWSSES.sendEmail(
  //   emailTemplate(
  //     config.EMAIL_FROM,
  //     findUser.WithDrawRequestedBy.email,
  //     " Your WithDrawl Requset Reject UnSuccessfully",
  //     // `Hi ${first_ame} ${last_name}, Please read your opt to activate your account. <a href="http://localhost:3000/auth/activate/${email}/${password}">Activate Account</a>`
  //     `        <h2 style='text-align:Center ;  text-decoration: underline;'> Your WithDrawl Requset Reject UnSuccessfully 👷‍♂️</h2>
  //         <h4 style=' ${style}'> Your WithDraw Information </h4>
  //         <p style=' ${style}'> Name:-  hello ${findUser.WithDrawRequestedBy.first_name} ${findUser.WithDrawRequestedBy.last_name} </p>
  //         <p style=' ${style}'> Amount:- No Amount send in your Binance account </p>
  //         <p style=' ${style}'> Reason:- ${reason} </p>
  //         <p style=' ${style}'> Requested Date:- ${findUser.createdAt} </p>
         
  //         `
  //   ),
  //   (err, data) => {
  //     if (err) {
  //       return console.log(err);
  //       res.json({ ok: false });
  //     } else {
  //       console.log(data);
  //       return res.json({
  //         ok: true,
  //         message:
  //           "WithDraw Reject UnSuccessfully and Rejection send on User Email",
  //       });
  //     }
  //   }
  // );
  sendHTML(
      config.EMAIL_FROM,
      findUser.WithDrawRequestedBy.email,
"Your WithDrawl Requset Reject UnSuccessfully",
`            <h2 style='text-align:Center ;  text-decoration: underline;'> Your WithDrawl Requset Reject UnSuccessfully 👷‍♂️</h2>
        <h4 style=' ${style}'> Your WithDraw Information </h4>
           <p style=' ${style}'> Name:-  hello ${findUser.WithDrawRequestedBy.first_name} ${findUser.WithDrawRequestedBy.last_name} </p>
         <p style=' ${style}'> Amount:- No Amount send in your  account </p>
           <p style=' ${style}'> Reason:- ${reason} </p>
           <p style=' ${style}'> Requested Date:- ${findUser.createdAt} </p>


<p style='padding-left:22px ; font-size:16px'>At No-Reply, your financial growth is our priority. By continuing to invest with us diverse portfolio of investment opportunities, and personalized investment strategies tailored to your goals. Our secure platform ensures your investments are protected while you benefit from competitive returns and innovative investment solutions </p>
<p style='padding-left:22px ; font-size:16px'>Thank you for trusting No-Reply with your financial future. </p>
<p style='padding-left:22px ; font-size:16px'>Best regards </p>
<p style='padding-left:22px ; font-size:16px'>The No-Reply Team</p>

`
)
res.json({
  ok: true,
  message: "WithDraw Reject UnSuccessfully and Rejection send on User Email",
});
};

// export const ChangeLimit = async(req , res) => {
//   const {limit} = req.body;
//   const user = await Auth.findById(req.user.id);
//   const user1 = await Auth.findByIdAndUpdate(user._id,{limit:limit},{new:true})
// const user1 = await Auth.find().where("_id").equals(req.user.id).updateOne({limit:limit})
//   res.json({
//     success: true,
//     user1,
//   });
// }

export const ChangeLimit = async (req, res) => {
  const { limit } = req.body;
  if (!limit) {
    return res.json({
      error: "Please enter a valid  withDraw limit",
    });
  }
  const AlluserLimit = await Auth.find().updateMany({ WithDrawLimit: limit });
  res.json({
    success: true,
    message: `All User Updated WithDrawal Limit is ${limit}`,
  });
};

export const fetchAllWithDrawRequest = async (req, res) => {
  const user = await Auth.findById(req.user.id);
  const AllWithDrawRequest = await WithDraw.find().populate(
    "WithDrawRequestedBy",
    "first_name last_name email phone_number username _id"
  );

  res.json({
    success: true,
    AllWithDrawRequest: AllWithDrawRequest,
  });
};
export const fetchAllPendingInvestment = async (req, res) => {
  try {
    //  // Query the collection to retrieve documents
    //  const documents = await collection.find({}).toArray();

    //  // Calculate sum of a specific field (assuming field name is 'amount')
    //  const totalAmount = documents.reduce((total, doc) => total + doc.amount, 0);

    const pendingUser = await Investment.find({
      Status: "pending",
    }).populate("investedBy", "first_name last_name email");

    const pendingWithdrawl = await WithDraw.find({
      Status: "pending",
    }).populate("WithDrawRequestedBy", "first_name last_name email");

    const limits =   await Auth.findOne({_id:req.user.id}, 'WithDrawLimit')
    console.log(limits)
    // let sumTotalAmount = Auth.reduce((acc, obj) => acc + obj.totalAmount, 0);
    // console.log(sum);
    res.json({
      pendingUser: pendingUser,
      total: pendingUser.length,
      pendingWithdrawl: pendingWithdrawl,
      limit: limits,
      // total: pendingUser.length,
      // totalInvestment:sumTotalAmount
    });
  } catch (error) {
    res.status(400).json({
      error: "Something went wrong... Try again",
    });
  }
};

export const fetchSingleUserInvestments = async (req, res) => {
  try {
    const user = await Auth.findById(req.user.id);
    if (!user) {
      return res.status(400).json({
        error: "User Not Found",
      });
    }
    const investments = await Investment.find({
      investedBy: user._id,
    }).populate("investedBy", "first_name last_name email");

    res.json({
      investments: investments,
    });
  } catch (error) {
    res.status(400).json({
      error: "Something went wrong... Try again",
    });
  }
};

export const fetchSingleUserWithDraw = async (req, res) => {
  try {
    const user = await Auth.findById(req.user.id);
    if (!user) {
      return res.json({
        error: "User Not Found",
      });
    }
    const withDraw = await WithDraw.find({
      WithDrawRequestedBy: user._id,
    }).populate("WithDrawRequestedBy", "first_name last_name email");

    res.json({
      WithDraws: withDraw,
    });
  } catch (error) {
    res.status(400).json({
      error: "Something went wrong... Try again",
    });
  }
};

export const changePassword = async (req, res) => {
  try {
    const { oldPassword, newPassword } = req.body;

    if (!oldPassword) {
      return res.json({
        error: "Old Password is required",
      });
    }
    if (!newPassword) {
      return res.json({
        error: "New Password is required",
      });
    }

    const user = await Auth.findById(req.user.id);
    //checking old password is correct or not
    const isPasswordMatched = await bcrypt.compare(oldPassword, user.password);
    if (!isPasswordMatched) {
      return res.json({ error: "Old Password Is Wrong" });
    }

    const salt = await bcrypt.genSalt(12);
    const password = await bcrypt.hash(newPassword, salt);
    user.password = password;
    const YourHead = await Auth.findById(
      user.YourHead,
      "first_name last_name email phone_number "
    );
    const userTeam = await Auth.find(
      { _id: user.team_member },
      "first_name last_name email phone_number"
    );

    user.save();
    return res.json({
      user: user,
      message: "Password Change Successfully",
    });
  } catch (error) {
    res.status(400).json({
      error: "Something went wrong... Try again",
    });
  }
};

// import AWS  from '@aws-sdk/client-sns';
// const snsClient = new AWS.SNS({
//   region: config.AWS_REGION,
//   credentials: {
//       accessKeyId: config.AWS_ACCESS_KEY_ID,
//       secretAccessKey: config.AWS_SECRET_ACCESS_KEY
//   }
// })
// export const sendOtp = async(req, res) => {
// const {phoneNumber}  = req.body;

// const otp = Math.floor(100000 + Math.random() * 900000);
// try{
//   const params = {
//     Message: `Your OTP is ${otp}`,
//     PhoneNumber: phoneNumber
// };
// await snsClient.send(new AWS.SNS.PublishCommand(params));
//         res.json({ success: true, message: 'OTP sent successfully' })
// }catch (error) {
//         console.error('Error sending OTP:', error);
//         res.status(500).json({ success: false, message: 'Error sending OTP' });
//     }

// }
// import { SNSClient, PublishCommand } from "@aws-sdk/client-sns"
// const credentials = {
//   accessKeyId: config.AWS_ACCESS_KEY_ID,
//   secretAccessKey: config.AWS_SECRET_ACCESS_KEY,
// };

// const snsClient = new SNSClient({
//   region: config.AWS_REGION,
//   credentials,
// });
// export const sendOtp = async(req, res) =>{
//  const {phoneNumber}  = req.body;
//   const otp = Math.floor(100000 + Math.random() * 900000);
//   const params = {
//     Message: `Your OTP is ${otp}`,
//     PhoneNumber: phoneNumber
// };
// console.log(otp)
// const command = new PublishCommand(params);
// await snsClient.send(command);
// res.json({
//   success:true,
//   message: 'OTP sent successfully'
// })
// }

import twilio from "twilio";
import Investment from "../models/cashModel.js";
import WithDraw from "../models/withDrawModel.js";
import Chats from "../models/chatModel.js";
import Picture from "../models/pictureModel.js";
import { sendHTML } from "../helper/email2.js";
export const sendOtp = async (req, res) => {
  // let twilio = require("twilio");
  const accountSid = config.TWILIO_ACCOUNT_SID;
  const authToken = config.TWILIO_AUTH_TOKEN;
  const client = new twilio(accountSid, authToken);
  // const service = "mhc";
  // const body = `Your One Time Password for Mobile Health Checkup is ${req.body.otp}. Don't share this with anyone.`;
  // const body = `Your One Time Password for Mobile Health Checkup is ${req.body.otp}. Don't share this with anyone.`;
  // const body = `Your One Time Password for MHC is ${req.body.code}`;
  // try {
  client.messages.create({
    body: `Hello Bhai!`,
    to: `${req.body.phoneNumber}`,
    from: "03034200503",
  });
  res.status(200).json({ success: true, message: "SMS sent successfully" });
};
