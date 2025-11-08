var jwt = require("jsonwebtoken");
const User = require("../models/userModel");
const bcrypt = require("bcryptjs");

const crypto = require("crypto");
const { sendEmail } = require("../utils/sendEmail");

// User Register
const userRegister = async (req, res) => {
  try {
    const { username, email, password } = req.body;
    if (!username || !email || !password) {
      return res.status(400).json({ message: "All fields are required!" });
    }

    const userExist = await User.findOne({ email });
    if (userExist) {
      return res.status(400).json({ message: "User already registered!" });
    }

    //encrypt
    const salt = bcrypt.genSaltSync(10);
    console.log(password);
    console.log(salt);

    const hashedPassword = bcrypt.hashSync(password, salt);
    console.log(hashedPassword);

    const user = await User.create({
      username,
      email,
      password: hashedPassword,
    });

    if (!user) {
      return res.status(400).json({ message: "User data is not valid!" });
    }
    return res.status(201).json(user);
  } catch (err) {
    return res.status(500).json({ message: err.message });
  }
  //   res.json({ message: "Register the user" });
};

// User Login
const userLogin = async (req, res) => {
  try {
    const { email, password } = req.body;
    if (!email || !password) {
      return res.status(400).json({ message: "All fields are required!" });
    }

    const user = await User.findOne({ email });
    if (user && bcrypt.compareSync(password, user.password)) {
      const accessToken = jwt.sign(
        {
          user: {
            username: user.username,
            email: user.email,
            id: user.id,
          },
        },
        process.env.JWT_SECRET
        // { expiresIn: "1h" }
      );
      return res.status(200).json({ accessToken });
    } else {
      return res
        .status(404)
        .json({ message: "username or password incorrect!" });
    }
  } catch (err) {
    return res.status(500).json({ message: err.message });
  }
};

// private
const userProfile = async (req, res) => {
  res.json({ message: "Current user info", data: req.user });
};

//Forgot Password
const forgotPassword = async (req, res) => {
  try {
    const { email } = req.body;
    const user = await User.findOne({ email });

    if (!user) return res.status(404).json({ message: "User not found" });

    // Generate token
    const resetToken = crypto.randomBytes(20).toString("hex");
    const resetTokenExpire = Date.now() + 15 * 60 * 1000; // 15 mins

    // Save to DB
    user.resetToken = resetToken;
    user.resetTokenExpire = resetTokenExpire;
    await user.save();

    // Send email
    const resetLink = `${process.env.BASE_URL}/reset-password/${resetToken}`;
    const html = `
      <h3>Password Reset Request</h3>
      <p>Click the link below to reset your password:</p>
      <a href="${resetLink}">${resetLink}</a>
      <p>This link will expire in 15 minutes.</p>
    `;

    await sendEmail(user.email, "Password Reset", html);

    res.json({ message: "Password reset link sent to your email" });
  } catch (error) {
    res.status(500).json({ message: "Email sending failed", error });
  }
};

// Reset Password
const resetPassword = async (req, res) => {
  try {
    const { token } = req.params;
    const { password } = req.body;
    // Validate that newPassword is provided
    if (!password) {
      return res.status(400).json({ message: "New password is required" });
    }
    const user = await User.findOne({
      resetToken: token,
      resetTokenExpire: { $gt: Date.now() },
    });
    if (!user) {
      return res
        .status(400)
        .json({ message: "Token is invalid or has expired" });
    }
    // Hash the new password
    const hashedPassword = await bcrypt.hashSync(
      password,
      bcrypt.genSaltSync(10)
    );

    // Update user with new password and clear reset token fields
    user.password = hashedPassword;
    user.resetToken = null;
    user.resetTokenExpire = null;
    await user.save();
    res.json({ message: "Password has been reset successfully" });
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

module.exports = {
  userRegister,
  userLogin,
  userProfile,
  forgotPassword,
  resetPassword,
};
