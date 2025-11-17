// import { type UserController } from "./IUserController.js";

import { eq } from "drizzle-orm";
import { db } from "../../connection.js"
import { usersTable } from "../../db/schema.js"

export const getDatausers = () => {
    const data = db.select().from(usersTable);

    return data;
}

export const getUserById = async (id: string) => {
    const data = await db.select().from(usersTable).where(eq(usersTable.id, id));
    return data[0];
}