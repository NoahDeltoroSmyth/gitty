const { Router } = require('express');
const authenticate = require('../middleware/authenticate');
const Post = require('../models/Post');

module.exports = Router()
  .get('/', authenticate, (req, res, next) => {
    Post.getAll()
      .then((posts) => res.send(posts))
      .catch(next);
  })
  .post('/', authenticate, (req, res, next) => {
    Post.insert({ ...req.body })
      .then((post) => res.send(post))
      .catch(next);
  });
