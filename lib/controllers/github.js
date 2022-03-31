const { Router } = require('express');
const jwt = require('jsonwebtoken');
const GithubUser = require('../models/GithubUser');
const { exchangeCodeForToken, getGithubProfile } = require('../utils/github');
const ONE_DAY_IN_MS = 1000 * 60 * 60 * 24;
module.exports = Router()
  //
  .get('/login', async (req, res) => {
    //Redirect to githubs authorization endpoint
    //refer to github docs!!!!
    res.redirect(
      `https://github.com/login/oauth/authorize?client_id=${process.env.CLIENT_ID}&scope=user&redirect_uri=${process.env.REDIRECT_URI}`
    );
  })
  .get('/login/callback', async (req, res) => {
    //http://localhost:7890/api/v1/github/login/callback?code=04a4b87bfb815e01afa5

    //1. grab code
    const { code } = req.query;

    //2. exchange code for token
    const token = await exchangeCodeForToken(code);

    //3. get user information from github using token
    const { login, avatar_url, email } = await getGithubProfile(token);

    //4. creat or fetch a user in the database using github username
    let user = await GithubUser.findByUsername(login);

    if (!user)
      user = await GithubUser.insert({
        username: login,
        email,
        avatar: avatar_url,
      });

    //5. create jwt, set cookie and redirect
    const payload = jwt.sign(user.toJSON(), process.env.JWT_SECRET, {
      expiresIn: '1 day',
    });
    res
      .cookie(process.env.COOKIE_NAME, payload, {
        httpOnly: true,
        maxAge: ONE_DAY_IN_MS,
      })
      .redirect('/api/v1/github/dashboard');
  })
  .get('/dashboard', authenticate, async (req, res) => {
    res.json(req.user);
  });
