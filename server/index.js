require("dotenv/config");
const pg = require("pg");
const path = require("path");
const argon2 = require("argon2");
const express = require("express");
const jwt = require("jsonwebtoken");
const ClientError = require("./client-error");
const errorMiddleware = require("./error-middleware");
const authorizationMiddleware = require("./authorization-middleware");
const uploadsMiddleware = require("./uploadsMiddleware");
const app = express();

const publicPath = path.join(__dirname, "public");
const staticMiddleware = express.static(publicPath);
app.use(staticMiddleware);

const jsonMiddleware = express.json();

app.use(jsonMiddleware);

const db = new pg.Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: {
    rejectUnauthorized: false,
  },
});

app.post("/api/auth/sign-up", (req, res, next) => {
  const { username, password, email } = req.body;
  if (!username || !password || !email) {
    throw new ClientError(
      400,
      "username, email, and password are required fields"
    );
  }
  argon2
    .hash(password)
    .then((hashedPassword) => {
      const sql = `
    insert into "users" ("username", "hashedPassword", "email")
    values($1, $2, $3)
    returning "Id", "username", "email"
    `;
      const params = [username, hashedPassword, email];
      return db.query(sql, params);
    })
    .then((result) => {
      const [user] = result.rows;
      const payload = { id: user.Id, username: user.username };
      const token = jwt.sign(payload, process.env.TOKEN_SECRET);
      res.json({ token: token, user: payload });
    })
    .catch((err) => next(err));
});

app.post("/api/auth/sign-in", (req, res, next) => {
  const { username, password } = req.body;
  if (!username || !password) throw new ClientError(401, "invalid login");
  const sql = `
  select *
  from "users"
  where "username" = $1
  `;
  const params = [username];
  db.query(sql, params)
    .then((result) => {
      const [user] = result.rows;
      if (!user) throw new ClientError(401, "invalid login");
      const { hashedPassword } = user;
      return argon2.verify(hashedPassword, password).then((isMatching) => {
        if (!isMatching) throw new ClientError(401, "invalid login");
        const payload = { id: user.Id, username: user.username };
        const token = jwt.sign(payload, process.env.TOKEN_SECRET);
        res.json({ token: token, user: payload });
      });
    })
    .catch((err) => next(err));
});

app.get("/api/eggs", (req, res, next) => {
  const sql = `
              select *
              from "egg"
              `;
  return db
    .query(sql)
    .then(res)
    .then((result) => res.status(200).json(result.rows))
    .catch((err) => next(err));
});

app.use(authorizationMiddleware);

app.post("/api/egg", uploadsMiddleware, (req, res, next) => {
  const { id } = req.user;
  const { message, latitude, longitude } = req.body;
  if (!message) throw new ClientError(400, "message is a required field");
  const filePath = "/images/" + req.file.filename;
  const sql = `insert into "egg" ("message", "photoUrl", "longitude", "latitude", "creator")
  values ($1, $2, $3, $4, $5)
  returning *
  `;
  const params = [message, filePath, longitude, latitude, id];
  return db
    .query(sql, params)
    .then((result) => {
      const [image] = result.rows;
      res.json(image);
    })
    .catch((err) => next(err));
});

app.use(errorMiddleware);

app.listen(process.env.PORT, () => {
  // eslint-disable-next-line no-console
  console.log(`express server listening on port ${process.env.PORT}`);
});
