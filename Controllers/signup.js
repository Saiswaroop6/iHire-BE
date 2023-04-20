import bycryptjs from "bcryptjs";
import User from "../models/User.js";
import jwt from "jsonwebtoken";
import createError from "../utils/createError.js";

export const register = async (req, res, next) => {
  if (!req.body.name || !req.body.email || !req.body.ssn) {
    return next(
      createError({
        status: 400,
        message: "Name, ssn and email is required.",
      })
    );
  }

  try {
    // const salt = await bycryptjs.genSalt(10);
    // const hashedPassword = await bycryptjs.hash(req.body.password, salt);

    const newUser = new User({
      name: req.body.name,
      email: req.body.email,
      ssn: req.body.ssn,
      // password: hashedPassword,
    });
    await newUser.save();
    return res.status(201).json("new user created");
  } catch (err) {
    console.log(err);
    return res.json("server error");
  }
};

export const login = async (req, res, next) => {
  if (!req.body.email || !req.body.password) {
    return next(
      createError({
        status: 400,
        message: "Name and password is required.",
      })
    );
  }

  try {
    const user = await User.findOne({ email: req.body.email }).select(
      "name email password"
    );
    if (!user) {
      return next(createError({ status: 404, message: "No User Found" }));
    }
    const isPasswordCorrect = await bycryptjs.compare(
      req.body.password,
      user.password
    );
    if (!isPasswordCorrect) {
      return next(
        createError({ status: 400, message: "Password is incorrect" })
      );
    }
    const payload = {
      id: user._id,
      name: user.name,
    };
    const token = jwt.sign(payload, process.env.JWT_TOKEN, {
      expiresIn: "1d",
    });
    return res
      .cookie("access_token", token, {
        httpOnly: true,
      })
      .status(200)
      .json({ message: "login success" });
  } catch (err) {
    console.log(err);
    return next(err);
  }
};

export const logout = (req, res) => {
  res.clearCookie("access_token");
  return res.status(200).json({ message: "logout success" });
};

export const isLoggedIn = (req, res) => {
  const token = req.cookies.access_token;
  if (!token) {
    return res.json(false);
  }
  return jwt.verify(token, process.env.JWT_TOKEN, (err) => {
    if (err) {
      return res.json(false);
    } else {
      return res.json(true);
    }
  });
};
