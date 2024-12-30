import { jwtAccessSetup, jwtRefreshSetup } from "utils";
import { Elysia } from "elysia";
import { basicAuthModel } from "models";
import { RefreshTokenRepository } from "repositories";
import { BeforeHandleRefreshToken } from "middlewares";

export const logout = new Elysia()
  .use(basicAuthModel)
  .use(jwtAccessSetup)
  .use(jwtRefreshSetup)
  .post(
    "/logout",
    async ({ set, jwtRefresh, cookie: { refresh_token: refreshToken } }) => {
      const payload = await jwtRefresh.verify(refreshToken.value);
      if (!payload) {
        set.status = 401;
        return {
          message: "Unauthorized.",
        };
      }
      const { id } = payload;
      const existingToken = await RefreshTokenRepository.findRefreshTokenById(
        id
      );

      if (!existingToken) {
        set.status = 401;
        return {
          message: "Unauthorized.",
        };
      }
      await RefreshTokenRepository.deleteRefreshTokenById(id);
      return {
        message: "Logged out successfully.",
      };
    },
    {
      beforeHandle({
        cookie: { refresh_token: refreshToken },
        set,
      }: BeforeHandleRefreshToken) {
        if (!refreshToken) {
          set.status = 401;
          return {
            message: "Unauthorized.",
          };
        }
      },
    }
  );
