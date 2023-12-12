// Importing necessary modules
const multer = require('multer');
const { v4: uuidv4 } = require('uuid'); // Using the 'uuid' library to generate unique identifiers
const path = require("path");

// Configuring multer disk storage
const storage = multer.diskStorage({
    // Setting the destination folder for uploaded files
    destination: function(req, file, cb) {
        cb(null, './public/images/uploads');
    },
    // Generating a unique filename using UUID and preserving the original file extension
    filename: function(req, file, cb) {
        const uniqueName = uuidv4(); // Generating a unique filename using UUID
        cb(null, uniqueName + path.extname(file.originalname)); // Use the unique filename for the uploaded file
    }
});

// Creating a multer instance with the configured storage settings
const upload = multer({ storage: storage });

// Exporting the configured multer instance for use in other modules
module.exports = upload;
