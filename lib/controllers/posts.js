const { Router } = require('express');
const authenticate = require('../middleware/authenticate');

module.exports = Router().get('/', authenticate, async (req, res) => {
  const posts = [
    {
      id: '1',
      post: 'This is my first post!',
    },
    {
      id: '2',
      post: 'This is my second post!',
    },
  ];
  res.send(posts);
});
