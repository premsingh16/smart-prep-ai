const mongoose = require('mongoose');

// the work of this file is to establish connection to the databse(which is mongoDB here)
async function connectToDB() {
    try{
        await mongoose.connect(process.env.MONGO_URI);
        console.log("Connected to Database")
    }
    catch(err){
        console.log(err);
        console.log("unable to connect to Database")
    }    
}
module.exports = connectToDB;