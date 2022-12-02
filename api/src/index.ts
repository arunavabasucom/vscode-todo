import express from "express";
import dotenv from "dotenv";
import { join } from "path";
import "reflect-metadata";
import { DataSource } from "typeorm";
import { __prod__ } from "./constants";
import { User } from "./Entities/User";

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
  const user = await User.create({ name: "Alexender" }).save();
  console.log({ user });

  /* express */
  const app = express();
  const PORT: number = 3002;
  app.get("/", (_req, res) => {
    res.send("Hello world");
  });
  app.listen(PORT, () => {
    console.log(`listening on ${PORT}`);
  });
})();
