import { and, eq } from "drizzle-orm";
import { Database, schema } from "../db";

export const recordApiUsage = async (
  db: Database,
  userId: number,
  endpoint: string,
  geminiTokensUsed: number = 0
) => {
  const today = new Date().toISOString().split("T")[0];

  const existing = await db
    .select()
    .from(schema.apiUsage)
    .where(
      and(
        eq(schema.apiUsage.userId, userId),
        eq(schema.apiUsage.endpoint, endpoint),
        eq(schema.apiUsage.date, today)
      )
    )
    .limit(1)
    .then((rows) => rows[0]);

  if (existing) {
    await db
      .update(schema.apiUsage)
      .set({
        requestCount: existing.requestCount + 1,
        geminiTokensUsed: existing.geminiTokensUsed + geminiTokensUsed,
      })
      .where(eq(schema.apiUsage.id, existing.id));
  } else {
    await db.insert(schema.apiUsage).values({
      userId,
      endpoint,
      requestCount: 1,
      geminiTokensUsed,
      date: today,
    });
  }
};

