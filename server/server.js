import express from "express";
import mongoose from "mongoose";
import cors from "cors";
import { readdirSync } from "fs";

const morgan = require("morgan");
require("dotenv").config();

const app = express();

//db connection
mongoose
  .connect(process.env.DATABASE, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => console.log("DB SUCCESSFULY CONNECTED!"))
  .catch((err) => console.log("DB CONNECTION ERROR =>", err));

//middlewares
app.use(express.json({ limit: "2mb" }));
app.use(express.urlencoded({ extended: true }));
app.use(
  cors({
    origin: [process.env.CLIENT_URL],
  })
);

//autoload routes
// readdirSync("/routes").map((route) => {
//   app.use("/api", require(`/routes/${route}`));
// });
app.use("/api", require("./routes/auth.js"));
app.use("/api", require("./routes/post.js"));

//listening...
const port = process.env.PORT || 8000;
app.listen(port, () => console.log(`SERVER STARTED ON PORT ${port}!`));
