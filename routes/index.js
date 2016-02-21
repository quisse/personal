var express = require('express');
var router = express.Router();

var Post = require("../models/post");
/* GET routes page. */
router.get('/', function(req, res, next) {
  Post.getNotPinnedPosts().then(function(posts){
    Post.getPinnedPosts().then(function(pinned){
      res.render('index', { posts: posts, pinned:pinned, published: process.env.PUBLISHED});
    });
  });
  console.log(process.env.PUBLISHED);
});

// tweak for preventing dyno to go to sleep
router.get('/alive', function(req,res){
  res.send('yes');
});

router.get('/post/:id', function(req,res){
  Post.getPost(req.params.id).then(function(post){
    res.render('post', {post:post});
  });
});

module.exports = router;