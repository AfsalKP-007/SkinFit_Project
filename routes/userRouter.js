const express = require("express");
const router = express.Router();
const userController = require("../controllers/user/userController");


router.get("/pageNotFound", userController.pageNotFound);

router.get("/", userController.loadHomePage);

router.get("/signup", userController.loadSignup);
router.get("/shop", userController.shopload);
router.post("/signup",userController.signup)

router.get("/verifyOtp",userController.loadOtp)

router.post("/verify-otp",userController.verifyOtp)

// app.get("/verifyOtp", (req, res) => {
//     res.render("user/verifyOtp"); // Render verifyOtp.ejs from views/user
// });




module.exports = router;

