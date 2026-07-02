import { usersTable as User} from '../../../db/schema.js'

export interface IUserRepository {
    findAll(): Promise<Array<typeof User.$inferSelect>>;
    findById(id: string): Promise<typeof User.$inferSelect | null>;
    findByEmail(email: string): Promise<typeof User.$inferSelect | null>;
    insertUser(req: typeof User.$inferInsert): Promise<typeof User.$inferSelect | null>;
    updateUser(id: string, userData: Partial<typeof User.$inferInsert>): Promise<typeof User.$inferSelect | null>;
    delete(id: string): Promise<typeof User.$inferSelect | null>;
}