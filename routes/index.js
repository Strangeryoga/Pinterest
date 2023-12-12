// Importing required modules
var express = require('express');
var router = express.Router();
const userModel = require('./users')  // Importing the user model
const postModel = require('./posts');  // Importing the post model
const passport = require('passport');
const upload = require("./multer");  // Importing multer for file uploads

// Setting up local strategy for Passport
// This allows users to log in using the local strategyconst localStrategy = require('passport-local');
const localStrategy = require('passport-local');
passport.use(new localStrategy(userModel.authenticate()));



/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', { title: 'Express', nav: false });
});

// Route to handle user registration
router.post('/register', function(req, res){
  const { username, email, fullname } = req.body;
  const userData = new userModel({ username, email, fullname});

  // Register the user and redirect to the profile page upon successful registration
  userModel.register(userData, req.body.password)
  .then(function(){
    passport.authenticate('local')(req, res, function(){
      res.redirect('/profile');
    })
  })
})

// Route to render the login page
router.get('/login', function(req, res, next) {
  res.render('login', {error: req.flash('error'), nav: false});
});

// Route to handle user login using Passport local strategy
router.post('/login', passport.authenticate('local', {
  successRedirect: '/profile',
  failureRedirect: '/login',
  failureFlash: true
}), function(req, res){
  // Callback function for handling login
});

// Route to render the profile page, only accessible if user is logged in
router.get('/profile', isLoggedIn, async function(req, res, next) {
  const user = await userModel.findOne({username: req.session.passport.user})
  .populate("posts");
  console.log(user);
  res.render('profile', {user, nav: true});
});

// Middleware function to check if the user is authenticated
function isLoggedIn(req, res, next) {
  if(req.isAuthenticated()) return next();
  res.redirect('/login');
}

// Route to render the feed page
router.get('/feed', isLoggedIn, async function(req, res, next) {
  const user = await userModel.findOne({username: req.session.passport.user})
  const posts = await postModel.find()
  .populate("user") 
  res.render('feed', {user, posts, nav: true});
})

// Route to handle user logout
router.get('/logout', function(req, res, next) {
  req.logout(function(err) {
    if (err) { return next(err); }
    res.redirect('/');
  });
})

// Route to handle profile image file upload
router.post('/fileupload', isLoggedIn, upload.single("image"), async function(req, res, next) {
  const user = await userModel.findOne({username: req.session.passport.user});
  user.profileImage = req.file.filename;
  await user.save();
  res.redirect("/profile");
})

// Route to add the pins
router.get('/add', isLoggedIn, async function(req, res, next) {
  const user = await userModel.findOne({username: req.session.passport.user})
  res.render('add', {user, nav: true});
});

// Route to add the image and it's details
router.post('/createpost', isLoggedIn, upload.single("postImage"), async function(req, res, next) {
  const user = await userModel.findOne({username: req.session.passport.user});
  const post = await postModel.create({
    user: user._id,
    title: req.body.title,
    description: req.body.description,
    image: req.file.filename
  });
  
  user.posts.push(post._id);
  await user.save();
  res.redirect("/profile");
});

// Route to show the posts in our profile
router.get('/show/posts', isLoggedIn, async function(req, res, next) {
  const user = await userModel.findOne({username: req.session.passport.user})
  .populate("posts");
  console.log(user);
  res.render('show', {user, nav: true});
});







// Route to handle file upload
router.post('/upload', isLoggedIn, upload.single("file") , async function(req, res, next) {
  if(!req.file){
    return res.status(404).send("no files were given");
  }
  const user = await userModel.findOne({username: req.session.passport.user});
  const post = await postModel.create({
    image: req.file.filename,
    imageText: req.body.filecaption,
    user: user._id
  });
  user.posts.push(post._id);
  await user.save();
  res.redirect('/profile');
})

// router.get('/alluserposts', async function(req, res, next) {
//   let user = await userModel
//   .findOne({_id: '6561e2bcd5689012731d597c'})
//   .populate('posts') // converts id into real data
//   res.send(user);
// })

// router.get('/createuser', async function ( req, res, next){
//   let createduser = await userModel.create({
//     username: 'cris',
//     password: 'proar',
//     posts: [],
//     email: 'cris@male.com',
//     fullname: 'Crisproar',
//   });
//   res.send(createduser)
// }); 

// router.get('/createpost', async function (req, res, next) {
//  let createdpost = await postModel.create({
//     postText: "nature",
//     user: '6561e2bcd5689012731d597c'
//   });
//   let user = await userModel.findOne({_id: '6561e2bcd5689012731d597c'});
//   user.posts.push(createdpost._id);
//   await user.save();
//   res.send(('done'));
// });

// Exporting the router
module.exports = router;
