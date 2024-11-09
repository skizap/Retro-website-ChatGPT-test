const express = require('express');
const router = express.Router();
const { ensureAuthenticated } = require('../config/auth');

// Load Post model
const Post = require('../models/Post');

// New Post Page
router.get('/new', ensureAuthenticated, (req, res) => res.render('new-post', { title: 'New Post' }));

// Create New Post
router.post('/new', ensureAuthenticated, (req, res) => {
  const { title, body } = req.body;
  let errors = [];

  if (!title || !body) {
    errors.push({ msg: 'Please fill in all fields' });
  }

  if (errors.length > 0) {
    res.render('new-post', {
      title: 'New Post',
      errors,
      title,
      body
    });
  } else {
    const newPost = new Post({
      title,
      body,
      author: req.user.id
    });

    newPost
      .save()
      .then(post => {
        req.flash('success_msg', 'Post created successfully');
        res.redirect('/dashboard');
      })
      .catch(err => console.log(err));
  }
});

// Edit Post Page
router.get('/edit/:id', ensureAuthenticated, (req, res) => {
  Post.findById(req.params.id, (err, post) => {
    if (!post) {
      req.flash('error_msg', 'Post not found');
      return res.redirect('/dashboard');
    }
    if (post.author.toString() !== req.user.id) {
      req.flash('error_msg', 'Not Authorized');
      return res.redirect('/dashboard');
    }
    res.render('edit-post', {
      title: 'Edit Post',
      post: post
    });
  });
});

// Update Post
router.post('/edit/:id', ensureAuthenticated, (req, res) => {
  Post.findById(req.params.id, (err, post) => {
    if (!post) {
      req.flash('error_msg', 'Post not found');
      return res.redirect('/dashboard');
    }
    if (post.author.toString() !== req.user.id) {
      req.flash('error_msg', 'Not Authorized');
      return res.redirect('/dashboard');
    }
    post.title = req.body.title;
    post.body = req.body.body;

    post.save()
      .then(post => {
        req.flash('success_msg', 'Post updated successfully');
        res.redirect('/dashboard');
      })
      .catch(err => console.log(err));
  });
});

// Delete Post
router.delete('/delete/:id', ensureAuthenticated, (req, res) => {
  Post.findOneAndDelete({ _id: req.params.id, author: req.user.id }, err => {
    if (err) {
      console.log(err);
    }
    req.flash('success_msg', 'Post deleted successfully');
    res.redirect('/dashboard');
  });
});

module.exports = router;
