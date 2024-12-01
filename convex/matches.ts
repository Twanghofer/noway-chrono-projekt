import { v } from "convex/values";
import { api, internal } from "./_generated/api";
import {
  action,
  ActionCtx,
  internalMutation,
  query,
} from "./_generated/server";
import { getMatchDetails, getMatchList } from "./lib/api";
import { matchSchema } from "./schema";

export const store = internalMutation({
  args: {
    match: v.object(matchSchema),
  },
  handler: async (ctx, { match }) => {
    const matchInDb = await ctx.runQuery(api.matches.byId, { id: match.id });

    if (!matchInDb) {
      await ctx.db.insert("matches", match);
    } else {
      await ctx.db.patch(matchInDb._id, match);
    }
  },
});

export const byId = query({
  args: {
    id: v.string(),
  },
  handler: async (ctx, args) => {
    const match = await ctx.db
      .query("matches")
      .withIndex("by_match_id", (q) => q.eq("id", args.id))
      .unique();

    return match;
  },
});

export const update = action({
  args: {},
  handler: async (ctx) => {
    let page: number | null = 1;

    while (page) {
      const { nextPage } = await updateMatches(ctx, { page });
      page = nextPage;
    }
  },
});

async function updateMatches(
  ctx: ActionCtx,
  { page = 1 }: { page?: number } = {},
) {
  const { matchIds, nextPage } = await getMatchList({ page });
  const newMatchIds: typeof matchIds = [];

  for (const matchId of matchIds) {
    const matchInDb = await ctx.runQuery(api.matches.byId, { id: matchId });

    if (!matchInDb) {
      newMatchIds.push(matchId);
    }
  }

  // Since new matches are the most recent, we can stop as soon as there are no new matches (we assume the older matches are already in the database)
  if (!newMatchIds.length) {
    return { nextPage: null };
  }

  await Promise.all(
    newMatchIds.map(async (matchId) => {
      const { championKey, ...match } = await getMatchDetails(matchId);
      const champion = await ctx.runQuery(internal.champions.byKey, {
        key: championKey,
      });

      if (!champion) {
        throw new Error(`Champion with key ${championKey} not found`);
      }

      await ctx.runMutation(internal.matches.store, {
        match: {
          ...match,
          champion: champion?._id,
        },
      });
    }),
  );

  return { nextPage };
}
