var express = require('express');
var router = express.Router();

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', { active_blog:true, title: 'joskee' });
});

// tweak for preventing dyno to go to sleep
router.get('/alive', function(res){
  res.send('yes');
});

module.exports = router;
