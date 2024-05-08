import { Elysia } from "elysia";
import { auth } from "./routes";

const app = new Elysia()
  .group("/api", (app) => app.group("/v1", (app) => app.use(auth)))
  .get("/", () => "Hello Elysia")
  .listen(Bun.env.PORT || 3000);

console.log(
  `🦊 Elysia is running at http://${app.server?.hostname}:${app.server?.port}`
);
