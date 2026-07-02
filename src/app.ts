import "dotenv/config";

import { serve } from "@hono/node-server";
import { Hono, type Context } from "hono";
import { usersTable } from "./db/schema.js";
import { initDb } from "./config/connection.js";
import { eq } from "drizzle-orm";
import { cors } from "hono/cors";
import { csrf } from "hono/csrf";
import { jwt } from "hono/jwt";
import type { JwtVariables } from "hono/jwt";
import { timeout } from "hono/timeout";
import { LoggerServices } from "./utils/logger.js";
import { logger as HonoLog } from "hono/logger"
import main from "./routes/index.js";

type Variables = JwtVariables;

export const app = new Hono<{ Variables: Variables }>();
const logger = new LoggerServices();

const rawWhiteList = process.env.WHITELIST_URL
  ? process.env.WHITELIST_URL
  : "http://localhost:8080/";

app.use('*', HonoLog());
app.route("", main);
// app.use(csrf({ origin: rawWhiteList }));

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

app.onError(async (err, handler) => {
  const jsonInput = await handler.req.json().catch(() => null);
  if(!jsonInput || typeof jsonInput !== 'object') {
    return handler.json({ message: "Invalid JSON input" }, 500);
  }
  return handler.json({ message: "Internal Server Error", error: err.stack }, 500);
})

serve(
  {
    fetch: app.fetch,
    port: 3000,
  },
  async (info) => {
    try {
      console.log("   ___                        _               \r\n  \/ __\\__  _ __ __ _  ___    \/_\\  _ __  _ __  \r\n \/ _\\\/ _ \\| \'__\/ _` |\/ _ \\  \/\/_\\\\| \'_ \\| \'_ \\ \r\n\/ \/ | (_) | | | (_| |  __\/ \/  _  \\ |_) | |_) |\r\n\\\/   \\___\/|_|  \\__, |\\___| \\_\/ \\_\/ .__\/| .__\/ \r\n               |___\/             |_|   |_|    ");

      await initDb();

      logger.succes("🚀 Server is ready");
      logger.succes(`Listening To http://localhost:${info.port}`);
    } catch (err) {
      logger.error(`💥 Server failed to start: ${err}`);
      process.exit();
    }
  }
);
