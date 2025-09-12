const express = require("express");
const fileupload = require("express-fileupload");
const dotenv = require("dotenv");
const cors = require("cors");
const mongoose = require("mongoose");
const http = require("http");

dotenv.config({ DOTENV_LOG: false });
const authRouter = require("./src/router/authRouter");
const courseRouter = require("./src/router/corseRouter");

const app = express();
const server = http.createServer(app);

const PORT = process.env.PORT || 4001;
const MONGO_URL = process.env.MONGODB_URI;

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(fileupload({ useTempFiles: true }));

// ✅ Routers (keyin ulaysiz)
app.use("/api/auth", authRouter);
app.use("/api/courses", courseRouter);

mongoose
  .connect(MONGO_URL, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => {
    console.log(" MongoDB connected");
    server.listen(PORT, () => {
      console.log(` Server running on port ${PORT}`);
    });
  })
  .catch((err) => {
    console.error(" MongoDB connection error:", err.message);
    process.exit(1);
  });

process.on("SIGINT", async () => {
  console.log(" Gracefully shutting down...");
  await mongoose.connection.close();
  process.exit(0);
});
