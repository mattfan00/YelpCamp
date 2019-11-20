var Campground = require("../models/campground"),
    Comment = require("../models/comment")


// all the middleware goes here

var middlewareObj = {}

middlewareObj.isLoggedIn = function(req, res, next) {
  if(req.isAuthenticated()) {
    return next()
  }
  req.flash("error", "You need to be logged in to do that")
  res.redirect("/login")
}

middlewareObj.checkCommentOwner = async function(req, res, next) {
  try {
    if(req.isAuthenticated()) {
      let foundComment = await Comment.findById(req.params.comment_id) 
      if (foundComment.author.id.equals(req.user.id)) {
        next()
      } else {
        req.flash("error", "You don't have permission to do that")
        res.redirect("back")
      }
    } else {
      res.redirect("back")
    }
  } catch(err) {
    req.flash("error", "You need to be logged in to do that")
    console.log(err)
  }
}

middlewareObj.checkCampOwner =  async function(req, res, next) {
  if (req.isAuthenticated()) {
    try {
      let foundCamp = await Campground.findById(req.params.id)
      if (foundCamp.author.id.equals(req.user.id)) {
        next()
      } else {
        req.flash("error", "You don't have permission to do that")
        res.redirect("back")
      }
    } catch(err){
      console.log(err)
    }
  } else {
    req.flash("error", "You need to be logged in to do that")
    res.redirect("back")
  }
    
  // if (req.isAuthenticated()) {
  //   Campground.findById(req.params.id, function(err, foundCamp) {
  //     if(err){
  //       console.log(err)
  //     } else {
  //       if(foundCamp.author.id.equals(req.user.id)) {
  //         next()
  //       } else {
  //         res.redirect("back")
  //       }
  //     }
  //   })
  // } else {
  //   res.redirect("back")
  // }
}


module.exports = middlewareObj