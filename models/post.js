var mongoose = require('mongoose'),
    Schema = mongoose.Schema,
    SchemaTypes = Schema.Types,
    ObjectId = SchemaTypes.ObjectId;

module.exports = new Schema({

    title: String,
    pinned: Boolean,
    intro: String,
    content: String,
    created_at: {
        type: Date,
        default: function(){
            return Date.now();
        }
    }
});

module.exports.statics.findAllPosts = function(){
    return this.find().where('pinned', false).exec(function(err, posts){
        if(err) {
            return console.error(err);
        }
        return posts;
    });
};

module.exports.statics.findPinnedPosts = function(){
    return this.find().where('pinned', true).exec(function(err, posts){
        if(err) {
            return console.error(err);
        }
        return posts;
    });
};