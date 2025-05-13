import { z } from 'zod';
import { router, publicProcedure } from '../trpc';
import { db } from '@/lib/db';
import { User, user } from '@/db/user';
import { eq } from 'drizzle-orm';

const userInput = z.object({
  email: z.string().email(),
  name: z.string().optional(),
});

export type UserInput = z.infer<typeof userInput>;

export const userRouter = router({
  getAll: publicProcedure.query(async () => {
    return await db.select().from(user);
  }),

  getById: publicProcedure
    .input(z.string())
    .query(async ({ input }) => {
      return await db.select().from(user).where(eq(user.id, input)).limit(1);
    }),

  create: publicProcedure
    .input(userInput)
    .mutation(async ({ input }) => {
      const values = {
        id: crypto.randomUUID(),
        name: input.name || "",
        username: input.name || "",
        email: input.email,
        emailVerified: false,
        image: null,
        createdAt: new Date(),
        updatedAt: new Date(),
        twoFactorEnabled: false,         // facultatif (nullable mais présent)
        isCoach: false,
        onBoardingComplete: false,
        stripeId: null,
        address: null,
        zipCode: null,
        city: null,
        country: null,
        lang: "fr",
        phoneNumber: null,
        emailNotifications: false,
        smsNotifications: false
      };
      
      const [newUser] = await db.insert(user).values(values).returning();
      return newUser;
    }),
}); 