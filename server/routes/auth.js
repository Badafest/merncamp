import express from "express";
const router = express.Router();

//middlewares
import { requireSignIn } from "../middlewares";

//controllers
import {
  register,
  login,
  currentUser,
  forgotPassword,
  profileUpdate,
  findPeople,
  addFollower,
  followUser,
  userFollowing,
  removeFollower,
  unfollowUser,
  searchUser,
  getUser,
} from "../controllers/auth";

router.get("/current-user", requireSignIn, currentUser);
router.post("/register", register);
router.post("/login", login);
router.post("/forgot-password", forgotPassword);

router.put("/profile-update", requireSignIn, profileUpdate);
router.get("/find-people", requireSignIn, findPeople);

router.put("/user-follow", requireSignIn, addFollower, followUser);
router.put("/user-unfollow", requireSignIn, removeFollower, unfollowUser);
router.get("/user-following", requireSignIn, userFollowing);

router.get("/search-user/:query", searchUser);
router.get("/user/:username", getUser);

module.exports = router;
