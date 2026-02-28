const express = require("express");
const router = express.Router({ mergeParams: true });
const wrapAsync = require("../utils/wrapAsync.js");
const { reviewSchema} = require("../validators/reviewSchema.js");
const ExpressError = require("../utils/ExpressError.js");
const Review = require("../models/review.js")  //for requiring models[schema] from review.js
const Listing = require("../models/listing.js")  //for requiring models[schema] from listing.js
const { validateReview, isLoggedIn, isReviewAuthor } = require("../middleware.js");
const ReviewController = require("../controllers/review.js");


//Reviews
//Post Review Route
router.post("/", 
  validateReview, 
  isLoggedIn,
  wrapAsync(ReviewController.CreateReview));


// Delete Review Route
router.delete( 
  '/:reviewId',
  isLoggedIn,
  isReviewAuthor,
  wrapAsync(ReviewController.DestroyReview)
);


  module.exports = router