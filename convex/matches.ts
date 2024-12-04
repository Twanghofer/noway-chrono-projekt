import { v } from "convex/values";
import { api, internal } from "./_generated/api";
import {
  action,
  ActionCtx,
  internalMutation,
  query,
} from "./_generated/server";
import { nowaySummonerDetails } from "./lib/constants";
import {
  getMatchDetails,
  getMatchList,
  getRiotAccountDetails,
} from "./lib/riotApi";
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
    const { puuid } = await getRiotAccountDetails(nowaySummonerDetails);

    let page: number | null = 1;

    while (page) {
      const { nextPage } = await getNewMatches(puuid, ctx, { page });
      page = nextPage;
    }
  },
});

async function getNewMatches(puuid: string, ctx: ActionCtx, { page = 1 } = {}) {
  const { matchIds, nextPage } = await getMatchList(puuid, { page });
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
    const matchDetails = await getMatchDetails(matchId);

    const playerParticipation = matchDetails.info.participants.find(
      (p) => p.puuid === puuid,
    );

    if (!playerParticipation) {
      throw new Error("Player not found in match");
    }

    const championKey = String(playerParticipation?.championId);

    const champion = await ctx.runQuery(internal.champions.byKey, {
      key: championKey,
    });

    if (!champion) {
      throw new Error(`Champion with key ${championKey} not found`);
    }

    return {
      id: matchDetails.metadata.matchId,
      timestamp: matchDetails.info.gameCreation,
      champion: champion?._id,
      win: !!playerParticipation?.win,
      playerStats: {
        kills: playerParticipation?.kills,
        deaths: playerParticipation?.deaths,
        assists: playerParticipation?.assists,
      },
    };
  });

  await ctx.runMutation(internal.matches.store, {
    matches: await Promise.all(matchesWithChampionRelation),
  });

  return { nextPage };
}
