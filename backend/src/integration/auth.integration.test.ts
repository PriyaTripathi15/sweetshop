import request from 'supertest';
import mongoose from 'mongoose';
import app from '../app';

describe('Auth Routes Integration', () => {
  let originalUri: string | undefined;

  beforeAll(async () => {
    process.env.JWT_SECRET = process.env.JWT_SECRET || 'test_jwt_secret_key';
    // Prefer explicit test URI, else derive from MONGODB_URI
    originalUri = process.env.MONGODB_URI;
    const baseUri = process.env.MONGODB_URI_TEST
      || (originalUri ? originalUri.replace(/\/(\w+)(\?|$)/, '/$1_test$2') : 'mongodb://127.0.0.1:27017/sweetshop_test');
    await mongoose.connect(baseUri);
  });

  afterAll(async () => {
    try { await mongoose.connection.dropDatabase(); } catch {}
    await mongoose.connection.close();
  });

  afterEach(async () => {
    const db = mongoose.connection.db;
    if (!db) return;
    const collections = await db.collections();
    for (const collection of collections) {
      await collection.deleteMany({});
    }
  });

  it('should register a new user and return token', async () => {
    const res = await request(app)
      .post('/api/auth/register')
      .send({
        username: 'john_doe',
        email: 'john@example.com',
        password: 'Password123',
        role: 'user'
      })
      .expect(201);

    expect(res.body).toHaveProperty('token');
    expect(res.body).toHaveProperty('user');
    expect(res.body.user).toMatchObject({
      username: 'john_doe',
      email: 'john@example.com',
      role: 'user'
    });
  });

  it('should login an existing user and return token', async () => {
    await request(app).post('/api/auth/register').send({
      username: 'jane',
      email: 'jane@example.com',
      password: 'Secret123',
      role: 'user'
    });

    const res = await request(app)
      .post('/api/auth/login')
      .send({ email: 'jane@example.com', password: 'Secret123' })
      .expect(200);

    expect(res.body).toHaveProperty('token');
    expect(res.body.user.email).toBe('jane@example.com');
  });
});
