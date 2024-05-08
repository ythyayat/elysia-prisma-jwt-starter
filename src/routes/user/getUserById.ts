import Elysia from "elysia";
import { isAuthenticated } from "middlewares";
import { UserRepository } from "repositories";

export const getUserById = new Elysia()
  .use(isAuthenticated)
  .get("/:id", async ({ params: { id }, set }) => {
    const user = await UserRepository.findUserById(id);
    set.status = 200;
    return {
      success: true,
      message: "User found",
      data: user,
    };
  });
