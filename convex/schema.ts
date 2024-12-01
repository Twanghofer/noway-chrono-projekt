import { defineSchema, defineTable } from "convex/server";
import { v } from "convex/values";

export const championSchema = {
  name: v.string(),
  id: v.string(),
  key: v.string(),
  releaseDate: v.string(),
  imageUrl: v.string(),
  isHidden: v.optional(v.boolean()),
};

export const matchSchema = {
  id: v.string(),
  champion: v.id("champions"),
  win: v.boolean(),
  timestamp: v.number(),
  playerStats: v.object({
    kills: v.number(),
    deaths: v.number(),
    assists: v.number(),
  }),
};

export default defineSchema({
  champions: defineTable(championSchema)
    .index("by_champion_id", ["id"])
    .index("by_champion_key", ["key"]),
  matches: defineTable(matchSchema)
    .index("by_match_id", ["id"])
    .index("by_champion", ["champion"]),
});
