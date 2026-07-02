import { type IUserRepository } from './iuser.respository.js'
import { usersTable as User } from '../../../db/schema.js'
import { getDb } from '../../../config/connection.js'
import { eq } from 'drizzle-orm'

export class UserRepository implements IUserRepository {
    constructor() { }

    async findAll() {
        const users = await getDb().select().from(User);
        return users
    }
    async findById(id : string) {
        const user = await getDb().select().from(User).where(eq(User.id, id))
        return user[0] || null
    }
    async findByEmail(email: string) {
        const user = await getDb().select().from(User).where(eq(User.email, email))
        return user[0] || null
    }
    async insertUser(req: typeof User.$inferInsert) {
        const user = await getDb().insert(User).values(req).returning();
        return user[0] || null
    }
    async updateUser(id: string, userData: Partial<typeof User.$inferInsert>) {
        const user = await getDb().update(User).set(userData).where(eq(User.id, id)).returning()
        return user[0] || null
    }
    async delete(id: string) {
        try {
            const data = await getDb().delete(User).where(eq(User.id, id)).returning();
            return data[0] || null;
        } catch (e) {
            throw e
        }
    }
}