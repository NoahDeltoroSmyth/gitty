const pool = require('../utils/pool');

module.exports = class Post {
  id;
  post;

  constructor(row) {
    this.id = row.id;
    this.post = row.post;
  }

  //   static async insert({ post }) {
  //     const { rows } = await pool.query(
  //       `
  //         INSERT INTO (posts)
  //         VALUES ($1)
  //         RETURNING
  //            *
  //           `,
  //       [post]
  //     );
  //     return new Post(rows[0]);
  //   }

  static async getAll() {
    const { rows } = await pool.query(
      `
    SELECT
        *
    FROM
        posts
    `
    );
    return rows.map((row) => new Post(row));
  }
};
