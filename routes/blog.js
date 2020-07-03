var express = require('express'),
    Post = require('../models/post'),
    User = require('../models/user'),
    middleware = require('../middleware'),
    router = express.Router();

//======================
//RESTful blog routes
//======================


//A user creating a post by reference the id
// Post.create({
//     title:'How to be an Entrepreneur Pt 1',
//     body:'We all know it is not easy in Lagos, Been an Engineering student is very difficult',
// }, function(err, post){
//     if (err) {
//         console.log(err);
//         console.log('Unable to create post');
//     }
//     else{
//         console.log('New post created');
//     }

// })


//GET all blogs
router.get('/', function(req,res) {
    //console.log(req.user);
    Post.find({},null,{sort:'-created_at'}, function (err, articles) {
        if(!err){
            res.render('home', {articles: articles, currentuser: req.user});
        }
        else{
            console.log(err);
            console.log('An error occurred');
        }
    })
    
})

//POST new blog 
router.post('/', middleware.isLoggedIn, function(req, res) {
    req.body.blog.body = req.sanitize(req.body.blog.body);

    //know the user the created the post
    var postCreator = {
        id: req.user._id,
        username: req.user.username,
    }
    var newPost = {title:req.body.blog.title, image: req.body.blog.image, body:req.body.blog.body, author:postCreator}
    
    
    Post.create(newPost, function(err, newarticle){
        if(!err){
            //console.log(newarticle);
            res.redirect('/blog');
        }
        else{
            console.log(err);
            console.log('An error occurred');
            res.render('newpost')
        }
    })
    
})

//GET new blog route
router.get('/newpost',middleware.isLoggedIn, function (req, res) {
    res.render('article')
})

//GET particular blog route
router.get('/:id', function(req,res){
    Post.findById(req.params.id).populate('comments').exec(function (err, profile) {
        if(!err){
            res.render('details', {profile: profile});
            //console.log(profile)
        }
        else{
            console.log(err);
            console.log('Page not found');
        }
    })
})

// GET edit particular blog
router.get('/:id/edit', middleware.isAuth, function (req,res) {
    Post.findById(req.params.id, function (err, oldArticle) {
        if(!err){
            res.render('edit', {oldarticle: oldArticle});
        }
        else{
            console.log(err);
            console.log('Unable to find id');
            res.render('article');
        }
    })
})

//PUT edited particular blog
router.put('/:id', middleware.isAuth, function (req,res) {
    req.body.blog.body = req.sanitize(req.body.blog.body);
    Post.findByIdAndUpdate(req.params.id, req.body.blog, function (err,info) {
        if(err){
            console.log(err);
            console.log('Unable to Edit blog');
            res.redirect('/blog/' + req.params.id);
        }
        else{
            res.redirect('/blog/' + info._id);
        }
    })  
})

//DELETE particular blog
router.delete('/:id',middleware.isAuth, function(req,res){
    Post.findByIdAndRemove(req.params.id, function(err,blogpost){
        if (err) {
            console.log(err);
            console.log('Unable to delete blog post');
            res.redirect('/blog/' + req.params.id)
        }
        else{
            res.redirect('/blog');
        }
    })
}) 


module.exports = router;