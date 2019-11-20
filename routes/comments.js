var express = require("express")
var router = express.Router()
var Campground = require("../models/campground")
var Comment = require("../models/comment")
var middleware = require("../middleware/index")

router.get("/campgrounds/:id/comments/new", middleware.isLoggedIn, function(req, res) {
  Campground.findById(req.params.id, function(err, foundCamp) {
    if(err) {
      console.log(err)
    } else {
      res.render("comments/new", {camp:foundCamp})
    }
  })
})

router.post("/campgrounds/:id/comments", middleware.isLoggedIn, function(req, res) {
  Campground.findById(req.params.id, function(err, foundCamp) {
    if(err) {
      console.log(err)
    } else {
      Comment.create(req.body.comment, function(err, newcomment) {
        if(err) {
          console.log(err)
        } else {
          newcomment.author.id = req.user.id
          newcomment.author.username = req.user.username
          newcomment.save()
          foundCamp.comments.push(newcomment)
          foundCamp.save()
          req.flash("success", "Successfully added comment")
          res.redirect("/campgrounds/" + req.params.id)
        }
      })
    }
  })
})

router.get("/campgrounds/:id/comments/:comment_id/edit", middleware.checkCommentOwner, function(req, res) {
  Comment.findById(req.params.comment_id, function(err, foundComment) {
    if (err) {
      console.log(err)
    } else {
      res.render("comments/edit", {camp_id:req.params.id, comment:foundComment})
    }
  })
})

router.put("/campgrounds/:id/comments/:comment_id", middleware.checkCommentOwner, function(req, res) {
  Comment.findByIdAndUpdate(req.params.comment_id, req.body.comment, function(err, foundComment) {
    if (err) {
      console.log(err)
    } else {
      res.redirect("/campgrounds/" + req.params.id)
    }
  })
})

router.delete("/campgrounds/:id/comments/:comment_id", middleware.checkCommentOwner, function(req, res) {
  Comment.findByIdAndRemove(req.params.comment_id, function(err) {
    if (err) {
      console.log(err)
    } else {
      req.flash("success", "Comment deleted")
      res.redirect("/campgrounds/" + req.params.id)
    }
  })
})




module.exports = router