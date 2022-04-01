# Plan for Gitty

## Copy over mocks

<!-- /* eslint-disable no-console */
const exchangeCodeForToken = async (code) => {
  console.log(`MOCK INVOKED: exchangeCodeForToken(${code})`);
  return `MOCK_TOKEN_FOR_CODE_${code}`;
};

const getGithubProfile = async (token) => {
  console.log(`MOCK INVOKED: getGithubProfile(${token})`);
  return {
    login: 'fake_github',
    avatar_url: 'https://www.placecage.com/gif/300/300',
    email: 'fake@example.com',
  };
};

module.exports = { exchangeCodeForToken, getGithubProfile }; -->

## Auth

- use github Oauth (maybe initial step)
- GET `/api/v1/github/login` to redirect to github Oauth
- GET `/api/v1/github/login/callback` callback URI to redirect after login

## Controllers

- auth.js
  - GET `/login`
  - GET `/login/callback`
- posts.js
  - GET all `/` (authenticated)
  - POST `/` (authenticated)

## MiddleWare

- Authenticate.js

## Models

- GithubUser
  - insert method
  - find by method
- Post
  - getAll method
  - insert method

## SQL

- github_users
  - id BIGINT GENERATED ALWAYS AS IDENTITY PRIMARY KEY
  - email TEXT NOT NULL
  - password TEXT NOT NULL (needed?)
- posts
  - id BIGINT GENERATED ALWAYS AS IDENTITY PRIMARY KEY
  - TEXT NOT NULL LIMIT 255

## Dependencies

- npm run setup-db
- npm i cross-fetch
- npm i jsonwebtoken
- npm i cookie-parser
- npm i bcrypt

## YML / ENV / GITHUB SECRETS

- Don't forget to update YML
- Don't forget to update ENV / EXAMPLE
- Don't forget to update GITHUB SECRETS
