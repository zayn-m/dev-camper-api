const express = require("express");
const router = express.Router();

const authControllers = require("../controllers/auth");

router.route("/register").post(authControllers.register);
router.route("/login").post(authControllers.login);
router.route("/forgotpassword").post(authControllers.forgotPassword);
router.route("/resetpassword/:resetToken").put(authControllers.resetPassword);

module.exports = router;
