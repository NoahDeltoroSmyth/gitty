const GithubUser = require('../models/GithubUser');
const { exchangeCodeForToken, getGithubProfile } = require('../utils/github');

module.exports = class UserService {
  static async create(code) {
    //2. exchange code for token
    const token = await exchangeCodeForToken(code);

    //3. get user information from github using token
    const { login, avatar_url, email } = await getGithubProfile(token);

    //4. creat or fetch a user in the database using github username
    let user = await GithubUser.findByUsername(login);
    if (!user) {
      user = await GithubUser.insert({
        username: login,
        email,
        avatar: avatar_url,
      });
    }
    return user;
  }
};
