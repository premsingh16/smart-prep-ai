const mongoose = require('mongoose');


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
