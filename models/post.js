var mongoose = require('mongoose');

var blogSchema = new mongoose.Schema({
    title: String,
    image: {type:String, default:''},
    body: String,
    created_at: {type:Date, default: Date.now},
    author: {
        id:{
            type:mongoose.Schema.Types.ObjectId,
            ref:'user'
        },
        username: String,
    },
    comments: [ {   type: mongoose.Schema.Types.ObjectId,
        ref:'comment'
        }
    ]

})

module.exports = mongoose.model('post', blogSchema);
