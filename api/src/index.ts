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
      res.send(req.user);
      // res.redirect(`http://localhost:54321/auth/${req.user.accessToken}`);
    }
  );
  /*auth*/

  app.get("/", (_req, res) => {
    res.send("Hello world");
  });
  app.listen(PORT, () => {
    console.log(`listening on ${PORT}`);
  });
})();
