const pool = require('../utils/pool');

module.exports = class Post {
  id;
  post;

  constructor(row) {
    this.id = row.id;
    this.post = row.post;
  }

  static insert({ post }) {
    return pool
      .query(
        `
    INSERT INTO posts (post)
    VALUES ($1)
    RETURNING
        *
    `,
        [post]
      )
      .then(({ rows }) => new Post(rows[0]));
  }

  static getAll() {
    return pool
      .query(
        `
    SELECT
        *
    FROM
        posts
    `
      )
      .then(({ rows }) => rows.map((row) => new Post(row)));
  }
};
