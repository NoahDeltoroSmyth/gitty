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

    // await list of posts should be 200 status
    await agent.get('/api/v1/github/login/callback?code=42').redirects(1);
    res = await agent.get('/api/v1/posts');
    expect(res.status).toEqual(200);
    expect(res.body).toEqual([...posts]);
  });

  it('allows authenticated user to make posts', async () => {
    const agent = request.agent(app);

    const post = {
      id: '3',
      post: 'This is my third post!',
    };

    // unauthenticated user tries making a post, should get 401
    let res = await agent.post('/api/v1/posts');
    expect(res.status).toEqual(401);

    // await list of posts should be 200 status
    await agent.get('/api/v1/github/login/callback?code=42').redirects(1);
    res = await agent.post('/api/v1/posts').send(post);
    expect(res.body).toEqual({ id: expect.any(String), ...post });
  });
});
