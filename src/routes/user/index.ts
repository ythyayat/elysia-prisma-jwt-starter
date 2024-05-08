import Elysia from "elysia";
import { getUserById } from "./getUserById";
import { getUsers } from "./getUsers";

export const user = new Elysia({
  prefix: "/user",
})
  .use(getUserById)
  .use(getUsers);
