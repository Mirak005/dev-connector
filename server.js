const express = require("express");

const app = express();



app.get("/" , (req , res )=> res.send("API Running  ") )



//Starting the Server 
const PORT = process.env.PORT || 5000

app.listen(PORT , (err)=>{
    if(err) throw console.log(err)
    console.log(`Server is running on PORT ${PORT} ...`)
});
 