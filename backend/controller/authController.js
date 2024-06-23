const userModel = require("../model/userSchema");



const emailValidator = require("email-validator");

const bcrypt = require('bcrypt');

const signup = async (req, res) =>{
     

     const {name, email, password, confirmPassword} = req.body;
     console.log(name, email, password, confirmPassword);
     try {
          if(!name || !email || !password || !confirmPassword) {
               return res.status(400).json({
                    success: false,
                    message: "every field is required"
               })
          }

          var validEmail = emailValidator.validate(email);

          if(!validEmail) {
               return res.status(400).json({
                    success: false,
                    message: "please provide valid email"
               })
          }
          
          if(password !== confirmPassword) {
               return res.status(400).json({
                    success: false,
                    message: "password & confirm password not match",
               })
          }


          const userInfo = userModel(req.body);
          const result = await userInfo.save();

          return res.status(200).json({
               success: true,
               data: result
          })
       
     }catch(e) {
          if(e.code === 11000) {
               return res.status(400).json({
                    success: false,
                    message: "Account already exists"
               });
               
          }
          return res.status(400).json({
               success: false,
               message: e.message
          })
          

     }
          
    
}

const signin =  async (req, res) => {

     const {email, password} = req.body;

     if(!email || !password) {
          return res.status(400).json({
               success: false,
               message: "every field is required"
          })
     }

     try {
          const user = await userModel
               .findOne({
                    email
               })
               .select('+password');
          if(!user || !await bcrypt.compare(password, user.password)) {
               res.status(400).json({
                    success: false,
                    message: "invalid credentials"
               })
          }   
          
          const token = user.jwtToken();
          user.password = undefined;

          const cookieOptions = {
               maxAge: 24 * 60 * 60 * 1000,
               httpOnly: true
          };

          res.cookie("token", token, cookieOptions);

          res.status(200).json({
               success: true,
               data: user
          })

     }catch(e) {
          res.status(400).json({
               success: false,
               message: e.message
          })

     }

}

const getUser = async (req, res) => {
     const userId = req.user.id;

     try {
          const user = await userModel.findById(userId);
          return res.status(200).json({
               success: true,
               data: user
          })
     }catch(e) {
          return res.status(400).json({
               success: false,
               message: e.message
          })
     }

}

const logout = (req, res) => {

     try {

          const cookieOptions = {
               expires: new Date(),
               httpOnly: true,
          }

          res.cookie("token",null,cookieOptions);
          res.status(200).json({
               success: true,
               message: "Logged out!"
          })
     }catch (e) {
          return res.status(400).json({
               success: false,
               message: e.message
          })
     }

}

module.exports = {
     signup,
     signin,
     getUser,
     logout
}


