const mongoose = require('mongoose');
const plm = require('passport-local-mongoose');

// Connecting to the MongoDB database (pinterest)
mongoose.connect('mongodb://127.0.0.1:27017/pinterest');

// Defining the schema for the 'User' model
const userSchema = new mongoose.Schema({
  // User's username
  username: {
    type: String,
    required: true,
    unique: true,  // Ensuring that usernames are unique
  },
  // User's password (hashed and managed by Passport Local Mongoose)
  password: {
    type: String,
  },
  // Array of posts associated with the user
  posts: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Post'  // Reference to the 'Post' model, indicating that the 'posts' field is linked to Post documents
  }],
  // User's profile picture URL
  dp: {
    type: String,
  },
  // User's email (required and unique)
  email: {
    type: String,
    required: true,
    unique: true,  // Ensuring that email addresses are unique
  },
  // User's full name (required)
  fullname: {
    type: String,
    required: true,
  },
});

// Applying the Passport Local Mongoose plugin to the schema
userSchema.plugin(plm);

// Create the user model using the defined schema
module.exports = mongoose.model('User', userSchema);