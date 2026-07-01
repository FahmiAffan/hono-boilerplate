import { BaseResponse } from "../../utils/base-response.js";
import { getDb } from "../../config/connection.js";
import { usersTable } from "../../db/schema.js";
import { eq } from "drizzle-orm";
import { Hono, type Context } from "hono";
import { countUserUseCase } from "./use-case/count-user.usecase.js";

export const app = new Hono();

app.get('/users', async (c) => {
    try {
        const db = getDb();
        const res = await db.select().from(usersTable);
        const countUser = countUserUseCase(res);
        return new BaseResponse(c).success("Successfully get users", { users: res, length: countUser }, 200);
    } catch (err) {
        return c.json({ error: err, message: "error" })
    }
})

app.post("/users", async (c: Context) => {
    const req = await c.req.json<typeof usersTable.$inferInsert>();
    const db = getDb();
    try {
        const result = await db.insert(usersTable).values(req).returning();
        return new BaseResponse(c).success("Successfully get users", result, 200);
    } catch (e) {
        console.log(e);
        if (e instanceof Error && "cause" in e) {
            return c.json(e.message, 500)
        } else {
            return c.json("Internal Server Error", 500);
        }
    }
});

app.get("/users/:id", async (c) => {
    const paramId = c.req.param("id");
    const db = getDb();
    try {
        const result = await db
            .select()
            .from(usersTable)
            .where(eq(usersTable.id, paramId));
        return c.json(result[0]);
    } catch (e) {
        console.log(e);
        if (e instanceof Error && "cause" in e) {
            return c.json(e.message, 400);
        } else {
            return c.json("Internal Server Error", 500);
        }
    }
});

app.put("/users/:id", async (c) => {
    const paramId = c.req.param("id");
    const req = await c.req.json<typeof usersTable.$inferInsert>();
    const db = getDb();
    try {
        const result = await db
            .select()
            .from(usersTable)
            .where(eq(usersTable.id, paramId));
        return c.json(result);
    } catch (e) {
        console.log(e);
        if (e instanceof Error && "cause" in e) {
            return c.json(e.message, 400);
        } else {
            return c.json("Internal Server Error", 500);
        }
    }
});

app.delete("/users/:id", async (c) => {
    const paramId = c.req.param("id");
    const db = getDb();
    try {
        const result = await db
            .delete(usersTable)
            .where(eq(usersTable.id, paramId));
        if (result) {
            const baseresponse = [
                {
                    message: `Data with name successfully deleted`,
                    status: 201,
                },
            ];
            return c.json(baseresponse);
        }
    } catch (e) {
        console.log(e);
        if (e instanceof Error && "cause" in e) {
            return c.json(e.message, 400);
        } else {
            return c.json("Internal Server Error", 500);
        }
    }
});
