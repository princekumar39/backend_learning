const mongoose = require('mongoose');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');
const {Schema} = mongoose;

const userSchema = new Schema({

    name:{
        type:String,
        require:[true,"name must required"],
        maxlength:(50,"max_length should be less than 50"),
        trim:true, // if someone has given spaces at start and last then remove that.
     },

     email:{
        type:String,
        require:[true,"email must required"],
        unique:[true,"already registerd"],
        lowercase:true,
     },

     password:{
        type:String,

     },

     forgotPasswardToken:{
        type:String,
     },

     forgotPasswardExpiry:{
        type:Date,
     }

},

{
    timestamps:true    // this "timestamps" will show on which time each data get entered. 
}

);

// saving the password as same as user has provided you is not good thing for security purspose 
// that is why we should incrypt that password 
userSchema.pre('save',async function(next){  // bcrypt provides you ".pre()" function which takes 2 input 1)what operation you performed ex:- save 2) what will you want write that function code.   Therefor when "save" operation will performed that run the function here firstly .
   if(!this.isModified('password')){
      return next();
   }
   this.password = await bcrypt.hash(this.password,10);  // by using bcrypt.hash change into incrypted form with 10 character
   return next();
});


//mongoose provide you features to generate your method by using ".method"
userSchema.method={
   jwtToken(){
      return jwt.sign(   // this jwt has three parts declare them as object
          {id:this._id,email:this.email},
          process.env.SECRET,
          {expiresIn:'24h'}  // token will expire after 24 hrs
      )   // for generating this use dependency jsonWenToken  as require
   }
}
module.exports = mongoose.model( 'user' , userSchema ); // database mai save hoga user sai jiska schema userSchema k brarabar hoga.