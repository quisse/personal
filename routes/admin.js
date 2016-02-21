var express = require('express');
var router = express.Router();
var forms = require('forms');
var fields = forms.fields;
var validators = forms.validators;
var multiparty = require('multiparty');
var passport = require('passport');

var Post = require('../models/post');
var User = require('../models/user');

add_form = forms.create({
    title: fields.string({required:true}),
    pinned: fields.boolean()
});

login_form = forms.create({
    email: fields.email({required:true}),
    password: fields.password({required:true}),
});

/* GET routes page. */
router.get('/', isLoggedIn, function(req, res, next) {
    Post.getAllPosts().then(function(posts){
        res.render('admin', { user: req.user, posts: posts, add_form :add_form.toHTML()});
    });
});

router.post('/', isLoggedIn, function(req,res){
    User.getUser(req.user._id).then(function(user){
        if(user.admin == true){
            add_form.handle(req,{
                success: function(form){
                    var data = form.data;
                    console.log('validated');
                    console.log(data);
                    data.owner = user._id;
                    Post.create(data, function(err, post){
                        console.log(err);
                        console.log(post);
                        res.redirect('/admin/post/' + post._id);
                    });
                },
                error:function(form){
                    res.redirect('/admin');
                },
                empty:function(form){
                    res.redirect('/admin');
                }
            })
        } else{
            res.redirect('/admin');
        }
    })
});

router.get('/post/:id', isLoggedIn, function(req,res){
    Post.getPost(req.params.id).then(function(post){
        console.log(post);
        res.render('edit', { user: req.user, content:post.content})
    });
});

router.post('/post/:id', isLoggedIn,function(req,res){
    Post.getPost(req.params.id).then(function(post){
        var form = new multiparty.Form();

        form.parse(req, function(err, fields, files) {
            console.log(fields.content[0]);
            post.content = fields.content[0];
            post.save(function (err) {
                if (err) return handleError(err);
                // saved!
                res.sendStatus(200);
            });
        });
    });
});

router.delete('/post/:id', isLoggedIn,function(req,res){

});

router.get('/signup', function(req, res){
    res.render('login', { login_form:login_form.toHTML()})
});

router.post('/signup', passport.authenticate('local-signup',{
    successRedirect: '/admin',
    failureRedirect: '/admin/signup',
    failureFlash:true
}));

router.get('/login', function(req,res){
    res.render('login', { login_form :login_form.toHTML()});
});

router.post('/login', passport.authenticate('local-login', {
    successRedirect:'/admin',
    failureRedirect:'/admin/login',
    failureFlash:true
}));

router.get('/logout', isLoggedIn, function(req,res){
    req.logout();
    res.redirect('/');
});

function isLoggedIn(req,res,next){

    // if user is authenticated in the session, carry on
    if (req.isAuthenticated())
        return next();

    // if they aren't redirect them to the home page
    res.redirect('/admin/login');
}

module.exports = router;