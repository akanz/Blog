var express = require('express'),
    bodyParser = require('body-parser'),
    mongoose = require('mongoose'),
    passport = require('passport'),
    LocalStrategy = require('passport-local'),
    localPassportMongoose = require('passport-local-mongoose'),
    session = require('express-session'),
    methodOvd = require('method-override'), 
    sanitizer = require('express-sanitizer'),
    flash = require('connect-flash'),
    cookieParser =require('cookie-parser'),
    User = require('./models/user'),
    Comment = require('./models/comment');

var blogRoute = require('./routes/blog'),
    authRoute = require('./routes/auth'),
    commentRoute = require('./routes/comment');

var app = express();
mongoose.connect('mongodb://localhost/blog',
 {useNewUrlParser: true, useUnifiedTopology: true, useFindAndModify:false});

app.set('view engine', 'ejs');
app.use(bodyParser.urlencoded({extended: true}));
app.use(sanitizer());
app.use(express.static('public'));
app.use(methodOvd('_method'));


app.use(cookieParser('secret'));
app.use(session ({
    secret: '98765etdgcvbvgftr67ouilkm',
    resave: false,
    saveUninitialized:false,
    cookie: { maxAge: 60000 }
})
)
app.use(flash());

app.use(passport.initialize());
app.use(passport.session());
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());
passport.use(new LocalStrategy(User.authenticate())); 

app.use(function (req,res,next) {
    res.locals.currentuser = req.user;
    res.locals.error = req.flash("error");
    res.locals.success = req.flash("success");
    res.locals.message = req.flash();
    next();
})

// app.get('/' , function (req,res) {
//     res.send('Landing page');
// })

app.use('/blog', blogRoute);
app.use(authRoute);
app.use('/blog/:id/comments', commentRoute);



app.listen(3000, function () {
    console.log('app server is running');
})