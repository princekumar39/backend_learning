const express = require('express');
const app = express();  // creating an instance

// Requiring the CORS
const cors = require('cors');
app.use(cors({
    origin: process.env.CLIENT_URL,
    credentials:true
}
));

//database connection catching 
const databaseconnect = require('./config/databaseConfig');
databaseconnect();


// cosuming router.
const authRouter = require('./Routes/authRoutes');
app.use(express.json()); // any data which will come then show that it in json code/form.

//cookie parser-->it helps to convert serialized data of cookie in json formate beacause user and browser nly understand the json formate.
const cookie_parser = require('cookie-parser');
app.use(cookie_parser());

app.use('/api/auth/',authRouter); //  /api/auth/ ----> this is the prefix of path if someone write /api/auth/signup then the will go directly on the authRouter 
app.use('/' , (req , res )=>{
     res.status(200).json({data:'JWTauth server -updated truly'});
});

module.exports = app;