var Post = require('../models/post'),
    Comment = require('../models/comment')

var middlewareObj = {};

// Authentication middleware. i.e check if the user is logged in
middlewareObj.isLoggedIn = function(req,res,next) {
    if(req.isAuthenticated()){
        return next();
    }
    else{
        req.flash("error","please Login into your account");
        res.redirect('/login');
    }
    
}

// Authorization middleware . check if a user has particular access to that function(post)
middlewareObj.isAuth = function(req,res,next) {
    if(req.isAuthenticated()){
        Post.findById(req.params.id, function (err, oldArticle) {
            if (err){
                res.redirect('/blog/')
            }
            else{
                if (oldArticle.author.id.equals(req.user._id)) {
                    next();
                }
                else{
                    res.redirect('back');
                }
            }
        })
    }
    else{
        res.redirect('back');
    }
    
}

// Authorization middleware . check if a user has particular access to that function(comment)
middlewareObj.isCommentOwner = function (req,res,next) {
    if(req.isAuthenticated()){
        Comment.findById(req.params.comment_id, function (err, foundComment) {
            if (err){
                res.redirect('/blog/')
            }
            else{
                if (foundComment.author.id.equals(req.user._id)) {
                    next();
                }
                else{
                    res.redirect('back');
                }
            }
        })
    }
    else{
        res.redirect('back');
    }
    
}
    
module.exports = middlewareObj