const express = require("express");
const router = express.Router();

const authControllers = require("../controllers/auth");
const { protect } = require("../middleware/auth");

router.route("/register").post(authControllers.register);
router.route("/login").post(authControllers.login);
router.route("/logout").get(authControllers.logout);
router.route("/me").get(protect, authControllers.getMe);
router.route("/forgotpassword").post(authControllers.forgotPassword);
router.route("/resetpassword/:resetToken").put(authControllers.resetPassword);
router.route("/updatedetails").put(protect, authControllers.updateDetails);
router.route("/updatepassword").put(protect, authControllers.updatePassword);

module.exports = router;
