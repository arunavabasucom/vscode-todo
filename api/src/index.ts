import "reflect-metadata";
import express from "express";
import dotenv from "dotenv";
import { join } from "path";
import passport from "passport";
import jwt from "jsonwebtoken";
import { DataSource } from "typeorm";
import { __prod__ } from "./constants";
import { User } from "./Entities/User";
import { Strategy as GitHubStrategy } from "passport-github2";
import cors from "cors";

/*loading env*/
dotenv.config();
(async () => {
  /*database*/
  const connectDB = await new DataSource({
    type: "postgres",
    url: process.env.DATABASE_URL,
    logging: !__prod__,
    synchronize: !__prod__,
    entities: [join(__dirname, "./Entities/*")],
  });
  await connectDB.initialize();
  /* express */
  const app = express();
  const PORT: number = 3002;
  /*auth*/
  passport.serializeUser((user: any, done) => {
    done(null, user.accessToken);
  });
  app.use(cors({ origin: "*" }));
  app.use(passport.initialize());

  passport.use(
    new GitHubStrategy(
      {
        clientID: process.env.GITHUB_CLIENT_ID,
        clientSecret: process.env.GITHUB_CLIENT_SECRET,
        callbackURL: process.env.GITHUB_CLIENT_CALLBACK_URL,
      },
      async (_: any, __: any, profile: any, cb: any) => {
        let user = await User.findOne({ where: { githubId: profile.id } });
        console.log(profile);
        if (user) {
          console.log("find user");
          user.name = profile.displayName;
          await user.save();
        } else {
          console.log("creating user");
          user = await User.create({
            name: profile.displayName,
            githubId: profile.id,
          }).save();
        }
        cb(null, {
          accessToken: jwt.sign(
            { userId: user.id },
            process.env.ACCESS_TOKEN_SECRET,
            {
              expiresIn: "1y",
            }
          ),
        });
      }
    )
  );

  app.get("/auth/github", passport.authenticate("github", { session: false }));

  app.get(
    "/auth/github/callback",
    passport.authenticate("github", { session: false }),
    (req: any, res) => {
      res.redirect(`http://localhost:54321/auth/${req.user.accessToken}`);
    }
  );
  /*auth*/
  app.get("/", (_req, res) => {
    res.send("Hello world");
  });
  app.listen(PORT, () => {
    console.log(`listening on ${PORT}`);
  });

  app.get("/me", async (req, res) => {
    const authHeader = req.headers.authorization;

    if (!authHeader) {
      res.send({ user: null });
      return;
    }

    const token = authHeader.split(" ")[1];

    if (!token) {
      res.send({ user: null });
      return;
    }
    let userId = null;
    try {
      const payload: any = jwt.verify(token, process.env.ACCESS_TOKEN_SECRET);
      userId = payload.userId;
    } catch (error) {
      res.send({ user: null });
      return;
    }
    if (!userId) {
      console.log(`userid null`);
      res.send({ user: null });
      return;
    }
    const user = await User.find({ where: { id: userId } });
    res.send({ user });
  });
})();
