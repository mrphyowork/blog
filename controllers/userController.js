var jwt = require("jsonwebtoken");
const User = require("../models/userModel");
const bcrypt = require("bcryptjs");

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

// public
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

module.exports = { userRegister, userLogin, userProfile };
