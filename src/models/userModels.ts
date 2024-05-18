import Elysia, { t } from "elysia";

export const userModel = new Elysia().model({
  findUsersQueryModel: t.Object({
    search: t.Optional(t.String()),
    take: t.Optional(t.Numeric()),
    page: t.Optional(t.Numeric()),
  }),
});
