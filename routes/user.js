const express = require("express");
const review = require("../models/review");
const router = express.Router();
const User = require("../models/user.js");
const wrapAsync = require("../utils/wrapAsync");
const passport = require("passport");
const { saveRedirectUrl } = require("../middleware.js");
const controllersUser = require("../controllers/user.js");

router
  .route("/signup")
  .get(controllersUser.renderSignupForm)
  .post(wrapAsync(controllersUser.signup));

router
  .route("/login")
  .get(controllersUser.renderLoginForm)
  .post(
    saveRedirectUrl,
    passport.authenticate("local", {
      failureRedirect: "/login",
      failureFlash: true,
    }),
    controllersUser.postlogin
  );



router.get("/logout", controllersUser.logOut);

module.exports = router;
