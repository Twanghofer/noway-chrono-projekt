import { v } from "convex/values";
import { api, internal } from "./_generated/api";
import { Doc } from "./_generated/dataModel";
import { internalQuery, query } from "./_generated/server";

export const hasWonWithChampion = internalQuery({
  args: {
    championId: v.id("champions"),
  },
  handler: async (ctx, { championId }) => {
    return !!(await ctx.db
      .query("matches")
      .withIndex("by_champion", (q) => q.eq("champion", championId))
      .filter((q) => q.eq(q.field("win"), true))
      .first());
  },
});

export const currentChampion = query({
  args: {},
  handler: async (ctx) => {
    const champions = await ctx.runQuery(api.champions.list);

    let firstChampionWithoutWin: Doc<"champions"> | undefined;

    for (const champion of champions) {
      const hasWonWithChampion = await ctx.runQuery(
        internal.challenge.hasWonWithChampion,
        {
          championId: champion._id,
        },
      );

      if (!hasWonWithChampion) {
        firstChampionWithoutWin = champion;
        break;
      }
    }

    return firstChampionWithoutWin ?? null;
  },
});

export const upcomingChampions = query({
  args: {},
  handler: async (ctx) => {
    const COUNT = 3;

    const champions = await ctx.runQuery(api.champions.list);

    const firstChampionWithoutWin = await ctx.runQuery(
      api.challenge.currentChampion,
    );

    const championsWithoutWin: Doc<"champions">[] = [];

    for (const champion of champions) {
      if (champion._id === firstChampionWithoutWin?._id) {
        continue;
      }

      const hasWonWithChampion = await ctx.runQuery(
        internal.challenge.hasWonWithChampion,
        {
          championId: champion._id,
        },
      );

      if (!hasWonWithChampion) {
        championsWithoutWin.push(champion);

        if (championsWithoutWin.length === COUNT) {
          break;
        }
      }
    }

    return championsWithoutWin;
  },
});
