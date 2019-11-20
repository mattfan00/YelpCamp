var express = require('express'),
    app = express(),
    bodyParser = require('body-parser'),
    mongoose = require('mongoose'),
    flash = require("connect-flash"),
    passport = require("passport"),
    LocalStrategy = require("passport-local")
    methodOverride = require("method-override"),
    Campground = require('./models/campground'),
    Comment = require("./models/comment"),
    User = require("./models/user")
    // seedDB = require("./seeds.js")

var campgroundRoutes = require("./routes/campgrounds"),
    commentRoutes = require("./routes/comments"),
    indexRoutes = require("./routes/index")


// seedDB()

// mongoose.connect("mongodb://localhost:27017/yelp_camp", {useNewUrlParser: true, useUnifiedTopology: true})
mongoose.connect("mongodb+srv://mattfan00:spacelf14@cluster0-wjtbp.mongodb.net/test?retryWrites=true&w=majority", {
  useNewUrlParser: true,
  useCreateIndex: true,
  useUnifiedTopology: true
})
app.use(bodyParser.urlencoded({extended:true}))
app.use(express.static(__dirname + "/public"))
app.use(methodOverride("_method"))
app.use(flash())

app.set('view engine', 'ejs')

// PASSPORT CONFIGURATION
app.use(require("express-session")({
  secret: "this is secret",
  resave: false,
  saveUninitialized: false
}))
app.use(passport.initialize())
app.use(passport.session())
passport.use(new LocalStrategy(User.authenticate()))
passport.serializeUser(User.serializeUser())
passport.deserializeUser(User.deserializeUser())

// pass in the currently signed in user to every route
app.use(function(req, res, next) {
  res.locals.currentUser = req.user
  res.locals.errorMessage = req.flash("error")
  res.locals.successMessage = req.flash("success")
  next()
})


// Campground.create({
//   name: 'camp 1', 
//   image: 'https://www.photosforclass.com/download/pixabay-4303359?webUrl=https%3A%2F%2Fpixabay.com%2Fget%2F52e3d5404957a514f6da8c7dda793f7f1636dfe2564c704c722c7fd0944ec75d_960.jpg&user=chanwity',
//   description: "this is the very first camp ground i created"
// }, function(err, campground) {
//   if(err) {
//     console.log('there was an error')
//   } else {
//     console.log('successfully created')
//     console.log(campground)
//   }
// })

app.use(campgroundRoutes)
app.use(commentRoutes)
app.use(indexRoutes)


app.listen(3000, function() {
  console.log('yelpcamp server is running')
})