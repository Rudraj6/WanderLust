
const mongoose = require('mongoose');
const Schema = mongoose.Schema;

// ✅ FIX: use `.default`
const passportLocalMongoose =
  require("passport-local-mongoose").default;


const userSchema = new Schema({
    email: {
        type: String,
        required: true
    }
});



userSchema.plugin(passportLocalMongoose);  //this helps in adding username,passward, hashing, salting

module.exports = mongoose.model('User', userSchema);