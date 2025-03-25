import { z } from 'zod';
import { router, publicProcedure } from '../trpc';
import { db } from '@/db';
import { users } from '@/db/schema';
import { eq } from 'drizzle-orm';

const userInput = z.object({
  email: z.string().email(),
  name: z.string().optional(),
});

export type UserInput = z.infer<typeof userInput>;

export const userRouter = router({
  getAll: publicProcedure.query(async () => {
    return await db.select().from(users);
  }),

  getById: publicProcedure
    .input(z.string())
    .query(async ({ input }) => {
      return await db.select().from(users).where(eq(users.id, input)).limit(1);
    }),

  create: publicProcedure
    .input(userInput)
    .mutation(async ({ input }) => {
      const [user] = await db.insert(users).values(input).returning();
      return user;
    }),
}); 