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
    database: POSTGRES_DB || 'homework_psql',
    password: POSTGRES_PASSWORD || 'postgress',
    port: POSTGRES_PORT || 5432,
  });

  return client;
};

export const createStructure = async () => {
  const client = initConnection();
  client.connect();

  await client.query(`
      CREATE TABLE users (
         id serial PRIMARY KEY,
         name VARCHAR(30) NOT NULL,
         date TIMESTAMP DEFAULT now()
      );
  `);

  await client.query(`
      CREATE TABLE categories (
         id serial PRIMARY KEY,
         name VARCHAR(30) NOT NULL
      );
  `);

  await client.query(`
      CREATE TABLE authors (
         id serial PRIMARY KEY,
         name VARCHAR(30) NOT NULL
      );
  `);

  await client.query(`
      CREATE TABLE books (
         id serial PRIMARY KEY,
         title VARCHAR(30) NOT NULL,
         userid INTEGER NOT NULL,
         FOREIGN KEY (userid) REFERENCES users(id) ON DELETE CASCADE,
         authorid INTEGER NOT NULL,
         FOREIGN KEY (authorid) REFERENCES authors(id) ON DELETE CASCADE,
         categoryid INTEGER NOT NULL,
         FOREIGN KEY (categoryid) REFERENCES categories(id) ON DELETE CASCADE
      );
  `);

  await client.query(`
      CREATE TABLE descriptions  (
         id serial PRIMARY KEY,
         description VARCHAR(10000) NOT NULL,
         bookid INTEGER UNIQUE NOT NULL,
         FOREIGN KEY (bookid) REFERENCES books(id) ON DELETE CASCADE
      );
  `);

  await client.query(`
      CREATE TABLE reviews  (
         id serial PRIMARY KEY,
         message VARCHAR(10000) NOT NULL,
         userid INTEGER NOT NULL,
         FOREIGN KEY (userid) REFERENCES users(id) ON DELETE CASCADE,
         bookid INTEGER NOT NULL,
         FOREIGN KEY (bookid) REFERENCES books(id) ON DELETE CASCADE
      );
  `);

  client.end();
};

export const createItems = async () => {
  const client = initConnection();
  client.connect();

  await client.query(`
      INSERT INTO users (name) VALUES ('Roman');
   `);

  await client.query(`
      INSERT INTO categories (name) VALUES ('Dystopia');
   `);

  await client.query(`
      INSERT INTO authors (name) VALUES ('George Orwell');
   `);

  await client.query(`
      INSERT INTO books (title, userid, authorid, categoryid) VALUES ('1984 ', 1, 1, 1);
   `);

  await client.query(`
      INSERT INTO descriptions (description, bookid)
      VALUES ('"1984" is a book that amazes, shocks, breaks your consciousness, destroys stereotypes. A novel-dystopia, on the pages of which you will not want to find yourself! Surprisingly, the realities of the work, written more than 60 years ago, coincide in detail with what we observe today.', 1);
   `);

  await client.query(`
      INSERT INTO reviews (message, userid, bookid)
      VALUES ('An incredible book. Must be read by everyone. And the last part, where it talks about the meaning of language, its amazing...', 1, 1);
   `);

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
