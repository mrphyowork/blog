const express = require("express");
const app = express();

require("dotenv").config();
const port = process.env.PORT;

var cors = require("cors");
// app.use(cors());
app.use(
  cors({
    origin: ["https://blog-olive-three-64.vercel.app"],
    methods: ["GET", "POST", "PUT", "DELETE"],
    credentials: true,
  })
);
app.use(express.json());

const connectDB = require("./config/dbConnection");
connectDB();

const blog = require("./routes/blog");
app.use("/blog", blog);

const user = require("./routes/user");
app.use("/user", user);

app.get("/", (req, res) => {
  res.send("Hello World!!!");
});

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`);
});
