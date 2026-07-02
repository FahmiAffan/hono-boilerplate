import { BaseResponse } from "../../utils/base-response.js";
import { usersTable } from "../../db/schema.js";
import { Hono, type Context } from "hono";
import { countUserUseCase } from "./use-case/count-user.usecase.js";
import { UserRepository } from './repository/user.respository.js'
import { validator } from 'hono/validator'
export const app = new Hono();
const userRepository = new UserRepository();

app.get('/users', async (c) => {
    try {
        const res = await userRepository.findAll();
        const countUser = countUserUseCase(res);
        return new BaseResponse(c).success("Successfully get users", { users: res, length: countUser }, 200);
    } catch (err) {
        if (err instanceof Error && "cause" in err) {
            return new BaseResponse(c).error(err.message, null, 500);
        }
    }
})

app.post("/users", async (c: Context) => {
    const req = await c.req.json<typeof usersTable.$inferInsert>();
    try {
        const result = await userRepository.insertUser(req);
        return new BaseResponse(c).success("Successfully created user", result, 201);
    } catch (e) {
        console.log(e);
        if (e instanceof Error && "cause" in e) {
            return new BaseResponse(c).error(e.message, null, 500);
        } else {
            return new BaseResponse(c).error("Internal Server Error", null, 500);
        }
    }
});

app.get("/users/:id", async (c) => {
    const paramId = c.req.param("id");
    try {
        const result = await userRepository.findById(paramId);
        if (!result) {
            return new BaseResponse(c).error("User not found", null, 404);
        }
        return new BaseResponse(c).success("User found", result, 200);
    } catch (e) {
        console.log(e);
        if (e instanceof Error && "cause" in e) {
            return new BaseResponse(c).error(e.message, null, 400);
        } else {
            return new BaseResponse(c).error("Internal Server Error", null, 500);
        }
    }
});

app.put("/users/:id", validator('json', (value: any, c: Context) => {
    if (!value || typeof value !== 'object') {
        return new BaseResponse(c).error("Invalid request body", null, 400);
    }
    return true;
}), async (c) => {
    const paramId = c.req.param("id");
    const req = await c.req.json<typeof usersTable.$inferInsert>();
    try {
        const result = await userRepository.updateUser(paramId, req);
        if (!result) {
            return new BaseResponse(c).error("User not found", null, 404);
        }
        return new BaseResponse(c).success("User updated successfully", result, 200);
    } catch (e) {
        console.log(e);
        if (e instanceof Error && "cause" in e) {
            return new BaseResponse(c).error(e.message, null, 400);
        } else {
            return new BaseResponse(c).error("Internal Server Error", null, 500);
        }
    }
});

app.delete("/users/:id", async (c) => {
    const paramId = c.req.param("id");
    try {
        const result = await userRepository.delete(paramId);
        if (result) {
            return new BaseResponse(c).success(`Successfully deleted user with name ${result.name}`, null , 200);
        }
        return c.json({ error: "User not found" }, 404);
    } catch (e) {
        console.log(e);
        if (e instanceof Error && "cause" in e) {
            return new BaseResponse(c).error(e.message);
        } else {
            return new BaseResponse(c).error("Internal Server Error");
        }
    }
});
