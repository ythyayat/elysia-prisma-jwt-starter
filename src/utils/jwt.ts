import jwt from "@elysiajs/jwt";
import Elysia, { t } from "elysia";

export const jwtAccessSetup = new Elysia({
  name: "jwtAccess",
}).use(
  jwt({
    name: "jwtAccess",
    schema: t.Object({
      id: t.String(),
    }),
    secret: Bun.env.JWT_ACCESS_SECRET!,
    exp: "5m",
  })
);

export const jwtRefreshSetup = new Elysia({
  name: "jwtRefresh",
}).use(
  jwt({
    name: "jwtRefresh",
    schema: t.Object({
      id: t.String(),
    }),
    secret: Bun.env.JWT_REFRESH_SECRET!,
    exp: "7d",
  })
);

export const refreshTokenValue = (refreshToken: string) => ({
  value: refreshToken,
  httpOnly: true,
  maxAge: 7 * 86400,
  secure: Bun.env.NODE_ENV === "production",
});
