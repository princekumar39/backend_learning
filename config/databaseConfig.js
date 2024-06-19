const mongoose  = require('mongoose');

const mongoose_URL = process.env.mongoose_URL || "mongodb://localhost:27017/userSingin" ;

const databaseconnect = ()=>{
    mongoose.connect(mongoose_URL)    // mongoose.connect helps you to connect the database.
    .then((conn)=>{
        console.log(`Connected to DB:${conn.connection.host}`);
    })
    .catch((err)=>{
        console.log(err.message);
    })

}

module.exports = databaseconnect;
