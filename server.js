const express = require("express");
const cors = require("cors");
const userRoutes = require("./routes/userRoutes");
const exerciseRoutes = require("./routes/exerciseRoutes");
const { errorHandler } = require("./middleware/errorHandler");
const user = require("./models/userModel");
const connectDb = require("./config/dbConnection");
require("dotenv").config();
connectDb();
const app = express();

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use(express.static("public"));
app.get("/", (req, res) => {
  res.sendFile(__dirname + "/views/index.html");
});
app.use("/api/users", userRoutes, exerciseRoutes);
app.use(errorHandler);

const listener = app.listen(process.env.PORT || 3000, () => {
  console.log("Your app is listening on port " + listener.address().port);
});
