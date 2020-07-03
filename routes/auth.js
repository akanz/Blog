var express = require('express'),
    passport = require('passport'),
    User = require('../models/user'),
    router = express.Router();

// =============================
// user authentication routes
// =============================


// User.create({username: 'Kfash',
//             email:'Koladefash@gmail.com',
//             password:'iamtobias',
// },function (err, user) {
//     if(err){
//         console.log(err);
//     }
//     else{
//         console.log(user);
//     }
// });


//linking two schema's by embed or value
// User.findOne({}, function(err, user){
//         if (err) {
//             console.log(err);
//             console.log('Unable to find user');
//             }
//         else{
//             user.posts.push({
//                 title:"How to win a girl's heart pt. 2",
//                 body:'As we know girls are very complicated species. They deserve more and less simultaneously.',
//             });
//             user.save(function(err, user){
//                 if (err) {
//                     console.log(err);
//                     console.log('Unable to push post');
//                 }
//                 else{
//                     console.log(user);
//                 }
//             });
//         }
//     });



router.get('/', function (req,res) {
    res.redirect('/blog');
})

//Register routes

router.get('/register', function (req,res) {
    res.render('register');
} )

router.post('/register', function (req,res) {
    console.log(req.body)
    var newUser     = req.body.username, 
        email       = req.body.email, 
        password    = req.body.password;

    User.register(new User({ username: newUser, email: email}), password, function (err, user) {
        if(err){
            console.log('unable to create new user')
            console.log(err)
            return res.render('register')
        }
        else{
            passport.authenticate('local')(req, res,function () {
                res.redirect('/login');
            })
        }
      
    }   )
})

// login routes
router.get('/login', function (req,res) {
    res.render('login', {message: req.flash("error")});
    console.log(req.flash("error"))
})

router.post('/login', passport.authenticate('local',{
    successRedirect: '/blog',
    failureRedirect: '/login',
}), function (req, res) {  
})

router.get('/profile',isLoggedIn, function (req,res) {
    res.render('profile');
 
})

//logout route
router.get('/logout', function (req,res) {
    req.logout();
    res.redirect('/')
})

function isLoggedIn(req,res,next) {
    if(req.isAuthenticated()){
        return next();
    }
    res.redirect('/login');
}

module.exports = router;