import { v } from "convex/values";
import { internal } from "./_generated/api";
import {
  action,
  internalMutation,
  internalQuery,
  query,
} from "./_generated/server";
import { DATA_DRAGON_BASE_URL, fetchHelper } from "./lib/api";
import { championReleaseDates } from "./lib/constants";
import { championSchema } from "./schema";

type DataDragonChampionAPIResponse = {
  type: string;
  format: string;
  version: string;
  data: {
    [id: string]: {
      name: string;
      id: string;
      key: string;
      image: {
        full: string;
      };
    };
  };
};

export const listWithStats = query({
  args: {},
  handler: async (ctx) => {
    const champions = await ctx.db
      .query("champions")
      .filter((q) => q.eq(q.field("isHidden"), false || undefined))
      .collect();

    const sortedChampions = champions.sort(
      (a, b) =>
        new Date(a.releaseDate).getTime() - new Date(b.releaseDate).getTime(),
    );

    return await Promise.all(
      sortedChampions.map(async (champion) => {
        const matchesWithChampion = await ctx.db
          .query("matches")
          .withIndex("by_champion", (q) => q.eq("champion", champion._id))
          .collect();

        return {
          ...champion,
          matches: matchesWithChampion.sort(
            (a, b) => b.timestamp - a.timestamp,
          ),
          wins: matchesWithChampion.filter((match) => match.win).length,
          losses: matchesWithChampion.filter((match) => !match.win).length,
        };
      }),
    );
  },
});

export const byKey = internalQuery({
  args: {
    key: v.string(),
  },
  handler: async (ctx, args) => {
    return await ctx.db
      .query("champions")
      .withIndex("by_champion_key", (q) => q.eq("key", args.key))
      .unique();
  },
});

export const store = internalMutation({
  args: {
    champions: v.array(v.object(championSchema)),
  },
  handler: async (ctx, args) => {
    await Promise.all(
      args.champions.map(async (champion) => {
        const championInDb = await ctx.db
          .query("champions")
          .withIndex("by_champion_id", (q) => q.eq("id", champion.id))
          .unique();

        if (!championInDb) {
          await ctx.db.insert("champions", champion);
        } else {
          await ctx.db.patch(championInDb._id, champion);
        }
      }),
    );
  },
});

export const update = action({
  args: {},
  handler: async (ctx) => {
    const response = await fetchHelper<DataDragonChampionAPIResponse>(
      `${DATA_DRAGON_BASE_URL}/data/en_US/champion.json`,
    );

    const champions = Object.values(response.data).map((champion) => ({
      id: champion.id,
      name: champion.name,
      key: champion.key,
      releaseDate:
        championReleaseDates[champion.id as keyof typeof championReleaseDates],
      imageUrl: `${DATA_DRAGON_BASE_URL}/img/champion/${champion.image.full}`,
    }));

    await ctx.runMutation(internal.champions.store, {
      champions,
    });
  },
});
