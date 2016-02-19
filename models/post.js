var mongoose = require('mongoose'),
    Schema = mongoose.Schema,
    Types = Schema.Types,
    ObjectId = Types.ObjectId;
var schema = new Schema({
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
        //required: true,
        default: function () {
            return "";
        }
    },
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
    return this.findOne({'_id':id}).exec(function (err, post) {
        if (err) {
            return console.error(err);
        }
        return post;
    });
};

schema.statics.getAllPosts  =function(){
    return this.find().exec(function (err, posts) {
        if (err) {
            return console.error(err);
        }
        return posts;
    });
};

schema.statics.getNotPinnedPosts = function () {
    return this.find().where('pinned', false).exec(function (err, posts) {
        if (err) {
            return console.error(err);
        }
        return posts;
    });
};

schema.statics.getPinnedPosts = function () {
    return this.find().where('pinned', true).exec(function (err, posts) {
        if (err) {
            return console.error(err);
        }
        return posts;
    });
};

var posts = module.exports = mongoose.model('posts', schema);