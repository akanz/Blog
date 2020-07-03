var express = require('express'),
    Post = require('../models/post'),
    Comment = require('../models/comment'),
    User = require('../models/user'),
    middleware = require('../middleware'),
    router = express.Router({mergeParams: true});


//comments route
router.get('/new',middleware.isLoggedIn, function (req,res) {
   
    Post.findById( req.params.id, function (err, details) {
        if(err){
           console.log(err);
           console.log('unable to find blog post');
        }
        else{
            res.render('newcomment',{details:details});
            console.log('new comment');
            //console.log(details)
        }
    })
})

router.post('/',middleware.isLoggedIn, function (req,res) {
    Post.findById(req.params.id, function (err, blogpost) {
        if(err){
            console.log(err);
            res.redirect("/blog/req.params.id")
        }
        else{
            Comment.create(req.body.comment, function (err, newcomment) {
                if (err) {
                    console.log(err)
                }
                else{
                    //add username and id of the person that comments
                    //console.log('user '+ req.user.username + ' commented');
                    newcomment.author.id = req.user._id;
                    newcomment.author.username = req.user.username;
                    newcomment.save();

                    blogpost.comments.push(newcomment);
                    blogpost.save(function () {
                        if(err){
                            console.log(err);
                        }
                        else{
                            console.log('works fine');
                            res.redirect('/blog/' + blogpost._id);
                           // console.log(req.body.comment);
                        }
                    });
                }
            })
        }
    })
})

router.get('/:comment_id/edit',middleware.isCommentOwner, function(req,res){
    Comment.findById(req.params.comment_id, function (err,usercomment) {
        if(err){
            console.log('Unable to get particular comment')
        }
        else{
            res.render('editcomment', {details_id: req.params.id, comment: usercomment})
        }
    })
})

router.put('/:comment_id',middleware.isCommentOwner, function (req,res) {
    Comment.findByIdAndUpdate(req.params.comment_id, req.body.comment, function(err, updcom) {
        if(err){
            console.log(err)
        }
        else{
            res.redirect('/blog/' + req.params.id)
        }
    })
})

router.delete('/:comment_id', middleware.isCommentOwner,function (req,res) {
    Comment.findByIdAndRemove(req.params.comment_id, function(err, del) {
        if (err) {
            console.log('Unable to delete');
        }
        else{
            res.redirect('/blog/' + req.params.id)
        }
    })
})


module.exports = router;