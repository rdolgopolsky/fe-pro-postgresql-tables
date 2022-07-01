import { Client } from 'pg';

export const initConnection = () => {
  const {
    POSTGRES_USER,
    POSTGRES_PASSWORD,
    POSTGRES_DB,
    POSTGRES_PORT,
    POSTGRES_HOST,
  } = process.env;
  const client = new Client({
    user: POSTGRES_USER || 'postgres',
    host: POSTGRES_HOST || 'localhost',
    database: POSTGRES_DB || 'postgres',
    password: POSTGRES_PASSWORD || 'postgres',
    port: POSTGRES_PORT || 5556,
  });

  return client;
};

export const createStructure = async () => {
  const client = initConnection();
  client.connect();

  await client.query(`
    CREATE TABLE users
    (
      id   SERIAL PRIMARY KEY,
      name VARCHAR(30),
      date TIMESTAMP DEFAULT current_timestamp
    );
  `);

  await client.query(`
    CREATE TABLE categories
    (
      id   SERIAL PRIMARY KEY,
      name VARCHAR(30)
    );
  `);

  await client.query(`
    CREATE TABLE authors
    (
      id   SERIAL PRIMARY KEY,
      name VARCHAR(30)
    );
  `);

  await client.query(`
    CREATE TABLE books
    (
      id   SERIAL PRIMARY KEY,
      title VARCHAR(30),
      userid INTEGER NOT NULL,
      authorid INTEGER NOT NULL,
      categoryid INTEGER NOT NULL,
      FOREIGN KEY (userid) REFERENCES users(id) ON DELETE CASCADE,
      FOREIGN KEY (authorid) REFERENCES authors(id) ON DELETE CASCADE,
      FOREIGN KEY (categoryid) REFERENCES categories(id) ON DELETE CASCADE
    );
  `);

  await client.query(`
    CREATE TABLE descriptions
    (
      id SERIAL PRIMARY KEY,
      description VARCHAR(10000),
      bookid INTEGER NOT NULL UNIQUE,
      FOREIGN KEY (bookid) REFERENCES books(id) ON DELETE CASCADE
    );
  `);

  await client.query(`
    CREATE TABLE reviews
    (
      id SERIAL PRIMARY KEY,
      message VARCHAR(10000),
      userid INTEGER NOT NULL,
      bookid INTEGER NOT NULL UNIQUE,
      FOREIGN KEY (userid) REFERENCES users(id) ON DELETE CASCADE,
      FOREIGN KEY (bookid) REFERENCES books(id) ON DELETE CASCADE
    );
  `);

  client.end();
};

export const createItems = async () => {
  const client = initConnection();
  client.connect();

  // Your code is here...

  client.end();
};

export const dropTables = async () => {
  const client = initConnection();
  client.connect();

  await client.query('DROP TABLE reviews;');
  await client.query('DROP TABLE descriptions;');
  await client.query('DROP TABLE books;');
  await client.query('DROP TABLE authors;');
  await client.query('DROP TABLE categories;');
  await client.query('DROP TABLE users;');

  client.end();
};
