const Review = require("../models/review");
const Listing = require("../models/listing");


//Post Review 
module.exports.CreateReview = async(req, res) => {
  let listing = await Listing.findById(req.params.id);
  let newReview = new Review(req.body.review);
  newReview.Author = req.user._id;


  listing.reviews.push(newReview);

  await newReview.save();
  await listing.save();

  console.log("New Review saved!");

  req.flash("success", "New Review is created");

  res.redirect(`/listings/${listing._id}`);
};


//Delete Review
module.exports.DestroyReview = async (req, res) =>{
    let { id, reviewId } = req.params;
    await Listing.findByIdAndUpdate(id, {$pull: {reviews: reviewId}} );
    await Review.findByIdAndDelete(reviewId);

    req.flash("success", "Review is deleted");
    
    res.redirect(`/listings/${id}`);

  }

