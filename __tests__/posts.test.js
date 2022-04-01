const pool = require('../lib/utils/pool');
const setup = require('../data/setup');
const request = require('supertest');
const app = require('../lib/app');
jest.mock('../lib/utils/github');

describe('gitty routes', () => {
  beforeEach(() => {
    return setup(pool);
  });

  afterAll(() => {
    pool.end();
  });

  it('gets a list of posts for a signed in user', async () => {
    //define a fake post
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
    //agent variable
    const agent = request.agent(app);
    // unauthenticated user tries signing in, should get 401
    let res = await agent.get('/api/v1/posts');
    expect(res.status).toEqual(401);
    // sign in a user and redirect
    // await UserService.create({
    //   username: 'fake_github_user',
    //   email: 'not-real@example.com',
    // });
    await agent.get('/api/v1/github/login/callback?code=42').redirects(1);
    // await list of posts should be 200 status
    res = await agent.get('/api/v1/posts');
    expect(res.status).toEqual(200);
    expect(res.body).toEqual([...posts]);
  });
});
