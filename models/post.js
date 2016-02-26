var mongoose = require('mongoose');

var schema = new mongoose.Schema({
    title: {
        type: String,
        required: true
    },
    pinned: {
        type: Boolean,
        required: true
    },
    content: {
        type: String,
        default: function () {
            return "";
        }
    },
    deleted:{
        type:Boolean,
        default:false
    },
    owner:{
        type: mongoose.Schema.Types.ObjectId,
        required:true,
    },
    tags:[String],
    created_at: {
        type: Date,
        required: true,
        default: function () {
            return Date.now();
        }
    },
    updated_at: {
        type: Date,
        required: true,
        default: function () {
            return Date.now();
        }
    }
});

schema.pre('save', function (next) {
    this.updated_at = Date.now();
    next();
});

schema.statics.getPost = function(id){
    //todo check dis
    return this.findById(id).exec(function (err, post) {
        if (err) {
            return console.error(err);
        }
        return post;
    });
};

schema.statics.getAllPosts  =function(){
    return this.find().where('deleted', false).exec(function (err, posts) {
        if (err) {
            return console.error(err);
        }
        return posts;
    });
};

schema.statics.getNotPinnedPosts = function () {
    return this.find().where('pinned', false).where('deleted', false).exec(function (err, posts) {
        if (err) {
            return console.error(err);
        }
        return posts;
    });
};

schema.statics.getPinnedPosts = function () {
    return this.find().where('pinned', true).where('deleted', false).exec(function (err, posts) {
        if (err) {
            return console.error(err);
        }
        return posts;
    });
};

var post = module.exports = mongoose.model('post', schema);