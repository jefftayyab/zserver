import dotenv from 'dotenv'
dotenv.config()

export const smtpHost = "mail.smtp2go.com"
 const smtpPort = 2525
export const smtpUser = "support@airehealth.com"
export const smtpPass = "c2I2cmtleDlmajkw2"

// export const smtpHost = "mail.smtp2go.com"
//  const smtpPort = 2525
// export const smtpUser = "ziaja.io"
// export const smtpPass = "jTb14PbXG2uF9bhS"

import nodemailer from 'nodemailer'


// SMTP_HOST = mail.smtp2go.com
// SMTP_PORT = 2525
// SMTP_USER = support@airehealth.com
// SMTP_PASS = c2I2cmtleDlmajkw2   
// SMTP_FROM = support@airehealth.com
// SMTP_NAME = Rao Dermatology
// SMTP_BCC =



 const transporterOptions = {
  service: 'gmail',
  // host: 'smtp.gmail.com',
  // port: process.env.SMTP_PORT || 2525,
  port: 465,
  auth: {
    user: process.env.SMTP_USER || "waxexplore@gmail.com",
    pass: process.env.SMTP_PASS || "kgcdosqbadajglwf",
    
  }
}
// connectionTimeout: 10000, // 10 seconds
    // greetingTimeout: 10000, // 10 seconds
// console.log(transporterOptions)
console.log(process.env.SMTP_PORT)
console.log(process.env.SMTP_USER)
console.log(process.env.SMTP_HOST)
console.log(process.env.SMTP_PASS)


const style = `
background: #374151;
border:2px solid #64ffda;
border-radius: 25px;
background-color: #374151;
color:#64ffda;

`;
        // <img style='display: block; margin: 0 auto;' src='https://myghar.s3.ap-northeast-1.amazonaws.com/gHF5UVJoRE46O3QsK1wkU.jpeg'/>

export const sendHTML = async (emailFrom , emailTo , subject , content) => {
    const message = {
        // from: `Rao Dermatology<support@airehealth.com>`,
        from: `Wax Explore <waxexplore@gmail.com>`,
        to: emailTo ,
        bcc: '',
        subject: subject,
        html: `<div  style=${style}>
        <div style=' border:2px solid #64ffda; background-color:#374151;'>
        <div style=' background-color:#374151 '>
        <h1 style='text-align:center ; background-color:#374151; color:#64ffda ;text-decoration: underline ; text-shadow: 2px 2px 4px #73aa43
        '> Welcome to Wax Explore.com </h1></div>
        
        ${content}
        <div style='text-decoration: underline ; background-color:#374151; color:#64ffda ;'>
        <p style='padding-left:22px ; font-weight:bold ; text-align:center; background-color:#374151; '> WaxExplore.com &copy; All Rights Reserved ${new Date().getFullYear()} </p>
       </div>
        </div>
        </div>`
      }
    
      // transporterOptions.host = process.env.SMTP_HOST || "mail.smtp2go.com"
    
      const transporter = nodemailer.createTransport(transporterOptions)
      // const info = await transporter.sendMail(message)
      transporter.sendMail(message, (error, info) => {
        if (error) {
          console.error('Error occurred:', error);
          return;
        }
        console.log('Email sent:', info.response);
      console.log(info.messageId)

        return info

      });
}








