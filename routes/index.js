var express = require('express');
var router = express.Router();

var Post = require("../models/post").Post;
/* GET home page. */
router.get('/', function(req, res, next) {
  Post.findAllPosts().then(function(result){
    console.log(new Date().toISOString());
    console.log(result);
  });
  Post.findPinnedPosts().then(function(result){
    console.log(result);
  });
  res.render('index', { posts: Post.findAllPosts(), title: 'joskee' });
});

// tweak for preventing dyno to go to sleep
router.get('/alive', function(req,res){
  res.send('yes');
});

module.exports = router;