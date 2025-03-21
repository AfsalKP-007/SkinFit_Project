    const User = require("../../models/userSchema"); 
    const nodemailer = require("nodemailer");
    const env = require("dotenv").config();
    const transporter = require("../../config/nodemailer"); // Fixed path
    const crypto = require("crypto");
    const bcrypt = require("bcrypt")
    const { StatusCodes } = require("http-status-codes");



    const loadSignup = async (req, res) => {
        try {
            res.render("signup");
        } catch (error) {
            console.error("Home page not working", error);
            res.status(500).send("Server Error");
        }
    };
    const shopload = async (req, res) => {
        try {
            res.render("shop");
        } catch (error) {
            console.error("Home page not working", error);
            res.status(500).send("Server Error");
        }
    };

    const loadOtp = async (req,res) => {
        try {
            res.render("verifyOtp")
        } catch (error) {
            
        }
    }



    function generateOtp() {
        return Math.floor(100000 + Math.random() * 900000).toString();
    }


    const sendVerificationEmail = async (email, otp) => {
        try {
        const transporter = nodemailer.createTransport({

            service: "gmail",
            port: 587,
            secure: false,
            requireTLS:true,
            auth:{
                user: process.env.NODEMAILER_EMAIL,
                pass: process.env.NODEMAILER_PASSWORD
            }
        })

        const info = await transporter.sendMail({
            from: process.env.NODEMAILER_EMAIL,
            to: email,
            subject: `Your OTP Is ${otp}`,
            html: `<b>Your OTP Is ${otp}</b>`
        })

        return info.accepted.length > 0


        }catch(error){
        console.error("ERROR SENDING EMAIL", error)
        return false
        }
    };


    const signup = async (req, res) => {

        
        try {

            let { name, phone, email, password, cPassword } = req.body;
    
            password = String(req.body.password).trim();
            cPassword = String(req.body.confirmPassword).trim();

            if (password !== cPassword) {
                return res.render("signup", { message: "Password not match"} )
            }

            const findUser = await User.findOne({ email });
            if (findUser) {
                return res.render("signup", { message: "User with this email already exists"} )
            }

            const otp = generateOtp();
    
            const emailSent = await sendVerificationEmail(email, otp);

            if (!emailSent) {
                return res.json("email-error")
            }

            req.session.userOtp = otp;
            req.session.userData = { name, phone, email, password };

            res.json({ success: true, redirect: "/verifyOtp" });

            console.log("OTP Sent", otp)

        } catch (error) {
            console.error("Signup error", error);
            res.redirect("/pageNotFound")
        }
    };


    const pageNotFound = async (req, res) => {
        try {
            res.render("pageNotFound");
        } catch (error) {
            res.redirect("/pageNotFound");
        }
    };

    const loadHomePage = async (req, res) => {
        try {
            return res.render("home", { currentRoute: "/" });
        } catch (error) {
            console.error("Home page not found");
            res.status(500).send("Server Error");
        }
    };


    const securePassword = async(password)=>{
    try {
            const passwordHash = await bcrypt.hash(password,10)
            return passwordHash
        }
        catch(error){
            console.error(error)
    }
    }



    // const verifyOtp = async (req, res) => {
    //     try {
      
    //       const { otp } = req.body
    //       console.log("Received OTP:", otp)
    //       console.log("Session OTP:", req.session.userOtp)
      
    //       if (!otp) {
    //         return res.status(HttpStatus.BAD_REQUEST).json({ success: false, message: "OTP is required!" })
    //       }
      
    //       if (otp === req.session.userOtp) {
    //         const user = req.session.userData
    //         const passwordHash = await securePassword(user.password)
    //         const saveUserData = new User({
    //           username: user.username,
    //           email: user.email,
    //           phone: user.phone,
    //           password: passwordHash
    //         })
      
    //         await saveUserData.save()
    //         req.session.user = saveUserData._id
      
    //         return res.json({ "success": true, "redirectUrl": "/" })
    //       } else {
    //         return res.status(HttpStatus.BAD_REQUEST).json({ "success": false, "message": "Invalid OTP, Please try again" })
    //       }
    //     } catch (error) {
    //       console.error("Error verifying OTP:", error)
    //       return res.status(HttpStatus.INTERNAL_SERVER_ERROR).json({ success: false, message: "An error occurred" })
    //     }
    //   }

    const verifyOtp = async (req, res) => {
        try{
            const {otp} = req.body;
    
            console.log('OTP',otp)
    
            if(otp===req.session.userOtp){
                const user = req.session.userData;
                const passwordHash = await securePassword(user.password);
    
                const saveUserData = new User({
                    name: user.name,
                    email: user.email,
                    phone: user.phone,
                    googleId: user.googleId || null,
                    password: passwordHash
                })
    
                await saveUserData.save();
                req.session.user = saveUserData._id;
    
                res.json({success:true,redirectUrl:'/'})
    
            } else{
                res.status(400).json({success:false,message:'Invalid OTP Please try again'})
            }
    
        } catch (error) {
            console.error('Error verifying OTP',error)
            res.status(500).json({success:false,message:'Server Error'})
        }
    }
    



    module.exports = {
        loadHomePage,
        pageNotFound,
        loadSignup,
        signup,
        verifyOtp,
        loadOtp,
        shopload
    };
