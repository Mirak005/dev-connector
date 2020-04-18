const express = require("express");
const connectDB = require("./config/db");
const path = require("path");

const app = express();

//Connect DB
connectDB();

//MiddleWare

app.use(express.json({ extented: false }));

//Routes
app.use("/users", require("./routes/api/users"));
app.use("/auth", require("./routes/api/auth"));
app.use("/profile", require("./routes/api/profile"));
app.use("/posts", require("./routes/api/posts"));

//Serve Static assets in production
if (process.env.NODE_ENV === "production") {
  //set static folder
  app.use(express.static("client/build"));
  app.get("/", (req, res) => {
    res.sendFile(path.resolve(__dirname, "client", "build", "index.html"));
  });
}

//Starting the Server
const PORT = process.env.PORT || 5000;

app.listen(PORT, err => {
  if (err) throw console.log(err);
  console.log(`Server is running on PORT ${PORT} ...`);
});
