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
      const sql = `with "insertRow" as (insert into "users" ("username", "hashedPassword", "email")
                   values($1, $2, $3)
                   returning "userId", "username", "email"
                   ),
                   "insertEvent" as (insert into "events" ("payload") values (json_build_object('type', 'newUser', 'profilePhotoUrl', ( select "profilePhotoUrl" from "users" where "username" = $1),'username', $1)) returning *)
                   select "r".*, "e".* from "insertRow" as "r", "insertEvent" as "e"
                  `;
      const params = [username, hashedPassword, email];
      return db.query(sql, params);
    })
    .then((result) => {
      const [user] = result.rows;
      const payload = { id: user.userId, username: user.username };
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
        const payload = { id: user.userId, username: user.username };
        const token = jwt.sign(payload, process.env.TOKEN_SECRET);
        res.json({ token: token, user: payload });
      });
    })
    .catch((err) => next(err));
});

app.get("/api/eggs/:eggId", (req, res, next) => {
  const eggId = Number(req.params.eggId);
  if (!Number.isInteger(eggId))
    throw new ClientError(400, "invalid request for egg");
  const sql = `
              select "e".*, "u"."username", "u"."profilePhotoUrl", "u"."userId"
              from "egg" as "e"
              join "users" as "u" using ("userId")
              where "eggId" = $1
              `;
  const params = [eggId];
  db.query(sql, params)
    .then((result) => {
      const [targetEgg] = result.rows;
      if (!targetEgg) throw new ClientError(400, "couldn't find that egg");
      targetEgg.longitude = Number(targetEgg.longitude);
      targetEgg.latitude = Number(targetEgg.latitude);
      res.status(200).json(targetEgg);
    })
    .catch((err) => next(err));
});
app.get("/api/eggs", (req, res, next) => {
  const sql = `
              select "e".* from "egg" as "e"
              where "e"."eggId" not in 
              (select "f"."eggId" from "foundEggs" as "f")
              `;
  return db
    .query(sql)
    .then((result) => {
      const egg = result.rows;
      egg.forEach((egg) => {
        egg.latitude = Number(egg.latitude);
        egg.longitude = Number(egg.longitude);
      });
      res.status(200).json(egg);
    })
    .catch((err) => next(err));
});

app.get("/api/events", (req, res, next) => {
  const sql = `
              select * 
              from "events"
              order by "events"."createdAt" DESC
              limit 30`;
  db.query(sql)
    .then((result) => {
      res.status(200).json(result.rows);
    })
    .catch((err) => next(err));
});

app.get("/api/users", (req, res, next) => {
  const sql = `
              select "username", "profilePhotoUrl", "createdAt"
              from "users"
              `;
  return db
    .query(sql)
    .then((result) => {
      const users = result.rows;
      res.json(users);
    })
    .catch((err) => next(err));
});

app.use(authorizationMiddleware);

app.post("/api/users/:username/followers", (req, res, next) => {
  const userRequestingFollowId = Number(req.user.id);
  const followingUsername = req.params.username;
  if (!followingUsername || !Number.isInteger(userRequestingFollowId))
    throw new ClientError(400, "invalid follow request");
  const sql = `with "insertRow" as
              (insert into "followers" ("followingId", "followerId") 
              select $2, (select "userId" from "users" where "username" = $1)
              where not exists (select 1 from "followers" where "followingId" = $2 and "followerId" = (select "userId" from "users" where "username" = $1))
              returning *),
              "insertNotification" as 
              (insert into "notifications" ("userId", "payload") 
              select (select "userId" from "users" where "username" = $1), json_build_object('type', 'follow', 'fromUserPhoto', ( select "profilePhotoUrl" from "users" where "userId" = $2), 'fromUserUsername', ( select "username" from "users" where "userId" = $2))
              where not exists (select 1 from "followers" where "followingId" = $2 and "followerId" = (select "userId" from "users" where "username" = $1))
              returning *)
              select "r".*, "n".* from "insertRow" as "r", "insertNotification" as "n"
              `;
  const params = [followingUsername, userRequestingFollowId];
  return db
    .query(sql, params)
    .then((result) => {
      const notifications = result.rows;
      res.status(200).json(notifications);
    })
    .catch((err) => next(err));
});

app.post("/api/profile", (req, res, next) => {
  const userId = Number(req.user.id);
  if (!Number.isInteger(userId)) throw new ClientError(400, "invalid request");
  const userDataQuery = `select "u"."email", "u"."username", "u"."profilePhotoUrl", "u"."createdAt", "u"."userId"
                         from "users" as "u"
                         where "userId" = $1`;
  const eggDataQuery = `select * from "egg" where "userId" = $1`;
  const foundEggQuery = `select "f".*, "e".* from "foundEggs" as "f" join "egg" as "e" using ("eggId")
                         where "f"."foundBy" = $1`;
  const params = [userId];
  const profileQueries = [
    db.query(userDataQuery, params),
    db.query(eggDataQuery, params),
    db.query(foundEggQuery, params),
  ];
  const profilePromises = Promise.all(profileQueries);
  profilePromises
    .then((result) => {
      const userData = result[0].rows;
      const createdEggData = result[1].rows;
      const foundEggData = result[2].rows;
      const user = {
        username: userData[0].username,
        id: userData[0].userId,
        profilePhotoUrl: userData[0].profilePhotoUrl,
        email: userData[0].email,
        createdAt: userData[0].createdAt,
        createdEggData: createdEggData,
        foundEggs: foundEggData,
      };
      res.status(200).json(user);
    })
    .catch((err) => console.error(err));
});

app.post("/api/egg", uploadsMiddleware, (req, res, next) => {
  const { id } = req.user;
  const { message, latitude, longitude } = req.body;
  if (!message) throw new ClientError(400, "message is a required field");
  const filePath = "/images/" + req.file.filename;
  const sql = `with "insertRow" as 
              (insert into "egg" ("message", "photoUrl", "longitude", "latitude", "userId")
              values ($1, $2, $3, $4, $5)
              returning *),
              "insertEvent" as 
              (insert into "events" ("payload") values (json_build_object('type', 'createdEgg', 'profilePhotoUrl', ( select "profilePhotoUrl" from "users" where "userId" = $5), 'username', ( select "username" from "users" where "userId" = $5))) returning *)
              select "r".*, "e".* from "insertRow" as "r", "insertEvent" as "e"
              `;
  const params = [
    message,
    filePath,
    Number(longitude),
    Number(latitude),
    Number(id),
  ];
  return db
    .query(sql, params)
    .then((result) => {
      const [image] = result.rows;
      res.json(image);
    })
    .catch((err) => next(err));
});

app.post("/api/found", (req, res, next) => {
  const { id } = req.user;
  const { eggId } = req.body;
  const sql = `with "insertRow" as 
              (insert into "foundEggs" ("foundBy", "eggId")
              values ($1, $2)
              returning *), 
              "insertEvent" as 
              (insert into "events" ("payload") values (json_build_object('type', 'foundEgg', 'profilePhotoUrl', ( select "profilePhotoUrl" from "users" where "userId" = $1), 'username', ( select "username" from "users" where "userId" = $1))) returning *),
              "insertNotification" as
              (insert into "notifications" ("userId", "payload")
              values ((select "userId" from "egg" where "eggId" = $2), json_build_object('type', 'foundEgg', 'fromUserPhoto', (select "profilePhotoUrl" from "users" where "userId" = $1), 'fromUserUsername', (select "username" from "users" where "userId" = $1))) returning *)
              select "r".*, "e".*, "n".* from "insertRow" as "r", "insertEvent" as "e", "insertNotification" as "n"
              `;
  const params = [id, eggId];
  return db
    .query(sql, params)
    .then((result) => {
      const [foundEgg] = result.rows;
      res.json(foundEgg);
    })
    .catch((err) => next(err));
});

app.post("/api/edit/profile", uploadsMiddleware, (req, res, next) => {
  const id = Number(req.user.id);
  if (!id) throw new ClientError(400, "invalid request");
  const filePath = "/images/" + req.file.filename;
  const sql = `update "users"
              set "profilePhotoUrl" = ($1)
              where "userId" = ($2)
              returning "profilePhotoUrl"
              `;
  const params = [filePath, id];
  return db
    .query(sql, params)
    .then((result) => {
      const [profilePhotoUrl] = result.rows;
      res.json(profilePhotoUrl);
    })
    .catch((err) => next(err));
});

app.use(errorMiddleware);

app.listen(process.env.PORT, () => {
  // eslint-disable-next-line no-console
  console.log(`express server listening on port ${process.env.PORT}`);
});
