const express = require("express");
const connectDB = require("./config/db");

const app = express();

//Connect DB
connectDB();

//MiddleWare 

app.use(express.json({extented : false }))

app.get("/", (req, res) => res.send("API Running"));
 

//Routes 
app.use("/users", require("./routes/api/users"));
app.use("/auth", require("./routes/api/auth"));
app.use("/profile", require("./routes/api/profile"));
app.use("/posts", require("./routes/api/posts"));

//Starting the Server
const PORT = process.env.PORT || 5000;

app.listen(PORT, err => {
  if (err) throw console.log(err);
  console.log(`Server is running on PORT ${PORT} ...`);
});
