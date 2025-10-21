const express = require("express");
const app = express();

require("dotenv").config();
const port = process.env.PORT;

var cors = require("cors");
app.use(cors());
app.use(express.json());

const validateToken = require("./middleware/validateJwtToken");

const blog = require("./routes/blog");
app.use("/blog", validateToken, blog);

const user = require("./routes/user");
app.use("/user", user);

const connectDB = require("./config/dbConnection");
connectDB();

app.get("/", (req, res) => {
  res.send("Hello World!!");
});

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`);
});
