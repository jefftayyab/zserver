import SES from "aws-sdk/clients/ses.js";
import S3 from "aws-sdk/clients/s3.js";
import dotenv from 'dotenv'
dotenv.config()


export const smtpHost = process.env.SMTPHOST
export const smtpPort = process.env.SMTP_PORT
export const smtpUser = process.env.SMTP_USER
export const smtpPass = process.env.SMTP_PASS



export const DATABASE_LOCAL = process.env.DATABASE_LOCAL


export const DATABASE_CLOUD = process.env.MONGODB_ATLAS
export const AWS_ACCESS_KEY_ID =  process.env.AWS_ACCESS_KEY_ID


export const AWS_SECRET_ACCESS_KEY = process.env.AWS_SECRET_ACCESS_KEY

export const EMAIL_FROM = process.env.EMAIL_FROM
export const EMAIL_FROM2 = process.env.EMAIL_FROM2
export const REPLY_TO = process.env.REPLY_TO

export const AWS_REGION=  process.env.AWS_REGION
export const AWS_API_VERSION=  process.env.AWS_API_VERSION

const awsConfig = {
    accessKeyId: AWS_ACCESS_KEY_ID,
    secretAccessKey: AWS_SECRET_ACCESS_KEY,
    region: AWS_REGION,
    apiVersion: AWS_API_VERSION
}

export const AWSSES = new SES(awsConfig);
export const AWSS3 = new S3(awsConfig);


export const CLIENT_URL = process.env.CLIENT_URL
export const JWT_SECRET_KEY = process.env.JWT_SECRET_KEY

//// twilio 

export const TWILIO_ACCOUNT_SID = process.env.TWILIO_ACCOUNT_SID
export const TWILIO_AUTH_TOKEN = process.env.TWILIO_AUTH_TOKEN

// export the Twilio client so that it can be used elsewhere in our code
// export const client = require('twilio')(TW_ACCOUNT_SID, TW_AUTH_TOKEN)