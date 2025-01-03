import { Elysia } from "elysia";
import cookie from "@elysiajs/cookie";
import { randomUUID } from "crypto";
import { RefreshTokenRepository, UserRepository } from "repositories";
import { registerAuthModel } from "models";
import { jwtAccessSetup, jwtRefreshSetup, refreshTokenValue } from "utils";

export const register = new Elysia()
  .use(registerAuthModel)
  .use(cookie())
  .use(jwtAccessSetup)
  .use(jwtRefreshSetup)
  .post(
    "/register",
    async ({
      body,
      set,
      jwtAccess,
      jwtRefresh,
      cookie: { refresh_token },
      headers,
    }) => {
      const existingUser = await UserRepository.findUserByEmail(body.email);
      if (existingUser) {
        set.status = 400;
        return {
          message: "Email already in use.",
        };
      }
      const savedPassword = await Bun.password.hash(body.password);
      const refreshId = randomUUID();
      const refreshToken = await jwtRefresh.sign({
        id: refreshId,
      });
      const hashedToken = new Bun.CryptoHasher("sha512")
        .update(refreshToken)
        .digest("hex");

      const user = await UserRepository.createUser({
        name: body.name,
        email: body.email,
        password: savedPassword,
      });

      await RefreshTokenRepository.createRefreshToken({
        hashedToken,
        id: refreshId,
        userId: user.id,
        userAgent: String(headers["user-agent"]),
      });

      const accessToken = await jwtAccess.sign({
        id: String(user.id),
      });

      refresh_token.set(refreshTokenValue(refreshToken));

      return {
        accessToken,
      };
    },
    {
      body: "registerAuthModel",
    }
  );
