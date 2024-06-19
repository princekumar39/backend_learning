// In controller there should be 3 parameter 1)request 2)response 3)Next ---->(next means what you want to perform nextly)
const userModel = require('../model/userSchema');
const email_validator = require('email-validator');

// for using bcrypt dependecies, we have to catch it.
const bcrypt = require('bcrypt');

// Controller code for Singup
const signup = async (req,res,next)=>{
    const {name,email,password,confirmPassword} =  req.body;  // req.body is showing from where you will get the data.
    console.log(name,email,password,confirmPassword);

    // agr uppar ka sara data user daal k submit kiya, too below code usko database mai send krega .
    //checking all the required data is coming or not
    if(!name || !email || !password || !confirmPassword){
        return res.status(400).json({
            sucess:false,
            message:"Every field is required"
        });
    }
   
    // below code is written for checking the validation of the email given by the user.
    const validEmail = email_validator.validate(email);  // it is used to check coming email is right or wrong(means valid or not).
    if(!validEmail){  //This code is used to throw an error for email validation.result will be either true or false.
        return res.status(400).json({
            sucess:false,
            message:"Email address is not valid"
        });
    }

    //Checking password is equal to confirm password or not 
    if(password !== confirmPassword){
        return res.status(400).json({
            sucess:false,
            message:"password and confirm password is not same."
        });
    }


    try{

        // A user model is the collection and categorization of personal data associated with a specific user.
        // A user model is a (data) structure that is used to capture certain characteristics about an individual user, and a user profile is the actual representation in a given user model
        const userInfo = userModel(req.body);  // req.body sai jo data aaya usko usermodel(it is structure of userSchema) mai daal do.
        const result = await userInfo.save();  //userschmea mai daalne k baad save kr doo database mai by using "variable_name.save".
    
        return res.status(200).json({
        success: true,
        data:result
       });
    }

    catch(err){
        
        if(err.code === 11000){
            return res.status(400).json({
                success:False,
                message:"Account already exist by provided email id.",
    
            })
        }
        // this uppar code is functinality given by mongoose that if same entry is done by user then mongoose generate a code i.e 11000 which show data entered by user is same , so that you can send a precise error message to user

        return res.status(400).json({
            success:False,
            message:err.message,

        })
    }
    
}


// Controller code for Signin
const signin = async (req,res)=>{
        // 1) User singin krne k liye email or password dalega.
        const {email,password} = req.body;
        // the below code is using for checking the email and password is blank or not 
        if(!email || !password){
            return res.status(400).json({
                sucess:false,
                message:"Every field is required"
            });
        }
        

 try{
            // the below code i am writting for checking the given email by user is existing in the database or not.
            const user = await userModel.findOne({    // UserModel mai sara data present hai too usme ".findone()" laga kar check kar lenge exist kar rha hai ya nhi 
                    email
            })
            .select('+password');
            
            // agr password or email exist karta hai too check kro user password diya woo or saved password same hai ya nhi ?


        //if(!user || user.password !== password){   // this user.password is in incrypt form which had done by code in model inside database. so when user will put password in string form and saved password is incrypt form will not get match, even after user is providing right password.
        //This (just uppar) code will not work. we have to compare password in incrypt form (beacause incrypt will not get converted into dincrypt form ).
        // soo we will use a method given by bcrypt which is " bcrypt.compare(1st i/p , 2nd i/p)" ----> 1st i/p (jisko incrypt kar k compare karna hai woo yha likho EX:- jo user password dala signin k liye )  , 2nd i/p(jo already incrypt hai or saved hai , jiss sai compare tumhe karna hai )
            if( !user || !(await bcrypt.compare ( password , user.password) ) ){
                return res.status(400).json({
                    sucess:false,
                    message:"password doesn't match!"
                });
            }



        // Now if everything is right here , and user is singedin soo after entering in website user will perform various task .
        //soo at every step we have to check the user is valid or not for that access and activity and for this we cant prefer to send this much code 
        //soo for avoiding the sent as much code we will geenrate the " token (and store this token into cookie)" for varification,now this token will get pass everywhere automatic for verification
        // we will use JWT token.
        const token = user.jwtToken();
        user.password = undefined;  //  password should be secret thats why we had made it undefined so that it will not be visible to user also with thier data.
        // to store in cookie
        const cookieOption = {   // cookie option is basically the characteristics of the token like expiry_date , valid_date etc.
            maxAge: 24*60*60*1000,
            httpOnly:true
        };
        res.cookie("token",token,cookieOption);
        res.status(200).json({
            success:true,
            data:user
        })
    }

       catch(err){
        return res.status(400).json({
            sucess:false,
            message:err.message
        });
       }
       
}



// Controller code for providing user data
const getUser = async (res,req,Next)=>{
       const userId= req.user.id;  // if user is logedin so we need there id for verification after that we will show the users information
       try{
           const user = await userModel.findById(userId);
           res.status(200).json({
            success:true,
            data:user
           })
       }
       catch(err){
        return res.status(400).json({
            sucess:false,
            message:err.message
        });
       }
}



// Controller code for LOgout
const logout = (res,req)=>{
    // agr cookie ko hii delete kar de  too user logout ho jayega .
        try{
           const cookieOption = {
            expires:new Date(),
            httpOnly:true
           }

           res.cookie("token",null,cookieOption);
           res.status(200).json({
            success:true,
            message:"Logged Out"
           })
        }
        catch(err){
            return res.status(400).json({
                sucess:false,
                message:err.message
            });
        }
}



module.exports = {signup,signin,getUser,logout};