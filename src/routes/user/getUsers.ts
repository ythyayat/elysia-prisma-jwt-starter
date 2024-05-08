import Elysia from "elysia";
import { isAuthenticated } from "middlewares";
import { UserRepository } from "repositories";

export const getUsers = new Elysia()
  .use(isAuthenticated)
  .get("/", async ({ set }) => {
    const users = await UserRepository.findUsers();
    set.status = 200;
    return {
      success: true,
      message: "Users found",
      data: users,
    };
  });
