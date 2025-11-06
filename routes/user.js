const express = require("express");
const router = express.Router();
const {
  userRegister,
  userLogin,
  userProfile,
  forgotPassword,
  resetPassword,
} = require("../controllers/userController");

const validateToken = require("../middleware/validateJwtToken");

router.post("/register", userRegister);

router.post("/login", userLogin);

router.get("/profile", validateToken, userProfile);

router.post("/forgot-password", forgotPassword);

router.post("/reset-password/:token", resetPassword);

module.exports = router;
