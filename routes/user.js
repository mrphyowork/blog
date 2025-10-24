const express = require("express");
const router = express.Router();
const {
  userRegister,
  userLogin,
  userProfile,
} = require("../controllers/userController");

const validateToken = require("../middleware/validateJwtToken");

router.post("/register", userRegister);

router.post("/login", userLogin);

router.get("/profile", userProfile);

module.exports = router;
