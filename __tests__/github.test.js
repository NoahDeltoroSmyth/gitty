const pool = require('../lib/utils/pool');
const setup = require('../data/setup');
const request = require('supertest');
const app = require('../lib/app');
const UserService = require('../lib/services/UserService');
jest.mock('../lib/utils/github');

describe('gitty routes', () => {
  beforeEach(() => {
    return setup(pool);
  });

  afterAll(() => {
    pool.end();
  });

  it('redirects to the github oauth page upon login', async () => {
    const req = await request(app).get('/api/v1/github/login');
    expect(req.header.location).toMatch(
      /https:\/\/github.com\/login\/oauth\/authorize\?client_id=[\w\d]+&scope=user&redirect_uri=http:\/\/localhost:7890\/api\/v1\/github\/login\/callback/i
    );
  });

  it('redirects user to dashboard after successful login', async () => {
    const req = await request
      .agent(app)
      .get('/api/v1/github/login/callback?code=42')
      .redirects(1);
    expect(req.body).toEqual({
      id: expect.any(String),
      username: 'fake_github_user',
      email: 'not-real@example.com',
      avatar: expect.any(String),
      iat: expect.any(Number),
      exp: expect.any(Number),
    });
  });

  it('allows a user to log out', async () => {
    const agent = request.agent(app);

    await UserService.create({
      username: 'fake_github_user',
      email: 'not-real@example.com',
    });

    await agent
      .post('/api/v1/github/login')
      .send({ username: 'fake_github_user', email: 'not-real@example.com' });

    const res = await agent.delete('/api/v1/github/sessions');
    expect(res.body).toEqual({
      success: true,
      message: 'Signed out successfully!',
    });
  });
});
