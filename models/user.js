var mongoose = require('mongoose'),
    passportLocalMongoose = require('passport-local-mongoose');

var userSchema = new mongoose.Schema({
    username: String,
    email: String,
    password: String,
    image: {type:String, default:'https://www.pngitem.com/pimgs/m/130-1300305_user-female-alt-icon-default-user-image-png.png'},
    created_at: {type:Date, default: Date.now},
    posts: [{
        type: mongoose.Schema.Types.ObjectId,
        ref:'post',
    }],
})

userSchema.plugin(passportLocalMongoose);
module.exports = mongoose.model('user', userSchema);