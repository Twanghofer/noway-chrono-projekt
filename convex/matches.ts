import { v } from "convex/values";
import { getMatchDetails, getMatchListByPuuid } from "../lib/api";
import { nowaySummonerDetails } from "../lib/constants";
import { api } from "./_generated/api";
import { action, internalMutation, query } from "./_generated/server";
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
    const matchIds = await getMatchListByPuuid(nowaySummonerDetails.puuid);

    await Promise.all(
      matchIds.map(async (matchId) => {
        const { ...match } = await getMatchDetails(matchId);
        console.log(match);

        /*  await ctx.runMutation(internal.matches.store, { match: {
          ...match,
          champion: championId as Id<'champions'>,
        } }); */
      }),
    );
  },
});
