import "dotenv/config";

import { serve } from "@hono/node-server";
import { Hono } from "hono";
import { usersTable } from "./db/schema.js";
import { db } from "./connection.js";
import { seed } from "drizzle-seed";
import { eq } from "drizzle-orm";
import { getUserById } from "./controller/user/UserController.js";
import { cors } from "hono/cors";
import { csrf } from "hono/csrf";
import { jwt } from "hono/jwt";
import type { JwtVariables } from "hono/jwt";
import { timeout } from "hono/timeout";
import { jsxRenderer } from "hono/jsx-renderer";
import UsersPage from "./page/Users.js";
import { serveStatic } from "@hono/node-server/serve-static";

type Variables = JwtVariables;

export const app = new Hono<{ Variables: Variables }>();

const rawWhiteList = process.env.WHITELIST_URL
  ? process.env.WHITELIST_URL
  : "http://localhost:8080/";

app.use(csrf({ origin: rawWhiteList }));

app.use("*", jsxRenderer());

// app.use('/api/*', cors({
//   origin: rawWhiteList,
//   allowHeaders: ['X-Custom-Header', 'Upgrade-Insecure-Requests'],
//   allowMethods: ['POST', 'GET', 'OPTIONS'],
//   exposeHeaders: ['Content-Length', 'X-Kuma-Revision'],
//   maxAge: 600,
//   credentials: true,
// }),
//   jwt({
//     secret: process.env.JWT_SECRET ? process.env.JWT_SECRET : 'root'
//   }),
//   timeout(5000)
// );

app.use("./*", serveStatic({ root: "./" }));
app.use("./style/*", serveStatic({ root: "./" }));

app.use("*", async (c, next) => {
  c.setRenderer((content) => {
    return c.html(
      <html>
        <head>
          <link rel="stylesheet" href="./style/main.css" />
        </head>
        <body>{content}</body>
        <script src="https://cdn.jsdelivr.net/npm/@tailwindcss/browser@4"></script>
      </html>
    );
  });
  await next();
});

app.get("/api/users", async (c) => {
  const data = await db.select().from(usersTable);
  console.log(typeof data);
  return c.render(UsersPage());
});

app.post("/users", async (c) => {
  const req = await c.req.json<typeof usersTable.$inferInsert>();
  try {
    const result = await db.insert(usersTable).values(req).returning();
    return c.json(result);
  } catch (e) {
    console.log(e);
    if (e instanceof Error && "cause" in e) {
      // console.log(e.cause);
      return c.json(e.message, 400);
    } else {
      return c.json("Internal Server Error", 500);
    }
  }
});

app.get("/users/:id", async (c) => {
  const paramId = c.req.param("id");
  console.log(paramId);
  try {
    const result = await db
      .select()
      .from(usersTable)
      .where(eq(usersTable.id, paramId));
    // console.log(result);
    return c.json(result[0]);
    // return c.json({params_id : paramId});
  } catch (e) {
    console.log(e);
    if (e instanceof Error && "cause" in e) {
      // console.log(e.cause);
      return c.json(e.message, 400);
    } else {
      return c.json("Internal Server Error", 500);
    }
  }
});

app.put("/users/:id", async (c) => {
  const paramId = c.req.param("id");
  const req = await c.req.json<typeof usersTable.$inferInsert>();
  try {
    const result = await db
      .select()
      .from(usersTable)
      .where(eq(usersTable.id, paramId));
    return c.json(result);
  } catch (e) {
    console.log(e);
    if (e instanceof Error && "cause" in e) {
      // console.log(e.cause);
      return c.json(e.message, 400);
    } else {
      return c.json("Internal Server Error", 500);
    }
  }
});

app.delete("/users/:id", async (c) => {
  const paramId = c.req.param("id");
  const selectedUser = await getUserById(paramId);
  try {
    const result = await db
      .delete(usersTable)
      .where(eq(usersTable.id, paramId));
    if (result) {
      const baseresponse = [
        {
          message: `Data with name ${selectedUser?.name} successfully deleted`,
          status: 201,
        },
      ];
      return c.json(baseresponse);
    }
  } catch (e) {
    console.log(e);
    if (e instanceof Error && "cause" in e) {
      // console.log(e.cause);
      return c.json(e.message, 400);
    } else {
      return c.json("Internal Server Error", 500);
    }
  }
});

serve(
  {
    fetch: app.fetch,
    port: 3000,
  },
  async (info) => {
    // await seed(db, { usersTable });
    console.log(`Server is running on http://localhost:${info.port}`);
  }
);
