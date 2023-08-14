const User = require("./app/models/user");
const mongoose = require("mongoose");
const config = require("./config/db"); //get your mongoose string
//create your array
const createUser = User({
    givenName:"RootUser",
    email: "rootuser@gmail.com",
    address:"Yangon",
    password: "Root123"
  })

//connect mongoose
console.log(config.db)
mongoose
  .connect(String(config.db), { useNewUrlParser: true })
  .catch(err => {
    console.log(err);
    process.exit(1);
  })
  .then(() => {
    console.log("connected to db in development environment");
  });
//save your data. this is an async operation
//after you make sure you seeded all the products, disconnect automatically

createUser.save((err,result)=> {
      console.log(result);
      err && console.log(err)
      console.log("admin create DONE!");
      mongoose.disconnect();
    
  })
