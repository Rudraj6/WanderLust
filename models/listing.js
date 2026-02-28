const mongoose = require("mongoose");
const Schema = mongoose.Schema;


const listingSchema = new Schema({
  title: {
    type: String,
    required: true,
  },
  description: String,
  image: {
    filename: String,
    url: {
      type: String,
      default: "https://images.unsplash.com/photo-1591154669695-5f2a8d20c089...",
      set: (v) => {
        if (typeof v !== "string" || v.trim() === "") {
          return "https://images.unsplash.com/photo-1591154669695-5f2a8d20c089...";
        }
        return v;
      }
    }
  },
  price: Number,
  location: String,
  country: String,
  reviews: [
    {
      type: Schema.Types.ObjectId,
      ref: "Review",
    },
  ],
  Owner: {
    type: Schema.Types.ObjectId,
    ref: "User",
  },
  geometry: {
    type: {
      type: String, // Don't do `{ location: { type: String } }`
      enum: ['Point'], // 'location.type' must be 'Point'
      required: true
    },
    coordinates: {
      type: [Number],
      required: true
    }
  }
});


listingSchema.post("findOneAndDelete", async (doc) =>{
    console.log("Listing deleted:", doc);
});


const Listing = mongoose.model("Listing", listingSchema);
module.exports = Listing;


