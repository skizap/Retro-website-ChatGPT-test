const express = require('express');
const router = express.Router();

// Load Post model
const Post = require('../models/Post');

// Home Page
router.get('/', (req, res) => {
  Post.find().sort({ date: -1 }).populate('author').exec((err, posts) => {
    if (err) {
      console.log(err);
    } else {
      res.render('index', {
        title: 'Home',
        posts: posts
      });
    }
  });
});

// Individual Post Page
router.get('/post/:id', (req, res) => {
  Post.findById(req.params.id).populate('author').exec((err, post) => {
    if (err || !post) {
      req.flash('error_msg', 'Post not found');
      res.redirect('/');
    } else {
      res.render('post', {
        title: post.title,
        post: post
      });
    }
  });
});

module.exports = router;
