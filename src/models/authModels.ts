import Elysia, { t } from "elysia";

export const basicAuthModel = new Elysia().model({
  basicAuthModel: t.Object({
    email: t.String(),
    password: t.String(),
  }),
});

export const registerAuthModel = new Elysia().model({
  registerAuthModel: t.Object({
    name: t.String(),
    email: t.String(),
    password: t.String(),
  }),
});
