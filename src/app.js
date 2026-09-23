const express = require("express");
const { connectDB } = require("./config/database.js");
const cookieParser = require("cookie-parser");
const authRouter = require("./routes/auth.js");
const profileRouter = require("./routes/profile.js");
const requestRouter = require("./routes/request.js");
const userRouter = require("./routes/user.js");
const cors = require("cors");

const app = express();
app.use(express.json());
app.use(cookieParser());
app.use(cors({
  origin: "http://localhost:5173",
  credentials: true
}))

app.use("/", authRouter);
app.use("/", profileRouter);
app.use("/", requestRouter);
app.use("/", userRouter)

connectDB()
  .then((data) => {
    console.log("Database connection establisheds");
    app.listen(7777, () => {
      console.log("Server started successfylly on Port 7777");
    })
  })
  .catch((err) => console.error("Database connection failed"));
