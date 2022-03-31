const { Router } = require('express');
const { exchangeCodeForToken, getGithubProfile } = require('../utils/github');

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
    //1.exchange code for token, 2.create user profile, 3.sign in
    //http://localhost:7890/api/v1/github/login/callback?code=04a4b87bfb815e01afa5
    const { code } = req.query;
    const token = await exchangeCodeForToken(code);
    const { login, avatar_url, email } = await getGithubProfile(token);
  });
