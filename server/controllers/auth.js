import User from "../models/user";
import { hashPassword, comparePassword } from "../helpers/auth";
import jwt from "jsonwebtoken";
import nanoid from "nanoid";

export const register = async (req, res) => {
  // console.log("User registered =>", req.body);
  const { name, email, password, secret } = req.body;

  // validation
  if (!name)
    return res.json({
      error: "Name is required",
    });

  if (!password || password.length < 6)
    return res.json({
      error: "Password is required and should be at least 6 characters long.",
    });

  if (!secret)
    return res.json({
      error: "Answer your security question",
    });

  const exist = await User.findOne({ email });
  if (exist)
    return res.json({
      error: "Email already taken!",
    });

  //hash password
  const hashedPassword = await hashPassword(password);

  const user = new User({
    name,
    email,
    password: hashedPassword,
    secret,
    username: nanoid(8),
  });
  try {
    await user.save();
    // console.log("REGISTERED USER =>", user);
    return res.json({
      ok: true,
    });
  } catch (err) {
    console.log("REGISTRATION FAILED =>", err);
    return res.json({
      error: "Registration failed. Try again :(",
    });
  }
};

export const login = async (req, res) => {
  // console.log(req.body);
  try {
    // check if user is in db
    const { email, password } = req.body;
    const user = await User.findOne({ email });
    if (!user)
      return res.json({
        error: "No user found!",
      });

    // check password
    const match = await comparePassword(password, user.password);
    if (!match)
      return res.json({
        error: "Wrong Password",
      });

    // create signed token
    const token = jwt.sign({ _id: user._id }, process.env.JWT_SECRET, {
      expiresIn: "7d",
    });
    user.password = undefined;
    user.secret = undefined;

    // send response with jwt
    return res.json({
      token,
      user,
    });
  } catch (err) {
    console.log("LOGIN FAILED =>", err);
    return res.json({
      error: "Error in login",
    });
  }
};

export const currentUser = async (req, res) => {
  // console.log(req.auth);
  try {
    const user = await User.findById(req.auth._id);
    return res.json({
      ok: true,
    });
  } catch (err) {
    console.log(err);
    res.sendStatus(400);
  }
};

export const forgotPassword = async (req, res) => {
  // console.log(req.body);
  const { email, newPassword, secret } = req.body;
  if (!newPassword || newPassword.length < 6) {
    return res.json({
      error:
        "New password is required and should be at least 6 characters long.",
    });
  }
  if (!secret) {
    return res.json({
      error: "Please answer the security question",
    });
  }

  // Better option is to send auth token to email
  const user = await User.findOne({ email, secret });
  console.log(user);
  if (!user) {
    return res.json({
      error: "User was not found!",
    });
  }

  try {
    const hashed = await hashPassword(newPassword);
    await User.findByIdAndUpdate(user._id, { password: hashed });
    return res.json({
      success: "Password successfully reset",
      ok: true,
    });
  } catch (err) {
    return res.json({
      error: "Something went wrong. Try again",
    });
  }
};

export const profileUpdate = async (req, res) => {
  try {
    const data = {};
    if (req.body.username) {
      data.username = req.body.username;
    }
    if (req.body.about) {
      data.about = req.body.about;
    }
    if (req.body.name) {
      data.name = req.body.name;
    }
    if (req.body.password) {
      if (req.body.password.length < 6) {
        return res.json({
          error: "Password should be at least 6 characters long.",
        });
      } else {
        data.password = await hashPassword(req.body.password);
      }
    }
    if (req.body.secret) {
      data.secret = req.body.secret;
    }
    if (req.body.image) {
      data.image = req.body.image;
    }

    let user = await User.findByIdAndUpdate(req.auth._id, data, { new: true });
    user.password = undefined;
    user.secret = undefined;
    return res.json(user);
  } catch (err) {
    console.log(err);
    if (err.code == 11000)
      return res.json({
        error: "Username Taken",
      });
  }
};

export const findPeople = async (req, res) => {
  try {
    const user = await User.findById(req.auth._id);
    //user following
    let following = user.following;
    following.push(user._id);
    const people = await User.find({ _id: { $nin: following } })
      .select("-password -secret")
      .limit(10);
    res.json(people);
  } catch (err) {
    console.log(err);
  }
};

export const addFollower = async (req, res, next) => {
  try {
    const user = await User.findByIdAndUpdate(req.body._id, {
      $addToSet: { followers: req.auth._id },
    });
    next();
  } catch (err) {
    console.log(err);
  }
};

export const followUser = async (req, res) => {
  try {
    const user = await User.findByIdAndUpdate(
      req.auth._id,
      {
        $addToSet: { following: req.body._id },
      },
      { new: true }
    ).select("-password -secret");
    res.json(user);
  } catch (err) {
    console.log(err);
  }
};

export const userFollowing = async (req, res) => {
  try {
    const user = await User.findById(req.auth._id);
    const following = await User.find({ _id: user.following }).limit(100);
    res.json(following);
  } catch (err) {
    console.log(err);
  }
};

export const removeFollower = async (req, res, next) => {
  try {
    const user = await User.findByIdAndUpdate(req.body._id, {
      $pull: { followers: req.auth._id },
    });
    next();
  } catch (err) {
    console.log(err);
  }
};

export const unfollowUser = async (req, res) => {
  try {
    const user = await User.findByIdAndUpdate(
      req.auth._id,
      { $pull: { following: req.body._id } },
      { new: true }
    );
    res.json(user);
  } catch (err) {
    console.log(err);
  }
};

export const searchUser = async (req, res) => {
  const { query } = req.params;
  if (!query) return;
  try {
    const user = await User.find({
      $or: [
        { name: { $regex: query, $options: "i" } }, // i = case insensetive
        { username: { $regex: query, $options: "i" } },
      ],
    }).select("-secret -password");
    res.json(user);
  } catch (err) {
    console.log(err);
  }
};

export const getUser = async (req, res) => {
  try {
    const user = await User.findOne({ username: req.params.username }).select(
      "-secret -password"
    );
    res.json(user);
  } catch (err) {
    console.log(err);
  }
};
