import express from "express";
import morgan from "morgan";
import cors from "cors";
import dotenv from "dotenv";
import { DATABASE_CLOUD } from "./config/config.js";
import mongoose from "mongoose";
import cron from "node-cron";
import axios from "axios";
const app = express();
// const port = 2020;
dotenv.config()
// DB connection
mongoose.set("strictQuery", false);
console.log(DATABASE_CLOUD)
mongoose
  .connect(DATABASE_CLOUD || "mongodb+srv://mhussnainpgc11:2161028@cluster0.qsqqypv.mongodb.net/Ziaja" , {
    // useNewUrlParser: true,
    // useUnifiedTopology: true,
  })
  .then((con) => console.log(`DB conneted with ${con.connection.host}`))
  .catch((err) => console.log(`connection failed ..${err.message}`));
  
// apply middlwares
app.use(express.json());
app.use(morgan("dev"));
app.use(cors());
const port = process.env.PORT ||  2020
// import & pass in route middleware
import authRoute from "./routes/authRoute.js";
app.use("/api/v1", authRoute);

// cron.schedule("* * * * *", async () => {
//   console.log("Sending automatic investment request...");
//   try {
//     // Sending a POST request to '/investment' route
//     const response = await axios.get(
//       "http://localhost:2020/api/v1/updateinvestment",
//       {
//         headers: {
//           "Content-Type": "application/json",
//         },
//       }
//     );
//     //     console.log(response.data); // Log the response data
//   } catch (error) {
//     console.error("Error:", error);
//   }
// });

app.listen(port, () => {
  console.log(`Express server is running on http://localhost:${port}`);
});
