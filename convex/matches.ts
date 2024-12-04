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

export const byId = query({
  args: {
    id: v.string(),
  },
  handler: async (ctx, args) => {
    return await ctx.db
      .query("matches")
      .withIndex("by_match_id", (q) => q.eq("id", args.id))
      .unique();
  },
});

export const store = internalMutation({
  args: {
    matches: v.array(v.object(matchSchema)),
  },
  handler: async (ctx, { matches }) => {
    await Promise.all(
      matches.map(async (match) => {
        const matchInDb = await ctx.runQuery(api.matches.byId, {
          id: match.id,
        });

        if (!matchInDb) {
          await ctx.db.insert("matches", match);
        } else {
          await ctx.db.patch(matchInDb._id, match);
        }
      }),
    );
  },
});

export const update = action({
  args: {},
  handler: async (ctx) => {
    let page: number | null = 1;

    while (page) {
      const { nextPage } = await getNewMatches(ctx, { page });
      page = nextPage;
    }
  },
});

async function getNewMatches(
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

  // Since the first matches are the most recent ones, we can assume that if there are no matches to add, we can stop
  if (!newMatchIds.length) {
    return { nextPage: null };
  }

  const matchesWithChampionRelation = newMatchIds.map(async (matchId) => {
    const { championKey, ...match } = await getMatchDetails(matchId);
    const champion = await ctx.runQuery(internal.champions.byKey, {
      key: championKey,
    });

    if (!champion) {
      throw new Error(`Champion with key ${championKey} not found`);
    }

    return {
      ...match,
      champion: champion?._id,
    };
  });

  await ctx.runMutation(internal.matches.store, {
    matches: await Promise.all(matchesWithChampionRelation),
  });

  return { nextPage };
}
