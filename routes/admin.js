var express = require('express');
var router = express.Router();
var forms = require('forms');
var fields = forms.fields;
var validators = forms.validators;

var Post = require("../models/post")/*.Post*/;

add_form = forms.create({
    title: fields.string({required:true}),
    pinned: fields.boolean(),
});

/* GET routes page. */
router.get('/', function(req, res, next) {
    res.render('admin', { posts: /*Post.findAllPosts()*/ "", add_form :add_form.toHTML()});
});

router.post('/', function(req,res){
    add_form.handle(req,{
        success: function(form){
            var data = form.data;
            console.log('validated');
            console.log(data);
            Post.create(data, function(err, post){
                console.log(err);
                console.log(post);
                res.redirect('/admin/' + post._id);
            });
            //console.log(x.save());
            //x.save(function(err){
            //    console.log('error',err);
            //});
            //console.log(x);
        },
        error:function(form){
            res.redirect('/admin');
        },
        empty:function(form){
            res.redirect('/admin');
        }
    })
});

router.get('/:id', function(req,res){
    Post.getPost(req.params.id).then(function(post){
        console.log(post);
        res.render('edit', {content:post.content})
    });
});

router.post('/:id', function(req,res){
    console.log(req.params.id);
    res.render('edit', {id:''})
});

module.exports = router;