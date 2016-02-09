var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var postSchema = new Schema({
    title: String,
    pinned: Boolean,
    intro: String,
    content: String
});

postSchema.statics.findAllPosts = function(){
    console.log(this);
    return this.find(function(err, posts){
        if(err) {
            return console.error(err);
        }
        return posts;
    });
};

var Post = mongoose.model('posts', postSchema);

module.exports = {
    Post: Post
};