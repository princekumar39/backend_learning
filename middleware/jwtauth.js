const JWT = require('jsonwebtoken');

//middleware jab v kro too next jarur karna takki ek process sai dusre process ja ske.
const jwtAuth = (req,res,next)=>{
    const token = (req.cookies && req.cookies.token)  || null;  // this code signify that if user logged i then there should be a token paresent in cookie so catch cookie then token in cookie. if token not came then default set "null"


    //if token not found then run below code and terminate all other code of this function
    if( !token){
      res.status(400).json({
        Success:false,
        message:'none authorized.'
      })  
    }
     
    //if token found then run below code
    try{
          const payload = JWT.verify(token,process.env.SECRET);  // jo token aaya hai usko verify kro by using "JWT.Verify()"method sai ----- isme two parameter hai 1)kisko verify krna hai  2) kiss basis par krna hai
          req.user = {id : payload.id , email:payload.email}; // agr verify ho jata hai too send kr doo data next() mai 
    }
    catch(err){
            res.status(400).json({
                Success:false,
                message:err.message
            })
    }
    next();
}

module.exports = jwtAuth;