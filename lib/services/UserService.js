const GithubUser = require('../models/GithubUser');
const { exchangeCodeForToken, getGithubProfile } = require('../utils/github');

module.exports = class UserService {
  static async create(code) {
    //2. exchange code for token
    const token = await exchangeCodeForToken(code);

    //3. get user information from github using token
    const profile = await getGithubProfile(token);

    //4. creat or fetch a user in the database using github username
    let user = await GithubUser.findByUsername(profile.username);

    if (!user) {
      user = await GithubUser.insert(profile);
    }
    return user;
  }
};
