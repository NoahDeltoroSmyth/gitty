const GithubUser = require('../models/GithubUser');
const { exchangeCodeForToken, getGithubProfile } = require('../utils/github');
let profile;
module.exports = class UserService {
  static create(code) {
    //2. exchange code for token
    exchangeCodeForToken(code)
      .then((token) => getGithubProfile(token))
      .then(({ username, photoUrl, email }) => {
        profile = { username, photoUrl, email };

        return GithubUser.findByUsername(username);
      })
      .then((user) => {
        if (!user) {
          return GithubUser.insert(profile);
        } else {
          return user;
        }
      });
  }
};
