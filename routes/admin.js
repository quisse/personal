var express = require('express');
var router = express.Router();
var forms = require('forms');
var fields = forms.fields;
var validators = forms.validators;
var multiparty = require('multiparty');
var passport = require('passport');
var AWS = require('aws-sdk');
var fs = require('fs');
var path = require('path');
var async = require('async');
var sizeOf = require('image-size');

var Post = require('../models/post');
var User = require('../models/user');

var bucket = process.env.S3_BUCKET;
var s3Client = new AWS.S3({
    accessKeyId: process.env.S3_KEY,
    secretAccessKey: process.env.S3_SECRET,
    region: process.env.S3_REGION
});
console.log(process.env.S3_KEY, process.env.S3_SECRET);

add_form = forms.create({
    title: fields.string({required: true}),
    tags: fields.string(),
    pinned: fields.boolean()
});

login_form = forms.create({
    email: fields.email({required: true}),
    password: fields.password({required: true}),
});

/* GET routes page. */
router.get('/', isLoggedIn, function (req, res, next) {
    Post.getAllPosts().then(function (posts) {
        res.render('admin', {user: req.user, posts: posts, add_form: add_form.toHTML()});
    });
});

router.post('/', isLoggedIn, function (req, res) {
    User.getUser(req.user._id).then(function (user) {
        if (user.admin == true) {
            add_form.handle(req, {
                success: function (form) {
                    var data = form.data;
                    console.log('validated');
                    data.owner = user._id;
                    var tags = data.tags.split(',');
                    data.tags = [];
                    tags.forEach(function (tag) {
                        data.tags.push(tag);
                    });
                    console.log(data);
                    Post.create(data, function (err, post) {
                        console.log(err);
                        console.log(post);
                        res.redirect('/admin/post/' + post._id);
                    });
                },
                error: function (form) {
                    res.redirect('/admin');
                },
                empty: function (form) {
                    res.redirect('/admin');
                }
            })
        } else {
            res.redirect('/admin');
        }
    })
});

router.get('/post/:id', isLoggedIn, function (req, res) {
    Post.getPost(req.params.id).then(function (post) {
        console.log(post);
        res.render('edit', {user: req.user, content: post.content})
    });
});

router.post('/post/:id', isLoggedIn, function (req, res) {
    Post.getPost(req.params.id).then(function (post) {
        User.getUser(req.user._id).then(function (user) {
            if (post.owner.toString() == user._id.toString()) {
                var form = new multiparty.Form();
                form.parse(req, function (err, fields, files) {
                    if (fields.content[0]) {
                        post.content = fields.content[0];
                        post.save(function (err) {
                            if (err) return handleError(err);
                            // saved!
                            res.sendStatus(200);
                        });
                    } else {
                        res.sendStatus(200);
                    }
                });
            }
        });
    });
});

router.post('/post/:id/img', isLoggedIn, function (req, res) {
    console.log('post');
    var form = new multiparty.Form();
    form.on('file', function (name, file) {
        var filePath = req.params.id + '/' + file.originalFilename;
        var exist;
        var size;
        async.doWhilst(function (callback) {
            s3Client.headObject({
                Bucket: bucket,
                Key: filePath,
            }, function (err, res) {
                if (err) {
                    if(err.statusCode == 404){
                        exist = false;
                    }else {
                        console.log(err);
                        return
                    }
                }
                if (res) {
                    exist = true;
                    var file = path.basename(filePath, path.extname(filePath));
                    filePath = req.params.id + '/' + file + Math.floor((Math.random() * 1000) + 1) + path.extname(filePath);
                    console.log(filePath);
                }
                callback();
            });
        }, function () {
            return exist;
        }, function (err) {
            s3Client.putObject({
                Bucket: bucket,
                Key: filePath,
                ACL: 'public-read',
                Body: fs.createReadStream(file.path),
                //ContentLength: part.byteCount
            }, function (err, data) {
                var size = sizeOf(file.path);
                console.log(size);
                fs.unlink(file.path);
                if (err) throw err;
                res.json({url: 'https://'+bucket+'.s3.amazonaws.com/'+ filePath, size: [size.width, size.height]})
            });
        });

        //part.on('error', function(err) {
        //    // decide what to do
        //});
    });
    form.parse(req);
});

router.delete('/post/:id', isLoggedIn, function (req, res) {
    Post.getPost(req.params.id).then(function (post) {
        User.getUser(req.user._id).then(function (user) {
            if (post.owner.toString() == user._id.toString()) {
                console.log('delete');
                post.deleted = true;
                post.save(function (err) {
                    if (err) return handleError(err);
                    // saved!
                    res.sendStatus(200);
                });
            }
        });
    });
});

router.get('/signup', function (req, res) {
    res.render('login', {login_form: login_form.toHTML()})
});

router.post('/signup', passport.authenticate('local-signup', {
    successRedirect: '/admin',
    failureRedirect: '/admin/signup',
    failureFlash: true
}));

router.get('/login', function (req, res) {
    res.render('login', {login_form: login_form.toHTML()});
});

router.post('/login', passport.authenticate('local-login', {
    successRedirect: '/admin',
    failureRedirect: '/admin/login',
    failureFlash: true
}));

router.get('/logout', isLoggedIn, function (req, res) {
    req.logout();
    res.redirect('/');
});

function isLoggedIn(req, res, next) {

    // if user is authenticated in the session, carry on
    if (req.isAuthenticated())
        return next();

    // if they aren't redirect them to the home page
    res.redirect('/admin/login');
}

module.exports = router;