import cookie from "@elysiajs/cookie";
import { Elysia } from "elysia";
import { randomUUID } from "crypto";
import { RefreshTokenRepository, UserRepository } from "repositories";
import { jwtAccessSetup, jwtRefreshSetup, refreshTokenValue } from "utils";
import { BeforeHandleRefreshToken } from "middlewares";

export const refresh = new Elysia()
  .use(cookie())
  .use(jwtRefreshSetup)
  .use(jwtAccessSetup)
  .post(
    "/refresh",
    async ({
      set,
      jwtRefresh,
      jwtAccess,
      cookie: { refresh_token: refreshToken },
      headers,
    }) => {
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
      if (refreshToken.value !== undefined) {
        const hashedToken = new Bun.CryptoHasher("sha512")
          .update(refreshToken.value)
          .digest("hex");
        if (hashedToken !== existingToken.hashedToken) {
          set.status = 401;
          return {
            message: "Unauthorized.",
          };
        }
      }

      const user = await UserRepository.findUserById(existingToken.userId);
      if (!user) {
        set.status = 401;
        return {
          message: "Unauthorized.",
        };
      }

      await RefreshTokenRepository.deleteRefreshTokenById(id);

      // wait
      const refreshId = randomUUID();
      const newRefreshToken = await jwtRefresh.sign({
        id: refreshId,
      });
      const hashedRefreshToken = new Bun.CryptoHasher("sha512")
        .update(newRefreshToken)
        .digest("hex");

      await RefreshTokenRepository.createRefreshToken({
        hashedToken: hashedRefreshToken,
        id: refreshId,
        userId: user.id,
        userAgent: String(headers["user-agent"]),
      });

      const accessToken = await jwtAccess.sign({
        id: String(user.id),
      });
      refreshToken.set(refreshTokenValue(newRefreshToken));
      return {
        accessToken,
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
