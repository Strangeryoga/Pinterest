const mongoose = require('mongoose');

// Defining the schema for the 'Post' model
const postSchema = new mongoose.Schema({
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'  // Reference to the 'User' model, indicating that the 'user' field is linked to a User document
    },
    title: {
        type: String,
        
    },
    description: {
        type: String
    },
    image: {
        type: String
    },
    createdAt: {
        type: Date,
        default: Date.now,  // Default value is the current timestamp when the post is created
    },
    likes: {
        type: Array,
        default: [],  // Default value is an empty array for storing likes
    },
});

// Create the post model using the defined schema
module.exports = mongoose.model('Post', postSchema);