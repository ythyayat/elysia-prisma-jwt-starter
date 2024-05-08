import { Elysia } from "elysia";
import { randomUUID } from "crypto";
import { RefreshTokenRepository, UserRepository } from "repositories";
import cookie from "@elysiajs/cookie";
import { basicAuthModel } from "models";
import { jwtAccessSetup, jwtRefreshSetup, refreshTokenValue } from "utils";

export const login = new Elysia()
  .use(basicAuthModel)
  .use(jwtAccessSetup)
  .use(jwtRefreshSetup)
  .use(cookie())
  .post(
    "/login",
    async ({ body, set, jwtAccess, jwtRefresh, cookie: { refresh_token } }) => {
      const existingUser = await UserRepository.findUserByEmail(body.email);
      if (!existingUser) {
        set.status = 403;
        return {
          message: "Invalid credentials.",
        };
      }
      const validPassword = await Bun.password.verify(
        body.password,
        existingUser.password
      );
      if (!validPassword) {
        set.status = 403;
        return {
          message: "Invalid credentials.",
        };
      }
      const payload = await jwtRefresh.verify(refresh_token.value);
      if (payload) {
        const { id } = payload;
        try {
          const existingToken =
            await RefreshTokenRepository.findRefreshTokenById(id);
          if (existingToken) {
            await RefreshTokenRepository.deleteRefreshTokenById(id);
          }
        } catch (e) {}
      }
      const refreshId = randomUUID();
      const refreshToken = await jwtRefresh.sign({
        id: refreshId,
      });
      const hashedToken = new Bun.CryptoHasher("sha512")
        .update(refreshToken)
        .digest("hex");

      await RefreshTokenRepository.createRefreshToken({
        hashedToken,
        id: refreshId,
        userId: existingUser.id,
      });

      refresh_token.set(refreshTokenValue(refreshToken));

      const accessToken = await jwtAccess.sign({
        id: String(existingUser.id),
      });
      return {
        accessToken,
      };
    },
    {
      body: "basicAuthModel",
    }
  );
