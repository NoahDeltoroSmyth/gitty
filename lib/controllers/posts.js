const { Router } = require('express');
const authenticate = require('../middleware/authenticate');
const Post = require('../models/Post');

module.exports = Router()
  .get('/', authenticate, async (req, res, next) => {
    try {
      const posts = await Post.getAll();
      res.send(posts);
    } catch (error) {
      next(error);
    }
  })
  .post('/', authenticate, async (req, res, next) => {
    try {
      const post = {
        id: '3',
        post: 'This is my third post!',
      };
      res.send(post);
    } catch (error) {
      next(error);
    }
  });
