import { jwtAccessSetup } from "utils";
import type { Context, Cookie, Elysia } from "elysia";
import { UserRepository } from "repositories";
import { IncomingHttpHeaders } from "http2";

export const isAuthenticated = (app: Elysia) =>
  app
    .use(jwtAccessSetup)
    .derive(async ({ jwtAccess, set, request: { headers } }) => {
      const authorization = headers.get("authorization");

      if (!authorization) {
        set.status = 401;
        return {};
      }
      const token = authorization.split(" ")[1];
      if (!token) {
        set.status = 401;
        return {};
      }
      const payload = await jwtAccess.verify(token);
      if (!payload) {
        set.status = 401;
        return {};
      }

      const { id } = payload;
      const user = await UserRepository.findUserById(id);

      if (!user) {
        set.status = 401;
        return {};
      }
      return {
        user,
      };
    })
    .onBeforeHandle(({ set, user }) => {
      if (!user) {
        set.status = 401;
        return {
          success: false,
          message: "Unauthorized",
          data: null,
        };
      }
    });

export interface BeforeHandleRefreshToken {
  cookie: Record<string, Cookie<string | undefined>>;
  set: Context<IncomingHttpHeaders>["set"];
}
