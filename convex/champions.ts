import { v } from "convex/values";
import { internal } from "./_generated/api";
import {
  action,
  internalMutation,
  internalQuery,
  query,
} from "./_generated/server";
import { fetchHelper } from "./lib/api";
import { championReleaseDates } from "./lib/constants";
import { championSchema } from "./schema";

const DATA_DRAGON_BASE_URL = "https://ddragon.leagueoflegends.com/cdn/14.23.1";

type DataDragonChampionAPIResponse = {
  type: string;
  format: string;
  version: string;
  data: {
    [id: string]: {
      name: string;
      id: string;
      key: string;
    };
  };
};

export const list = query({
  args: {},
  handler: async (ctx) => {
    const champions = await ctx.db.query("champions").collect();
    return champions.sort(
      (a, b) =>
        new Date(a.releaseDate).getTime() - new Date(b.releaseDate).getTime(),
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
      imageUrl: `${DATA_DRAGON_BASE_URL}/img/champion/${champion.id}.png`,
    }));

    await ctx.scheduler.runAfter(0, internal.champions.store, {
      champions,
    });
  },
});
