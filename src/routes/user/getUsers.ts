import Elysia from "elysia";
import { isAuthenticated } from "middlewares";
import { userModel } from "models";
import { UserRepository } from "repositories";
import { paginationResponse } from "utils";

export const getUsers = new Elysia()
  .use(isAuthenticated)
  .use(userModel)
  .get(
    "/",
    async ({ set, query: { search, page = 1, take = 10 } }) => {
      const count = await UserRepository.findUsersCount({ search });
      const users = await UserRepository.findUsers({ page, take, search });

      set.status = 200;
      return {
        success: true,
        message: "Users found",
        data: users,
        meta: paginationResponse({ total: count, page, take }),
      };
    },
    { query: "findUsersQueryModel" }
  );
