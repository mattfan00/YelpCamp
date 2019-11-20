var express = require("express")
var router = express.Router()
var Campground = require("../models/campground")
var middleware = require("../middleware/index")

router.get('/campgrounds', function(req, res) {
  // Get all the campgrounds
  Campground.find({}, function(err, allcampgrounds) {
    if(err){
      console.log('there was an error')
    } else {
      res.render('campgrounds/index', {camps:allcampgrounds})
    }
  })
  
})

router.post('/campgrounds', middleware.isLoggedIn, function(req, res) {
  var name = req.body.name
  var image = req.body.image
  var description = req.body.description
  
  Campground.create({
    name:name, 
    image:image,
    description:description,
    author:{
      id: req.user,
      username: req.user.username
    }
  }, function(err, newlyCreated) {
    if(err) {
      console.log("error in adding to database")
    } else {
      res.redirect('/campgrounds')
    }
  })
})

router.get('/campgrounds/new', middleware.isLoggedIn, function(req, res) {
  res.render("campgrounds/new")
})

router.get('/campgrounds/:id', function(req, res) {
  campgroundid = req.params.id
  Campground.findById(campgroundid).populate("comments").exec(function(err, campground) {
    if(err) {
      console.log("error")
    } else {
      res.render("campgrounds/show", {camp:campground})
    }
  })
})

router.get("/campgrounds/:id/edit", middleware.checkCampOwner, function(req, res) {
  Campground.findById(req.params.id, function(err, foundCamp) {
    res.render("campgrounds/edit", {camp:foundCamp})
  })
})

router.put("/campgrounds/:id", middleware.checkCampOwner, function(req, res) {
  Campground.findByIdAndUpdate(req.params.id, req.body.camp, function(err, updatedCamp) {
    if(err) {
      console.log(err)
      res.redirect("/campgrounds")
    } else {
      res.redirect("/campgrounds/" + req.params.id)
    }
  })
})

router.delete("/campgrounds/:id", middleware.checkCampOwner, function(req, res) {
  Campground.findByIdAndRemove(req.params.id, function(err) {
    if(err) {
      console.log(err)
    } else {
      res.redirect("/campgrounds")
    }
  })
})


module.exports = router