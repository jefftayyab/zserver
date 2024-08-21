import * as config from "../config/config.js";
// import fs from 'fs'
// import Logo1 from '../../Zclient/src/media/Logo'
const style = `
background: #e8e8e8;
border:2px solid black;
border-radius: 25px;
background-color: black;
color:white;

`;

// const image = fs.readFileSync('../../Zclient/src/media/Logo.jpeg');
// const base64Image = image.toString('base64');
// <img src=data:image/jpeg;base64,${base64Image}></img>
// <img src=${"https://myghar.s3.ap-northeast-1.amazonaws.com/NKttOqV8wzv2LAii70bmi.jpeg "}/>

const emailTemplate = (emailFrom, emailTo, subject, content) => {
  console.log(emailFrom)

  return {
    Source: emailFrom,
    Destination: {
      ToAddresses: [emailTo],
    },
    Message: {
      Body: {
        Html: {
          Charset: "UTF-8",
          Data: `
                    <html>
                        <body>
                        <div  style=${style}>
        <div style=' border:2px solid white;'>
        <div style=' background-color:white '>
        <img style='display: block; margin: 0 auto;' src='https://myghar.s3.ap-northeast-1.amazonaws.com/gHF5UVJoRE46O3QsK1wkU.jpeg'/>
        <h1 style='text-align:center ; color:black ;text-decoration: underline ; text-shadow: 2px 2px 4px #73aa43
        '>Welcome Ziaja.Io Website </h1></div>
        
        ${content}
        <div style='text-decoration: underline ;  background-color:white ; color:black ;'>
        <p style='padding-left:22px ; font-weight:bold ; text-align:center '> Ziaja.Io.com &copy; All Rights Reserved ${new Date().getFullYear()} </p>
       </div>
        </div>
        </div>
                        </body>
                    </html>
                    `,
        },
      },
      Subject: {
        Charset: "UTF-8",
        Data: subject,
      },
    },
  };
};

export default emailTemplate;
